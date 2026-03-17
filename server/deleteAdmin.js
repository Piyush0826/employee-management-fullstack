import User from './models/User.js';
import connectToDatabase from './db/db.js';
import dotenv from 'dotenv';

dotenv.config();

const deleteAdmin = async () => {
    try {
        await connectToDatabase();
        
        console.log("Deleting existing admin user...");
        const result = await User.deleteOne({ email: "admin@gmail.com" });
        console.log("Deleted:", result.deletedCount, "user(s)");
        
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        process.exit(0);
    }
};

deleteAdmin();
