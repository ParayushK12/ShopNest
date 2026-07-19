import 'dotenv/config';
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./model/User.js";
import Product from "./model/Product.js";
import Order from "./model/Order.js";
import connectDB from "./config/db.js";

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

    // Sample Products
    const sampleProducts = [
      {
        name: "Wireless Noise-Canceling Headphones",
        price: 199.99,
        description: "Premium over-ear wireless headphones with industry-leading active noise cancellation, built-in voice assistants, and up to 30 hours of battery life.",
        category: "Electronics",
        stock: 50,
        imageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        rating: 4.8,
        numReviews: 24,
      },
      {
        name: "Smart Fitness Watch",
        price: 129.50,
        description: "Track your workouts, heart rate, sleep quality, and daily activities with this sleek water-resistant smartwatch featuring a 1.4-inch AMOLED display.",
        category: "Electronics",
        stock: 120,
        imageURL: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        rating: 4.5,
        numReviews: 45,
      },
      {
        name: "Ergonomic Mechanical Keyboard",
        price: 89.99,
        description: "Mechanical keyboard featuring tactile switches, customized RGB backlighting, and a comfortable wrist rest design for ultimate productivity and gaming.",
        category: "Electronics",
        stock: 45,
        imageURL: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        rating: 4.6,
        numReviews: 18,
      },
      {
        name: "Vintage Leather Backpack",
        price: 79.99,
        description: "Handcrafted genuine leather backpack with a dedicated 15-inch laptop compartment, multiple storage pockets, and adjustable shoulder straps.",
        category: "Accessories",
        stock: 30,
        imageURL: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        rating: 4.7,
        numReviews: 15,
      },
      {
        name: "Minimalist Slim Wallet",
        price: 24.99,
        description: "RFID-blocking front pocket minimalist card holder made of premium aircraft-grade aluminum and carbon fiber.",
        category: "Accessories",
        stock: 200,
        imageURL: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        rating: 4.3,
        numReviews: 50,
      },
      {
        name: "Classic Unisex Denim Jacket",
        price: 59.99,
        description: "Timeless denim jacket made with 100% premium cotton, featuring a button closure, button cuffs, and two chest pockets.",
        category: "Clothing",
        stock: 80,
        imageURL: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        rating: 4.4,
        numReviews: 32,
      },
      {
        name: "Athletic Running Shoes",
        price: 85.00,
        description: "Lightweight and breathable mesh running shoes with responsive cushioning for maximum energy return and rubber outsole for durability.",
        category: "Clothing",
        stock: 65,
        imageURL: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        rating: 4.6,
        numReviews: 28,
      },
      {
        name: "Ceramic Drip Coffee Maker Set",
        price: 34.99,
        description: "Pour-over coffee brewer with a premium ceramic cone filter, matching glass carafe, and 50 paper filters included for a perfect morning brew.",
        category: "Home & Kitchen",
        stock: 40,
        imageURL: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        rating: 4.9,
        numReviews: 12,
      },
      {
        name: "Stainless Steel Insulated Tumbler",
        price: 19.99,
        description: "Double-walled vacuum insulated travel mug with a leak-proof lid, keeps drinks cold for up to 24 hours or hot for up to 12 hours.",
        category: "Home & Kitchen",
        stock: 150,
        imageURL: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        rating: 4.7,
        numReviews: 60,
      },
    ];

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
