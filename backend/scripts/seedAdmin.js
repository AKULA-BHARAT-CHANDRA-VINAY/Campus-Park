import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        // 1. Connect to DB
        // Adjust path to .env if needed, or rely on default
        const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/smart_parking";

        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        // 2. Check for existing admin
        const email = "admin@campuspark.com";
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("Admin user already exists.");
            process.exit(0);
        }

        // 3. Create Admin
        const hashedPassword = await bcrypt.hash("admin123", 10);

        await User.create({
            fullname: "System Admin",
            regNo: "ADMIN001",
            email,
            password: hashedPassword,
            phone: "0000000000",
            role: "admin",
            isVerified: true,
            firstLoginDone: true
        });

        console.log("Admin user created successfully!");
        console.log("Email: admin@campuspark.com");
        console.log("Password: admin123");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
