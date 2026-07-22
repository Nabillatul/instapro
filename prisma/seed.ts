import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Buat akun admin default
  const adminPassword = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@instapro.co.id" },
    update: {},
    create: {
      name: "Admin Instapro",
      email: "admin@instapro.co.id",
      password: adminPassword,
      role: "admin",
      phone: "08217710106",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  console.log("✅ Database seed completed successfully.");
  console.log("---");
  console.log("Login admin:");
  console.log("  Email   : admin@instapro.co.id");
  console.log("  Password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
