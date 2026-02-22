import prisma from "./index";

const plans = [
  // Dollar Plans (Stripe)
  { name: "Single Application", credits: 1, price: 5.0, currency: "USD" },
  { name: "3 Applications Pack", credits: 3, price: 12.0, currency: "USD" },
  { name: "5 Applications Pack", credits: 5, price: 18.0, currency: "USD" },
  
  // Naira Plans (Paystack)
  { name: "Single Application", credits: 1, price: 2000.0, currency: "NGN" },
  { name: "3 Applications Pack", credits: 3, price: 5000.0, currency: "NGN" },
  { name: "5 Applications Pack", credits: 5, price: 8000.0, currency: "NGN" },
];

async function main() {
  console.log("Seeding payment plans...");
  
  for (const plan of plans) {
    await prisma.paymentPlan.upsert({
      where: {
        id: `${plan.currency.toLowerCase()}-${plan.credits}`,
      },
      update: {
        ...plan,
      },
      create: {
        id: `${plan.currency.toLowerCase()}-${plan.credits}`,
        ...plan,
      },
    });
  }
  
  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // No need to disconnect as the process will end
  });
