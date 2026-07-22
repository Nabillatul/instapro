import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const p = new PrismaClient();

async function main() {
  // List all users
  const users = await p.user.findMany({
    select: { id: true, email: true, role: true, password: true }
  });

  console.log("=== All Users ===");
  for (const u of users) {
    console.log(`Email: ${u.email} | Role: ${u.role} | PassHash(first20): ${u.password?.substring(0, 20)}`);
  }

  // Test password reset manually
  const testEmail = users.find(u => u.role === "customer")?.email;
  if (testEmail) {
    const testNewPassword = "testpassword123";
    const hashed = await bcrypt.hash(testNewPassword, 10);
    await p.user.update({ where: { email: testEmail }, data: { password: hashed } });
    console.log(`\n✅ Updated password for ${testEmail} to: "${testNewPassword}"`);

    // Verify
    const updated = await p.user.findUnique({ where: { email: testEmail } });
    const valid = await bcrypt.compare(testNewPassword, updated!.password!);
    console.log(`✅ Password verify: ${valid}`);
  } else {
    console.log("No customer found. Check admin email.");
    const admin = users.find(u => u.role === "admin");
    if (admin) {
      const ok = await bcrypt.compare("password123", admin.password!);
      console.log(`Admin password "password123" valid: ${ok}`);
    }
  }
}

main().catch(console.error).finally(() => p.$disconnect());
