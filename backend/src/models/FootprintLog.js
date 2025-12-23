// /models/FootprintLog.js
import mongoose from "mongoose";

// This schema stores the core user inputs and the calculated results.
const FootprintLogSchema = new mongoose.Schema(
  {
    // Reference to the User who owns this log. Indexed for efficient history lookup.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // The period this calculation covers (e.g., "2023-12"). Used for tracking progress over time.
    period: {
      type: String,
      required: true,
      index: true,
    },
    // The exact date and time the calculation was performed.
    dateCalculated: {
      type: Date,
      default: Date.now,
    },

    // --- ACTIVITY DATA (User Inputs) ---
    // Stores the raw data provided by the user (e.g., kWh, km traveled).
    activityData: {
      type: new mongoose.Schema(
        {
          // Energy
          electricity_kwh: { type: Number, min: 0, required: true,default:0 },
          natural_gas_kwh: { type: Number, min: 0, default: 0 },
          home_size_sqm: { type: Number, min: 1,  }, // Used by admin for filtering/comparison

          // Transport
          car_km_petrol: { type: Number, min: 0, default: 0 },
          car_km_diesel: { type: Number, min: 0, default: 0 },
          public_bus_km: { type: Number, min: 0, default: 0 },
          flight_km_short: { type: Number, min: 0, default: 0 }, // Flights based on distance

          // Consumption (Spend-based approach - assuming currency units)
          food_veg_spend_currency: { type: Number, min: 0, default: 0 },
          food_meat_spend_currency: { type: Number, min: 0, default: 0 },
          clothing_spend_currency: { type: Number, min: 0, default: 0 },

          // Waste & Water
          waste_landfilled_kg: { type: Number, min: 0, default: 0 },
          waste_recycled_kg: { type: Number, min: 0, default: 0 },
        }
         ,
        { _id: false }
      ),
      required: true,
    },

    // --- CALCULATED RESULTS ---
    // Stores the output of the calculation engine.
    results: {
      type: new mongoose.Schema(
        {
          // The final calculated carbon footprint in kg CO2e.
          total_co2e: {
            type: Number,
            required: true,
            min: 0,
          },
          // Emission breakdown by category (used for charts and recommendations).
          breakdown_co2e: {
            type: new mongoose.Schema(
              {
                energy: { type: Number, default: 0 },
                transport: { type: Number, default: 0 },
                consumption: { type: Number, default: 0 },
                waste: { type: Number, default: 0 },
              },
              { _id: false }
            ),
            required: true,
          },
          // The version of the Emission Factors used, matching the version in the Factor model.
          emissionFactorVersion: {
            type: String,
            required: true,
          },
        },
        { _id: false }
      ),
      required: true,
    },
  },
  { timestamps: true }
);

export const FootprintLog = mongoose.model("FootprintLog", FootprintLogSchema);
