import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import connectDB from "./db.js";
import colors from "colors";

dotenv.config();

const createAdminUser = async () => {
  try {
    await connectDB(); // Ensure DB connection

    // const adminEmail = "admin@example.com";
    // const adminPassword = "admin123";
    const adminEmail = "mhasan0450@gmail.com";
    const adminPassword = "!Qwerty@";

    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log(`Admin user already exists.`.bgYellow.black);
    } else {
      // const salt = await bcrypt.genSalt(10);
      // const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const admin = new User({
        name: "Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });

      await admin.save();
      console.log(`Admin user created successfully!`.bgGreen.black.bold);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error(
      `Error creating admin user: ${error.message}`.bgRed.black.bold
    );
    process.exit(1);
  }
};

createAdminUser();
