
import mongoose from "mongoose";
import {bcryptService} from "../services/bcrypt.service.js"
import { USER_ROLES } from "../constants/index.js"; // Assuming you define roles here

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    username: {
      type: String,
      // required: [true, "Username is required"],
      lowercase: true,
      trim: true,
      index: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      // Setting select: false prevents the password hash from being returned
      // by default in find queries (security best practice)
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES), // Use the defined roles constant
      default: USER_ROLES.USER,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // For email verification or admin validation
    },
    refreshTokenHash: {
      type: String,
      // This is crucial for session management and logout functionality
      select: false,
      default: null,
    },
    // --- Profile Fields for Carbon Footprint Calculation and Comparison ---
    location: {
      country: { type: String, default: "" },
      state: { type: String, default: "" },
      district: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    // total number of household members
    household_members: {
      type: Number,
      min: [1, "There must be at least 1 household member"],
      max: [100, "Household members cannot exceed 100"],
      default: 1,
    },
    // size of home in square meters

    home_size_sqm: {
      type: Number,
      min: [1, "Home size must be positive"],
      default: 1,
    },
    hasOnboarded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

userSchema.index(
  { username: 1 },
  {
    unique: true,
    partialFilterExpression: {
      username: { $exists: true, $type: "string" },
    },
  }
);
// --- Mongoose Pre-Save Hook for Password Hashing ---
// Hash the password ONLY if the 'password' field has been modified.
// userSchema.pre("save", async function (next) {
//   // 'this' refers to the document being saved
//   if (!this.isModified("password")) {
//     return next();
//   }

//   try {
//     // Hash the password using the imported service
//     this.password = await bcryptService.hash(this.password);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// --- Export the Model ---
// Statics and Methods: static-> model level; method->document level
userSchema.statics.USER_ROLES = USER_ROLES;

export const User = mongoose.model("User", userSchema); 