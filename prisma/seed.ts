import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.agent.createMany({
    data: [
      {
        slug: "ugc-script",
        name: "UGC Script Generator",
        description: "Generates UGC ad scripts from product benefits",
        inputSchema: { productName: "string", usps: ["string"] }
      },
      {
        slug: "static-ads",
        name: "Static Ads Generator",
        description: "Creates static ad concepts from brand kit and offer",
        inputSchema: { offer: "string", audience: "string" }
      },
      {
        slug: "market-research",
        name: "Market Research Agent",
        description: "Summarizes competitor messaging angles",
        inputSchema: { competitors: ["string"], channel: "string" }
      },
      {
        slug: "product-image",
        name: "Product Image Agent",
        description: "Generates product visuals with selected image provider",
        inputSchema: { productName: "string", style: "string" }
      },
      {
        slug: "kling-video",
        name: "Kling Video Agent",
        description: "Generates video job from ad brief",
        inputSchema: { brief: "string", duration: "string" }
      }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
