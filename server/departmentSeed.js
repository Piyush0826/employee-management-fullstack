import Department from './models/Department.js';
import connectToDatabase from './db/db.js';

const DepartmentSeed = async () => {
    await connectToDatabase();
    try {
        // Check if departments already exist
        const existingDepartments = await Department.countDocuments();
        if (existingDepartments > 0) {
            console.log("Departments already exist.");
            return;
        }

        const departments = [
            {
                dep_name: "IT",
                description: "Information Technology Department"
            },
            {
                dep_name: "HR",
                description: "Human Resources Department"
            },
            {
                dep_name: "Finance",
                description: "Finance Department"
            },
            {
                dep_name: "Operations",
                description: "Operations Department"
            },
            {
                dep_name: "Sales",
                description: "Sales Department"
            }
        ];

        await Department.insertMany(departments);
        console.log("Departments seeded successfully!");
    } catch (error) {
        console.log("Seeding error:", error);
    }
};

DepartmentSeed();
