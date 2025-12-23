// /models/EmissionFactor.js
import mongoose from "mongoose";
// This schema holds the constants for your calculation engine.
const EmissionFactorSchema = new mongoose.Schema({
  // Unique identifier for the factor (e.g., 'electricity_kwh', 'petrol_per_km').
  // Used by the calculation service to look up the correct value.
  factorId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  // Category for grouping and breakdown display (e.g., 'energy', 'transport').
  category: {
    type: String,
    required: true,
    enum: ["energy", "transport", "consumption", "waste", "other"],
  },
  // The activity unit the factor applies to (e.g., 'kWh', 'km', 'currency').
  unit: {
    type: String,
    required: true,
  },
  // The emission value: kg CO2e emitted per unit of activity.
  value: {
    type: Number,
    required: true,
  },
  // Source of the data (e.g., 'EPA 2023 Q4', 'DEFRA 2024'). Important for auditing.
  source: {
    type: String,
    required: true,
  },
  // Versioning identifier (e.g., 'v2.1_2023-12') to ensure historical logs are reproducible.
  version: {
    type: String,
    required: true,
  },
  // Optional: Region/Country specificity (e.g., 'IN-Delhi', 'US-CA').
  region: {
    type: String,
    default: "Global Average",
  },
  // Timestamp when this factor was created/added to the database.
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{
    timestamps:true,
});

export const EmissionFactor = mongoose.model("EmissionFactor", EmissionFactorSchema);
