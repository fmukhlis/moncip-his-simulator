import "dotenv/config"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { OrderableServiceType, PrismaClient } from "../generated/prisma/client"

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
  const serviceSeeds = [
    // Hematology
    {
      code: "CBC",
      name: "Complete Blood Count (CBC)",
      type: OrderableServiceType.PANEL,
      category: "Hematology",
      description: "Routine hematology panel including blood cell counts and red cell indices.",
      price: null,
    },
    {
      code: "WBC",
      name: "White Blood Cell Count (WBC)",
      type: OrderableServiceType.SINGLE,
      category: "Hematology",
      description: "White blood cell count.",
      price: null,
    },
    {
      code: "RBC",
      name: "Red Blood Cell Count (RBC)",
      type: OrderableServiceType.SINGLE,
      category: "Hematology",
      description: "Red blood cell count.",
      price: null,
    },
    {
      code: "HGB",
      name: "Hemoglobin (Hgb)",
      type: OrderableServiceType.SINGLE,
      category: "Hematology",
      description: "Hemoglobin concentration.",
      price: null,
    },
    {
      code: "HCT",
      name: "Hematocrit (Hct)",
      type: OrderableServiceType.SINGLE,
      category: "Hematology",
      description: "Hematocrit.",
      price: null,
    },
    {
      code: "PLT",
      name: "Platelet Count",
      type: OrderableServiceType.SINGLE,
      category: "Hematology",
      description: "Platelet count.",
      price: null,
    },
    {
      code: "MCV",
      name: "Mean Corpuscular Volume (MCV)",
      type: OrderableServiceType.SINGLE,
      category: "Hematology",
      description: "Average red blood cell size.",
      price: null,
    },
    {
      code: "MCH",
      name: "Mean Corpuscular Hemoglobin (MCH)",
      type: OrderableServiceType.SINGLE,
      category: "Hematology",
      description: "Average hemoglobin amount per red blood cell.",
      price: null,
    },
    {
      code: "MCHC",
      name: "Mean Corpuscular Hemoglobin Concentration (MCHC)",
      type: OrderableServiceType.SINGLE,
      category: "Hematology",
      description: "Average hemoglobin concentration in red blood cells.",
      price: null,
    },

    // Chemistry
    {
      code: "BMP",
      name: "Basic Metabolic Panel (BMP)",
      type: OrderableServiceType.PANEL,
      category: "Chemistry",
      description: "Basic metabolic panel with electrolytes, glucose, calcium, and renal markers.",
      price: null,
    },
    {
      code: "CMP",
      name: "Comprehensive Metabolic Panel (CMP)",
      type: OrderableServiceType.PANEL,
      category: "Chemistry",
      description:
        "Comprehensive metabolic panel with electrolytes, renal markers, protein, and liver-related chemistry.",
      price: null,
    },
    {
      code: "LFT",
      name: "Liver Function Panel",
      type: OrderableServiceType.PANEL,
      category: "Chemistry",
      description: "Common liver-related chemistry panel.",
      price: null,
    },

    {
      code: "GLU",
      name: "Glucose",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Blood glucose.",
      price: null,
    },
    {
      code: "CA",
      name: "Calcium",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Total calcium.",
      price: null,
    },
    {
      code: "NA",
      name: "Sodium",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Serum sodium.",
      price: null,
    },
    {
      code: "K",
      name: "Potassium",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Serum potassium.",
      price: null,
    },
    {
      code: "CO2",
      name: "Carbon Dioxide (CO2 / Bicarbonate)",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Carbon dioxide / bicarbonate.",
      price: null,
    },
    {
      code: "CL",
      name: "Chloride",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Serum chloride.",
      price: null,
    },
    {
      code: "BUN",
      name: "Blood Urea Nitrogen (BUN)",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Blood urea nitrogen.",
      price: null,
    },
    {
      code: "CREA",
      name: "Creatinine",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Serum creatinine.",
      price: null,
    },
    {
      code: "ALB",
      name: "Albumin",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Serum albumin.",
      price: null,
    },
    {
      code: "TP",
      name: "Total Protein",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Total serum protein.",
      price: null,
    },
    {
      code: "ALP",
      name: "Alkaline Phosphatase (ALP)",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Alkaline phosphatase.",
      price: null,
    },
    {
      code: "ALT",
      name: "Alanine Aminotransferase (ALT)",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Alanine aminotransferase.",
      price: null,
    },
    {
      code: "AST",
      name: "Aspartate Aminotransferase (AST)",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Aspartate aminotransferase.",
      price: null,
    },
    {
      code: "TBIL",
      name: "Total Bilirubin",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Total bilirubin.",
      price: null,
    },
    {
      code: "GGT",
      name: "Gamma-Glutamyl Transferase (GGT)",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Gamma-glutamyl transferase.",
      price: null,
    },

    {
      code: "LIPID",
      name: "Lipid Panel",
      type: OrderableServiceType.PANEL,
      category: "Chemistry",
      description: "Standard lipid profile.",
      price: null,
    },
    {
      code: "CHOL",
      name: "Total Cholesterol",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Total cholesterol.",
      price: null,
    },
    {
      code: "HDL",
      name: "HDL Cholesterol",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "High-density lipoprotein cholesterol.",
      price: null,
    },
    {
      code: "LDL",
      name: "LDL Cholesterol",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Low-density lipoprotein cholesterol.",
      price: null,
    },
    {
      code: "TG",
      name: "Triglycerides",
      type: OrderableServiceType.SINGLE,
      category: "Chemistry",
      description: "Triglycerides.",
      price: null,
    },

    // Coagulation
    {
      code: "PT_INR",
      name: "Prothrombin Time / INR (PT/INR)",
      type: OrderableServiceType.PANEL,
      category: "Coagulation",
      description: "Prothrombin time with INR.",
      price: null,
    },
    {
      code: "PT",
      name: "Prothrombin Time (PT)",
      type: OrderableServiceType.SINGLE,
      category: "Coagulation",
      description: "Prothrombin time.",
      price: null,
    },
    {
      code: "INR",
      name: "International Normalized Ratio (INR)",
      type: OrderableServiceType.SINGLE,
      category: "Coagulation",
      description: "International normalized ratio.",
      price: null,
    },
    {
      code: "PTT",
      name: "Partial Thromboplastin Time (PTT)",
      type: OrderableServiceType.SINGLE,
      category: "Coagulation",
      description: "Partial thromboplastin time.",
      price: null,
    },

    // Endocrinology / Diabetes
    {
      code: "THYROID_SCREEN",
      name: "Thyroid Screen (TSH + Free T4)",
      type: OrderableServiceType.PANEL,
      category: "Endocrinology",
      description: "Basic thyroid function screening panel.",
      price: null,
    },
    {
      code: "TSH",
      name: "TSH",
      type: OrderableServiceType.SINGLE,
      category: "Endocrinology",
      description: "Thyroid-stimulating hormone.",
      price: null,
    },
    {
      code: "FT4",
      name: "Free T4",
      type: OrderableServiceType.SINGLE,
      category: "Endocrinology",
      description: "Free thyroxine.",
      price: null,
    },
    {
      code: "HBA1C",
      name: "Hemoglobin A1c (HbA1c)",
      type: OrderableServiceType.SINGLE,
      category: "Endocrinology",
      description: "Average blood glucose over the prior 2 to 3 months.",
      price: null,
    },

    // Urinalysis
    {
      code: "UA",
      name: "Urinalysis",
      type: OrderableServiceType.PANEL,
      category: "Urinalysis",
      description: "Routine urinalysis with physical, chemical, and microscopic elements.",
      price: null,
    },
    {
      code: "UA_COLOR",
      name: "Urine Color",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Urine color.",
      price: null,
    },
    {
      code: "UA_APPEARANCE",
      name: "Urine Appearance / Clarity",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Urine appearance or clarity.",
      price: null,
    },
    {
      code: "UA_SG",
      name: "Urine Specific Gravity",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Urine specific gravity.",
      price: null,
    },
    {
      code: "UA_PH",
      name: "Urine pH",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Urine pH.",
      price: null,
    },
    {
      code: "UA_PROTEIN",
      name: "Urine Protein",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Urine protein.",
      price: null,
    },
    {
      code: "UA_GLUCOSE",
      name: "Urine Glucose",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Urine glucose.",
      price: null,
    },
    {
      code: "UA_KETONES",
      name: "Urine Ketones",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Urine ketones.",
      price: null,
    },
    {
      code: "UA_BILIRUBIN",
      name: "Urine Bilirubin",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Urine bilirubin.",
      price: null,
    },
    {
      code: "UA_BLOOD",
      name: "Urine Blood / Hemoglobin",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Urine blood or hemoglobin screen.",
      price: null,
    },
    {
      code: "UA_NITRITE",
      name: "Urine Nitrite",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Urine nitrite.",
      price: null,
    },
    {
      code: "UA_LE",
      name: "Urine Leukocyte Esterase",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Urine leukocyte esterase.",
      price: null,
    },
    {
      code: "UA_WBC",
      name: "Urine White Blood Cells",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Microscopic urine white blood cells.",
      price: null,
    },
    {
      code: "UA_RBC",
      name: "Urine Red Blood Cells",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Microscopic urine red blood cells.",
      price: null,
    },
    {
      code: "UA_BACTERIA",
      name: "Urine Bacteria",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Microscopic urine bacteria.",
      price: null,
    },
    {
      code: "UA_EPITHELIAL",
      name: "Urine Epithelial Cells",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Microscopic urine epithelial cells.",
      price: null,
    },
    {
      code: "UA_CASTS",
      name: "Urine Casts",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Urine casts.",
      price: null,
    },
    {
      code: "UA_CRYSTALS",
      name: "Urine Crystals",
      type: OrderableServiceType.SINGLE,
      category: "Urinalysis",
      description: "Urine crystals.",
      price: null,
    },

    // Pregnancy testing
    {
      code: "U_PREG",
      name: "Urine Pregnancy Test (hCG)",
      type: OrderableServiceType.SINGLE,
      category: "Pregnancy Testing",
      description: "Qualitative urine hCG test.",
      price: null,
    },
  ]

  const priceMap: Record<string, string> = {
    // Hematology
    CBC: "65000.00",
    WBC: "25000.00",
    RBC: "25000.00",
    HGB: "22000.00",
    HCT: "22000.00",
    PLT: "25000.00",
    MCV: "20000.00",
    MCH: "20000.00",
    MCHC: "20000.00",

    // Chemistry
    BMP: "140000.00",
    CMP: "235000.00",
    LFT: "115000.00",

    GLU: "25000.00",
    CA: "30000.00",
    NA: "45000.00",
    K: "45000.00",
    CO2: "50000.00",
    CL: "45000.00",
    BUN: "30000.00",
    CREA: "30000.00",
    ALB: "30000.00",
    TP: "30000.00",
    ALP: "45000.00",
    ALT: "35000.00",
    AST: "35000.00",
    TBIL: "45000.00",
    GGT: "50000.00",

    LIPID: "120000.00",
    CHOL: "35000.00",
    HDL: "45000.00",
    LDL: "50000.00",
    TG: "40000.00",

    // Coagulation
    PT_INR: "90000.00",
    PT: "55000.00",
    INR: "45000.00",
    PTT: "75000.00",

    // Endocrinology / Diabetes
    THYROID_SCREEN: "250000.00",
    TSH: "140000.00",
    FT4: "150000.00",
    HBA1C: "125000.00",

    // Urinalysis
    UA: "40000.00",
    UA_COLOR: "15000.00",
    UA_APPEARANCE: "15000.00",
    UA_SG: "15000.00",
    UA_PH: "15000.00",
    UA_PROTEIN: "15000.00",
    UA_GLUCOSE: "15000.00",
    UA_KETONES: "15000.00",
    UA_BILIRUBIN: "15000.00",
    UA_BLOOD: "15000.00",
    UA_NITRITE: "15000.00",
    UA_LE: "15000.00",
    UA_WBC: "20000.00",
    UA_RBC: "20000.00",
    UA_BACTERIA: "20000.00",
    UA_EPITHELIAL: "20000.00",
    UA_CASTS: "20000.00",
    UA_CRYSTALS: "20000.00",

    // Pregnancy testing
    U_PREG: "35000.00",
  }

  const panelComponentMap: Record<string, string[]> = {
    CBC: ["WBC", "RBC", "HGB", "HCT", "PLT", "MCV", "MCH", "MCHC"],
    BMP: ["GLU", "CA", "NA", "K", "CO2", "CL", "BUN", "CREA"],
    CMP: ["GLU", "CA", "NA", "K", "CO2", "CL", "BUN", "CREA", "ALB", "TP", "ALP", "ALT", "AST", "TBIL"],
    LFT: ["ALB", "TP", "ALP", "ALT", "AST", "GGT", "TBIL"],
    LIPID: ["CHOL", "HDL", "LDL", "TG"],
    PT_INR: ["PT", "INR"],
    THYROID_SCREEN: ["TSH", "FT4"],
    UA: [
      "UA_COLOR",
      "UA_APPEARANCE",
      "UA_SG",
      "UA_PH",
      "UA_PROTEIN",
      "UA_GLUCOSE",
      "UA_KETONES",
      "UA_BILIRUBIN",
      "UA_BLOOD",
      "UA_NITRITE",
      "UA_LE",
      "UA_WBC",
      "UA_RBC",
      "UA_BACTERIA",
      "UA_EPITHELIAL",
      "UA_CASTS",
      "UA_CRYSTALS",
    ],
  }

  const topLevelOrderableCodes = [
    "CBC",
    "BMP",
    "CMP",
    "LFT",
    "LIPID",
    "PT_INR",
    "PTT",
    "THYROID_SCREEN",
    "TSH",
    "FT4",
    "HBA1C",
    "UA",
    "U_PREG",
  ] as const

  await prisma.$transaction(async (tx) => {
    for (const service of serviceSeeds) {
      await tx.orderableService.upsert({
        where: { code: service.code },
        update: {
          name: service.name,
          type: service.type,
          category: service.category,
          description: service.description ?? null,
          price: priceMap[service.code] ?? null,
          deletedAt: null,
        },
        create: {
          code: service.code,
          name: service.name,
          type: service.type,
          category: service.category,
          description: service.description ?? null,
          price: priceMap[service.code] ?? null,
        },
      })
    }

    const seeded = await tx.orderableService.findMany({
      where: {
        code: {
          in: serviceSeeds.map((s) => s.code),
        },
      },
      select: {
        id: true,
        code: true,
      },
    })

    const idByCode = Object.fromEntries(seeded.map((row) => [row.code, row.id]))

    for (const [panelCode, componentCodes] of Object.entries(panelComponentMap)) {
      if (!idByCode[panelCode]) {
        throw new Error(`Missing panel service code: ${panelCode}`)
      }

      for (const componentCode of componentCodes) {
        if (!idByCode[componentCode]) {
          throw new Error(`Missing component service code: ${componentCode}`)
        }
      }
    }

    const panelIds = Object.keys(panelComponentMap).map((code) => idByCode[code]!)

    await tx.orderableServiceComponent.deleteMany({
      where: {
        panelServiceId: {
          in: panelIds,
        },
      },
    })

    await tx.orderableServiceComponent.createMany({
      data: Object.entries(panelComponentMap).flatMap(([panelCode, componentCodes]) =>
        componentCodes.map((componentCode) => ({
          panelServiceId: idByCode[panelCode]!,
          componentServiceId: idByCode[componentCode]!,
        }))
      ),
      skipDuplicates: true,
    })
  })

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
