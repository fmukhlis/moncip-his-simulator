import "dotenv/config"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { Prisma, PrismaClient } from "../generated/prisma/client"

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function seedUnits() {
  const units = [
    { code: "OPD-GEN", name: "Poliklinik Umum", active: true },
    { code: "ER", name: "Instalasi Gawat Darurat", active: true },
    { code: "IPD-MWR", name: "Rawat Inap Mawar", active: true },
  ]

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { code: unit.code },
      update: {
        name: unit.name,
        active: unit.active,
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

async function main() {
  console.log("Seeding started...")

  await seedUnits()
  await seedProviders()

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
