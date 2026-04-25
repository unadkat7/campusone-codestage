require("dotenv").config();
const mongoose = require("mongoose");
const Problem = require("../models/problem.model");

const problems1 = require("./problems_part1");
const problems2 = require("./problems_part2");
const problems3 = require("./problems_part3");
const connectDB = require("../config/db");

const seedDatabase = async () => {
  try {
    connectDB();

    const allProblems = [...problems1, ...problems2, ...problems3];
    console.log(`Total problems to insert: ${allProblems.length}`);

    // Clear existing problems
    await Problem.deleteMany({});
    console.log("Cleared existing problems");

    // Insert new problems
    const inserted = await Problem.insertMany(allProblems);
    console.log(`Successfully inserted ${inserted.length} problems`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
