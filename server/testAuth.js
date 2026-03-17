import bcryptjs from 'bcryptjs';
import User from './models/User.js';
import connectToDatabase from './db/db.js';
import dotenv from 'dotenv';

dotenv.config();

const testAuth = async () => {
    try {
        await connectToDatabase();
        
        console.log("Fetching admin user...");
        const user = await User.findOne({ email: "admin@gmail.com" });
        
        if (!user) {
            console.log("User not found");
            return;
        }
        
        console.log("User found:", user.email, user.role);
        console.log("Stored password hash:", user.password);
        console.log("Hash length:", user.password.length);
        
        // Test password comparison
        const testPassword = "admin";
        console.log("\nTesting password:", testPassword);
        
        const isMatch = await bcryptjs.compare(testPassword, user.password);
        console.log("Password match result:", isMatch);
        
        // Also test re-hashing
        console.log("\nTesting hash function...");
        const newHash = await bcryptjs.hash("admin", 10);
        console.log("New hash:", newHash);
        const newMatch = await bcryptjs.compare("admin", newHash);
        console.log("New hash match:", newMatch);
        
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        process.exit(0);
    }
};

testAuth();
