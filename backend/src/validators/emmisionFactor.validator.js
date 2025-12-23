// /validators/emissionFactor.validator.js
import { z } from "zod";

// Base schema for factor data
const factorBaseSchema = z
  .object({
    factorId: z.string().min(3, "Factor ID is required and descriptive."),
    category: z.enum(
      ["energy", "transport", "consumption", "waste", "other"],
      "Invalid emission category."
    ),
    unit: z
      .string()
      .min(1, "Unit of measurement is required (e.g., 'kWh', 'km')."),
    value: z
      .number()
      .describe(
        "Emission factor value. Positive for emissions, negative for credits/savings."
      ),
    source: z.string().min(5, "Source documentation is required."),
    version: z.string().min(1, "Version string is required."),
    region: z.string().optional(),
  })
  .strict();

// Schema for creating a new factor (all required)
export const createFactorSchema = factorBaseSchema;

// Schema for updating an existing factor (only a subset of fields allowed)
export const updateFactorSchema = z
  .object({
    value: z
      .number()
      .min(0, "Emission factor value must be non-negative.")
      .optional(),
    source: z.string().min(5, "Source documentation is required.").optional(),
    version: z.string().min(1, "Version string is required.").optional(),
    region: z.string().optional(),
  })
  .strict()
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field (value, source, or version) must be provided for update."
  );
