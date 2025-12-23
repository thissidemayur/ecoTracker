// /validators/footprint.validator.js
import { z } from "zod";

const requiredNumberInput = z
  .number()
  .min(0, "Consumption must be non-negative.");

const optionalNumberInput = requiredNumberInput.optional();

export const createFootprintBodySchema = z
  .object({
    activityData: z
      .object({
        energy: z
          .object({
            electricity_kwh: requiredNumberInput,
            natural_gas_kwh: optionalNumberInput,
            home_size_sqm: z.number().int().min(1),
          })
          .strict(),

        transport: z
          .object({
            car_km_petrol: optionalNumberInput,
            car_km_diesel: optionalNumberInput,
            public_bus_km: optionalNumberInput,
            flight_km_short: optionalNumberInput,
          })
          .strict(),

        consumption: z
          .object({
            food_veg_spend_currency: optionalNumberInput,
            food_meat_spend_currency: optionalNumberInput,
            clothing_spend_currency: optionalNumberInput,
          })
          .strict(),

        waste: z
          .object({
            waste_landfilled_kg: optionalNumberInput,
            waste_recycled_kg: optionalNumberInput,
          })
          .strict()
      })
      .strict(),

    period: z
      .string()
      .regex(/^\d{4}-\d{2}$/, "Period must be in YYYY-MM format.")
  })
  .strict();