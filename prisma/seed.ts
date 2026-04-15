import "dotenv/config"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { OrderableType, PrismaClient } from "../generated/prisma/client"

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function seedUnits() {
  const units = [
    { code: "OPD-GEN", name: "Poliklinik Umum", isActive: true },
    { code: "ER", name: "Instalasi Gawat Darurat", isActive: true },
    { code: "IPD-MWR", name: "Rawat Inap Mawar", isActive: true },
  ]

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { code: unit.code },
      update: {
        name: unit.name,
        isActive: unit.isActive,
      },
      create: unit,
    })
  }

  console.log("✅ Units seeded")
}

async function seedProviders() {
  const providers = [
    { code: "DR001", name: "Dr. Andi", isActive: true },
    { code: "DR002", name: "Dr. Budi", isActive: true },
    { code: "DR003", name: "Dr. Clara", isActive: true },
  ]

  for (const provider of providers) {
    await prisma.provider.upsert({
      where: { code: provider.code },
      update: {
        name: provider.name,
        isActive: provider.isActive,
      },
      create: provider,
    })
  }

  console.log("✅ Providers seeded")
}

export async function seedOrderableServices() {
  const items = [
    {
      code: "CBC",
      name: "Complete Blood Count",
      type: OrderableType.PANEL,
      price: "80000",
      category: "Hematology",
      description: "Complete blood count panel",
    },
    {
      code: "CBC-MAN",
      name: "Complete Blood Count Manual",
      type: OrderableType.PANEL,
      price: "60000",
      category: "Hematology",
      description: "Manual complete blood count",
    },
    {
      code: "HB",
      name: "Hemoglobin",
      type: OrderableType.SINGLE,
      price: "20000",
      category: "Hematology",
      description: "Hemoglobin test",
    },
    {
      code: "HB-HCT",
      name: "Hemoglobin and Hematocrit",
      type: OrderableType.PANEL,
      price: "30000",
      category: "Hematology",
      description: "Combined hemoglobin and hematocrit test",
    },
    {
      code: "HCT",
      name: "Hematocrit",
      type: OrderableType.SINGLE,
      price: "10000",
      category: "Hematology",
      description: "Hematocrit test",
    },
    {
      code: "WBC",
      name: "Leukocyte Count",
      type: OrderableType.SINGLE,
      price: "20000",
      category: "Hematology",
      description: "White blood cell count",
    },
    {
      code: "PLT",
      name: "Platelet Count",
      type: OrderableType.SINGLE,
      price: "20000",
      category: "Hematology",
      description: "Platelet count",
    },
    {
      code: "RBC",
      name: "Erythrocyte Count",
      type: OrderableType.SINGLE,
      price: "20000",
      category: "Hematology",
      description: "Red blood cell count",
    },
    {
      code: "DIFF",
      name: "Differential Count",
      type: OrderableType.SINGLE,
      price: "25000",
      category: "Hematology",
      description: "Differential leukocyte count",
    },
    {
      code: "ESR",
      name: "Erythrocyte Sedimentation Rate",
      type: OrderableType.SINGLE,
      price: "20000",
      category: "Hematology",
      description: "ESR test",
    },
    {
      code: "ABO-RH",
      name: "Blood Group and Rhesus",
      type: OrderableType.PANEL,
      price: "18000",
      category: "Hematology",
      description: "ABO blood group and Rh typing",
    },

    {
      code: "GLU-R",
      name: "Random Blood Glucose",
      type: OrderableType.SINGLE,
      price: "20000",
      category: "Clinical Chemistry",
      description: "Random blood glucose test",
    },
    {
      code: "GLU-F",
      name: "Fasting Blood Glucose",
      type: OrderableType.SINGLE,
      price: "27500",
      category: "Clinical Chemistry",
      description: "Fasting blood glucose test",
    },
    {
      code: "GLU-2PP",
      name: "2-Hour Postprandial Glucose",
      type: OrderableType.SINGLE,
      price: "27500",
      category: "Clinical Chemistry",
      description: "2-hour postprandial glucose test",
    },
    {
      code: "HBA1C",
      name: "HbA1c",
      type: OrderableType.SINGLE,
      price: "183800",
      category: "Clinical Chemistry",
      description: "Glycated hemoglobin test",
    },
    {
      code: "CHOL",
      name: "Total Cholesterol",
      type: OrderableType.SINGLE,
      price: "30000",
      category: "Clinical Chemistry",
      description: "Total cholesterol test",
    },
    {
      code: "HDL",
      name: "HDL Cholesterol",
      type: OrderableType.SINGLE,
      price: "35600",
      category: "Clinical Chemistry",
      description: "High-density lipoprotein cholesterol test",
    },
    {
      code: "LDL",
      name: "LDL Cholesterol",
      type: OrderableType.SINGLE,
      price: "44200",
      category: "Clinical Chemistry",
      description: "Low-density lipoprotein cholesterol test",
    },
    {
      code: "TG",
      name: "Triglycerides",
      type: OrderableType.SINGLE,
      price: "45000",
      category: "Clinical Chemistry",
      description: "Triglyceride test",
    },
    {
      code: "LIPID",
      name: "Lipid Profile",
      type: OrderableType.PANEL,
      price: "97000",
      category: "Clinical Chemistry",
      description: "Lipid profile panel",
    },
    {
      code: "UA",
      name: "Uric Acid",
      type: OrderableType.SINGLE,
      price: "25000",
      category: "Clinical Chemistry",
      description: "Uric acid test",
    },
    {
      code: "UREA",
      name: "Urea",
      type: OrderableType.SINGLE,
      price: "30000",
      category: "Clinical Chemistry",
      description: "Urea test",
    },
    {
      code: "CRE",
      name: "Creatinine",
      type: OrderableType.SINGLE,
      price: "35100",
      category: "Clinical Chemistry",
      description: "Creatinine test",
    },
    {
      code: "AST",
      name: "AST (SGOT)",
      type: OrderableType.SINGLE,
      price: "37600",
      category: "Clinical Chemistry",
      description: "Aspartate aminotransferase test",
    },
    {
      code: "ALT",
      name: "ALT (SGPT)",
      type: OrderableType.SINGLE,
      price: "37600",
      category: "Clinical Chemistry",
      description: "Alanine aminotransferase test",
    },
    {
      code: "LFT",
      name: "Liver Function Panel",
      type: OrderableType.PANEL,
      price: "68900",
      category: "Clinical Chemistry",
      description: "Liver function panel based on AST and ALT service grouping",
    },
    {
      code: "BILT",
      name: "Total Bilirubin",
      type: OrderableType.SINGLE,
      price: "36400",
      category: "Clinical Chemistry",
      description: "Total bilirubin test",
    },
    {
      code: "BILD",
      name: "Direct Bilirubin",
      type: OrderableType.SINGLE,
      price: "36400",
      category: "Clinical Chemistry",
      description: "Direct bilirubin test",
    },
    {
      code: "TP",
      name: "Total Protein",
      type: OrderableType.SINGLE,
      price: "36400",
      category: "Clinical Chemistry",
      description: "Total protein test",
    },
    {
      code: "ALB",
      name: "Albumin",
      type: OrderableType.SINGLE,
      price: "36400",
      category: "Clinical Chemistry",
      description: "Albumin test",
    },
    {
      code: "ELEC",
      name: "Electrolyte Panel",
      type: OrderableType.PANEL,
      price: "84250",
      category: "Clinical Chemistry",
      description: "Electrolyte panel for potassium, sodium, and chloride",
    },
    {
      code: "CKMB",
      name: "CK-MB",
      type: OrderableType.SINGLE,
      price: "57500",
      category: "Clinical Chemistry",
      description: "Cardiac CK-MB test",
    },

    {
      code: "UA-COMP",
      name: "Complete Urinalysis",
      type: OrderableType.PANEL,
      price: "25000",
      category: "Urinalysis",
      description: "Complete urinalysis",
    },
    {
      code: "UA-PROT",
      name: "Urine Protein",
      type: OrderableType.SINGLE,
      price: "5000",
      category: "Urinalysis",
      description: "Urine protein test",
    },
    {
      code: "UA-GLU",
      name: "Urine Glucose / Reduction",
      type: OrderableType.SINGLE,
      price: "5000",
      category: "Urinalysis",
      description: "Urine glucose or reduction test",
    },
    {
      code: "UA-SED",
      name: "Urine Sediment",
      type: OrderableType.SINGLE,
      price: "15000",
      category: "Urinalysis",
      description: "Urine sediment examination",
    },
    {
      code: "HCG-UR",
      name: "Urine Pregnancy Test",
      type: OrderableType.SINGLE,
      price: "25000",
      category: "Urinalysis",
      description: "Urine hCG pregnancy test",
    },

    {
      code: "FOBT",
      name: "Fecal Occult Blood",
      type: OrderableType.SINGLE,
      price: "10000",
      category: "Microbiology & Parasitology",
      description: "Fecal occult blood test",
    },
    {
      code: "STOOL-COMP",
      name: "Complete Stool Analysis",
      type: OrderableType.PANEL,
      price: "25000",
      category: "Microbiology & Parasitology",
      description: "Complete stool examination",
    },
    {
      code: "AFB",
      name: "AFB Smear",
      type: OrderableType.SINGLE,
      price: "25000",
      category: "Microbiology & Parasitology",
      description: "Acid-fast bacilli smear",
    },
    {
      code: "GRAM",
      name: "Gram Stain",
      type: OrderableType.SINGLE,
      price: "25000",
      category: "Microbiology & Parasitology",
      description: "Gram staining examination",
    },
    {
      code: "MALARIA",
      name: "Malaria Smear",
      type: OrderableType.SINGLE,
      price: "30000",
      category: "Microbiology & Parasitology",
      description: "Microscopic malaria examination",
    },

    {
      code: "WIDAL",
      name: "Widal Test",
      type: OrderableType.SINGLE,
      price: "40000",
      category: "Immunoserology",
      description: "Widal serology test",
    },
    {
      code: "HBSAG",
      name: "HBsAg Rapid",
      type: OrderableType.SINGLE,
      price: "35000",
      category: "Immunoserology",
      description: "Rapid hepatitis B surface antigen test",
    },
    {
      code: "HIV-RAPID",
      name: "HIV Rapid Test",
      type: OrderableType.SINGLE,
      price: "80000",
      category: "Immunoserology",
      description: "Rapid HIV screening test",
    },
    {
      code: "SYPH",
      name: "Syphilis Test",
      type: OrderableType.SINGLE,
      price: "35000",
      category: "Immunoserology",
      description: "Syphilis screening test",
    },
    {
      code: "VDRL",
      name: "VDRL",
      type: OrderableType.SINGLE,
      price: "35000",
      category: "Immunoserology",
      description: "Venereal Disease Research Laboratory test",
    },
    {
      code: "CRP",
      name: "C-Reactive Protein",
      type: OrderableType.SINGLE,
      price: "120000",
      category: "Immunoserology",
      description: "C-reactive protein test",
    },
    {
      code: "DENGUE-NS1",
      name: "Dengue NS1 Antigen",
      type: OrderableType.SINGLE,
      price: "131750",
      category: "Immunoserology",
      description: "Dengue NS1 antigen test",
    },
    {
      code: "HCV",
      name: "Anti-HCV Rapid",
      type: OrderableType.SINGLE,
      price: "52500",
      category: "Immunoserology",
      description: "Rapid hepatitis C antibody test",
    },

    {
      code: "PT",
      name: "Prothrombin Time",
      type: OrderableType.SINGLE,
      price: "86100",
      category: "Coagulation",
      description: "Prothrombin time test",
    },
    {
      code: "APTT",
      name: "Activated Partial Thromboplastin Time",
      type: OrderableType.SINGLE,
      price: "89800",
      category: "Coagulation",
      description: "APTT coagulation test",
    },
  ]

  for (const item of items) {
    await prisma.orderableService.upsert({
      where: { code: item.code },
      update: {
        name: item.name,
        type: item.type,
        price: item.price,
        category: item.category,
        description: item.description,
      },
      create: item,
    })
  }

  console.log("✅ Orderable services seeded")
}

async function main() {
  console.log("Seeding started...")

  await seedUnits()
  await seedProviders()
  await seedOrderableServices()

  console.log("🎉 Seed completed")
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
