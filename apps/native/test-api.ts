import { client } from "./utils/orpc";

async function testCategories() {
  try {
    const categories = await client.job.getCategories();
    console.log("Categories:", categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

testCategories();
