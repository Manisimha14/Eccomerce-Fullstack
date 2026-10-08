import { faker } from "@faker-js/faker";
import { MongoClient, ObjectId } from "mongodb";

const DB_NAME = "test";
const COLL_NAME = "products";

const MONGO_URI =
  "mongodb+srv://itsmanisimha_db_user:y4yuFul4n69Nh5rJ@cluster0.kgdvihg.mongodb.net";

const BATCH_SIZE = 1000;
const TOTAL_DOCUMENTS = 100;

function generateDocument() {
  return {
    _id: new ObjectId(),
    __v: faker.number.int({ min: 0, max: 20 }),

    category: faker.commerce.department(),

    createdAt: faker.date.past(),

    description: faker.lorem.sentence(),

    image: faker.internet.url(),

    name: faker.commerce.productName(),

    price: faker.number.float({
      min: 1,
      max: 5000,
      fractionDigits: 2,
    }),

    stock: faker.number.int({
      min: 0,
      max: 1000,
    }),

    updatedAt: faker.date.recent(),
  };
}

async function generateMockData() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();

    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);
    const collection = db.collection(COLL_NAME);

    const numBatches = Math.ceil(TOTAL_DOCUMENTS / BATCH_SIZE);

    console.log(`Starting mock data generation for ${DB_NAME}.${COLL_NAME}`);

    console.log(`Total documents to generate: ${TOTAL_DOCUMENTS} documents`);

    console.log(`Batch size: ${BATCH_SIZE} documents per batch`);

    const startTime = new Date();

    for (
      let batchStart = 0;
      batchStart < TOTAL_DOCUMENTS;
      batchStart += BATCH_SIZE
    ) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE, TOTAL_DOCUMENTS);

      const batchSize = batchEnd - batchStart;

      console.log(
        `Generating batch ${
          Math.floor(batchStart / BATCH_SIZE) + 1
        } of ${numBatches} (${batchSize} documents)...`,
      );

      const batchDocuments = [];

      for (let i = 0; i < batchSize; i++) {
        batchDocuments.push(generateDocument());
      }

      await collection.insertMany(batchDocuments);

      console.log("Batch inserted successfully.");
    }

    const endTime = new Date();

    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log("\n=== Mock Data Generation Complete ===");
    console.log(`Total time: ${duration} seconds`);
    console.log(`Collection: ${DB_NAME}.${COLL_NAME}`);
  } catch (error) {
    console.error("Error generating mock data:", error);
  } finally {
    await client.close();
  }
}

generateMockData();
