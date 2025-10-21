from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
import numpy as np
import random
import pandas as pd
from io import StringIO

app = FastAPI(title="DNA Evolution Simulator API")


# ---- Data Classes ----
class Individual:
    def __init__(self, maternal, paternal):
        self.maternal = maternal
        self.paternal = paternal


# ---- Genetic Functions ----
def recombine(chrom1, chrom2):
    """Perform one crossover between two chromosomes."""
    L = len(chrom1)
    k = random.randint(0, L - 1)
    if random.random() < 0.5:
        return chrom1[:k + 1] + chrom2[k + 1:]
    else:
        return chrom2[:k + 1] + chrom1[k + 1:]


def reproduce(mother, father):
    """Generate one offspring from two parents with recombination."""
    maternal_chrom = recombine(mother.maternal, mother.paternal)
    paternal_chrom = recombine(father.maternal, father.paternal)
    return Individual(maternal_chrom, paternal_chrom)


def read_vcf_file(vcf_content: str):
    """Parse a minimal VCF (tab-delimited) into a list of Individuals."""
    lines = [l for l in vcf_content.splitlines() if not l.startswith("##")]
    df = pd.read_csv(StringIO("\n".join(lines)), sep="\t")
    ind_cols = [col for col in df.columns if col.startswith("IND")]

    individuals = []
    for ind in ind_cols:
        maternal, paternal = [], []
        for gt in df[ind]:
            gt = str(gt)
            if "|" in gt:
                a, b = gt.split("|")
            elif "/" in gt:
                a, b = gt.split("/")
            else:
                continue
            maternal.append(int(a))
            paternal.append(int(b))
        individuals.append(Individual(maternal, paternal))
    return individuals


# ---- Fitness Functions ----
def fitness_neutral(ind):
    return 1.0


def fitness_snp_beneficial(ind, locus=0, w_het=1.5, w_hom=2.0):
    geno = ind.maternal[locus] + ind.paternal[locus]
    if geno == 1:
        return w_het
    elif geno == 2:
        return w_hom
    return 1.0


def fitness_snp_deleterious(ind, locus=0, w_het=0.9, w_hom=0.8):
    geno = ind.maternal[locus] + ind.paternal[locus]
    if geno == 1:
        return w_het
    elif geno == 2:
        return w_hom
    return 1.0


def evolve_population(pop, generations, fitness_func):
    """Evolve population across generations with selection."""
    N = len(pop)
    for _ in range(generations):
        fits = np.array([fitness_func(ind) for ind in pop])
        new_pop = []
        for _ in range(N):
            p1 = np.random.choice(range(N), p=fits / fits.sum())
            probs2 = np.copy(fits)
            probs2[p1] = 0
            probs2 /= probs2.sum()
            p2 = np.random.choice(range(N), p=probs2)
            new_pop.append(reproduce(pop[p1], pop[p2]))
        pop = new_pop
    return pop


def allele_frequencies(pop):
    """Compute allele frequency per SNP."""
    N = len(pop)
    L = len(pop[0].maternal)
    total_alt = np.zeros(L)
    for ind in pop:
        total_alt += np.array(ind.maternal) + np.array(ind.paternal)
    return (total_alt / (2 * N)).tolist()


# ---- API Endpoints ----
@app.post("/simulate_file")
async def simulate_from_vcf(
    file: UploadFile = File(...),
    generations: int = Form(10),
    selection: str = Form("neutral")  # neutral | beneficial | deleterious
):
    """Run simulation using uploaded VCF data."""
    content = (await file.read()).decode("utf-8")
    population = read_vcf_file(content)

    # Select fitness model
    if selection == "neutral":
        fitness_func = fitness_neutral
    elif selection == "beneficial":
        fitness_func = fitness_snp_beneficial
    elif selection == "deleterious":
        fitness_func = fitness_snp_deleterious
    else:
        return {"error": "Invalid selection type."}

    evolved = evolve_population(population, generations, fitness_func)
    freqs = allele_frequencies(evolved)

    return {
        "file": file.filename,
        "selection_model": selection,
        "generations": generations,
        "final_frequencies": freqs,
        "mean_frequency": float(np.mean(freqs))
    }


@app.get("/")
def root():
    return {"message": "DNA Evolution Simulator backend with VCF upload and selection is running!"}
