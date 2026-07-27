// Script to clear base64 images from the database
// Run: node prisma/clear-base64.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Scanning for users with base64 images...");

  const users = await prisma.user.findMany({
    select: { id: true, email: true, image: true },
  });

  let cleared = 0;
  for (const user of users) {
    if (user.image && user.image.startsWith("data:image/")) {
      console.log(`🧹 Clearing base64 image for: ${user.email} (${Math.round(user.image.length / 1024)}KB)`);
      await prisma.user.update({
        where: { id: user.id },
        data: { image: null },
      });
      cleared++;
    }
  }

  if (cleared === 0) {
    console.log("✅ No base64 images found in database. All clean!");
  } else {
    console.log(`✅ Cleared ${cleared} base64 image(s) from database.`);
    console.log("ℹ️  Users will need to re-upload their photos.");
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
