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
      name: "Darah Lengkap",
      type: OrderableType.PANEL,
      price: "50000",
      category: "Hematology",
      description: "Complete blood count",
    },
    {
      code: "GLU-R",
      name: "Glukosa Sewaktu",
      type: OrderableType.SINGLE,
      price: "25000",
      category: "Chemistry",
      description: "Pemeriksaan glukosa sewaktu",
    },
    {
      code: "UREUM",
      name: "Ureum",
      type: OrderableType.SINGLE,
      price: "30000",
      category: "Chemistry",
      description: "Pemeriksaan ureum serum",
    },
    {
      code: "LFT",
      name: "Liver Function Test",
      type: OrderableType.PANEL,
      price: "120000",
      category: "Chemistry",
      description: "Panel fungsi hati",
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
