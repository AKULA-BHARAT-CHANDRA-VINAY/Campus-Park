import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

dotenv.config({ path: ".env" });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected for seeding admin");

        const regNo = "ADMIN001";
        const password = "admin123";
        const email = "admin@campuspark.com";

        const existingAdmin = await User.findOne({ regNo });
        if (existingAdmin) {
            console.log("Admin user already exists. Updating credentials...");
            const hashedPassword = await bcrypt.hash(password, 10);
            existingAdmin.password = hashedPassword;
            existingAdmin.firstLoginDone = true;
            existingAdmin.role = "admin";
            await existingAdmin.save();
            console.log("✅ Admin user updated");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                fullname: "System Admin",
                regNo,
                email,
                password: hashedPassword,
                role: "admin",
                firstLoginDone: true,
                isVerified: true,
                phone: "0000000000"
            });
            console.log("✅ Admin user created");
        }

        process.exit();
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
