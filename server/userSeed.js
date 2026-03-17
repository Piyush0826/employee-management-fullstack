import User from './models/User.js';
import bcrypt from 'bcryptjs';
import connectToDatabase from './db/db.js';
import dotenv from 'dotenv';

dotenv.config();

const UserRegister = async () => {
    await connectToDatabase();
    try {
        // Check if admin exists first
        const existingUser = await User.findOne({ email: "admin@gmail.com" });
        if (existingUser) {
            console.log("Admin user already exists.");
            return;
        }

        const hashPassword = await bcrypt.hash("admin", 10);
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role: "admin"
        });

        await newUser.save();
        console.log("Admin user seeded successfully!");
    } catch (error) {
        console.log("Seeding error:", error);
    }
};

UserRegister();