import 'dotenv/config';
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./model/User.js";
import Product from "./model/Product.js";
import Order from "./model/Order.js";
import connectDB from "./config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getProductsFromSeedData = (dir) => {
  let products = [];
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return products;
  }
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      products = products.concat(getProductsFromSeedData(filePath));
    } else if (file === 'product.json') {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const product = JSON.parse(fileContent);
        products.push(product);
      } catch (err) {
        console.error(`Error parsing ${filePath}: ${err.message}`);
      }
    }
  }
  return products;
};

const importData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Existing data cleared.");

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const userPassword = await bcrypt.hash("user123", salt);

    // Create users
    const createdUsers = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@shopnest.com",
        password: adminPassword,
        role: "admin",
        verified: true,
      },
      {
        name: "John Doe",
        email: "john@shopnest.com",
        password: userPassword,
        role: "user",
        verified: true,
      },
      {
        name: "Jane Smith",
        email: "jane@shopnest.com",
        password: userPassword,
        role: "user",
        verified: true,
      },
    ]);

    const adminUser = createdUsers[0]._id;
    const user1 = createdUsers[1]._id;
    const user2 = createdUsers[2]._id;

    console.log("Users seeded successfully.");

    // Sample Products loaded dynamically from seedData
    const seedDataPath = path.join(__dirname, "../seedData");
    const sampleProducts = getProductsFromSeedData(seedDataPath);
    console.log(`Loaded ${sampleProducts.length} products from seedData.`);
    
    if (sampleProducts.length === 0) {
      throw new Error("No products found in seedData folder.");
    }

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log("Products seeded successfully.");

    // Sample Orders for Analytics testing
    const sampleOrders = [
      {
        user: user1,
        products: [
          {
            product: createdProducts[0]._id,
            quantity: 1,
          },
          {
            product: createdProducts[4]._id,
            quantity: 2,
          },
        ],
        totalAmount: 249.97,
        address: {
          fullName: "John Doe",
          street: "123 Main St",
          city: "New York",
          postalCode: "10001",
          country: "USA",
        },
        paymentId: "pay_sample_001",
        paymentResult: {
          id: "pay_sample_001",
          status: "success",
          update_time: new Date().toISOString(),
          email_address: "john@shopnest.com",
        },
        status: "delivered",
      },
      {
        user: user2,
        products: [
          {
            product: createdProducts[1]._id,
            quantity: 1,
          },
        ],
        totalAmount: 129.50,
        address: {
          fullName: "Jane Smith",
          street: "456 Oak Ave",
          city: "Los Angeles",
          postalCode: "90001",
          country: "USA",
        },
        paymentId: "pay_sample_002",
        paymentResult: {
          id: "pay_sample_002",
          status: "success",
          update_time: new Date().toISOString(),
          email_address: "jane@shopnest.com",
        },
        status: "shipped",
      },
      {
        user: user1,
        products: [
          {
            product: createdProducts[7]._id,
            quantity: 1,
          },
          {
            product: createdProducts[8]._id,
            quantity: 1,
          },
        ],
        totalAmount: 54.98,
        address: {
          fullName: "John Doe",
          street: "123 Main St",
          city: "New York",
          postalCode: "10001",
          country: "USA",
        },
        paymentId: "pay_sample_003",
        paymentResult: {
          id: "pay_sample_003",
          status: "success",
          update_time: new Date().toISOString(),
          email_address: "john@shopnest.com",
        },
        status: "pending",
      },
    ];

    await Order.insertMany(sampleOrders);
    console.log("Orders seeded successfully.");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`Error during data seeding: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data destroyed successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`Error during data destruction: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
