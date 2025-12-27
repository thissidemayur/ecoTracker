// /validators/user.validator.js
import { z } from "zod";

// Schema for updating user profile details (e.g., username, region)
export const updateProfileSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(30)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers, and underscores allowed"
      )
      .trim()
      .toLowerCase()
      .optional(),


    name: z.string().max(100, "Name cannot exceed 100 characters").optional(),

    // 1. NESTED LOCATION FIELD
    // Matches your Mongoose schema structure
    location: z
      .object({
        country: z.string().max(50).optional(),
        state: z.string().max(50).optional(),
        district: z.string().max(50).optional(),
        pincode: z
          .string()
          .regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits") // Specific to India (optional)
          .optional(),
      })
      .optional(),

    // 2. HOUSEHOLD MEMBERS
    household_members: z
      .number()
      .int()
      .min(1, "Must have at least 1 member")
      .max(20, "Please contact support for large groups over 20") // Safer UI limit than DB 100
      .optional(),

    home_size_sqm: z
      .number()
      .int()
      .min(1, "Home size must be positive")
      .optional(),

    // Legacy field (if you still want to allow string regions)
    region: z.string().max(50).optional(),
  })
  .strict()
  .partial();
// Schema for changing the user's password
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required."),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long")
      .max(128, "Password is too long")
      // Enforce strong password rules
      .regex(/[0-9]/, "New password must contain at least one number")
      .regex(/[A-Z]/, "New password must contain at least one Uppercase letter")
      .regex(
        /[a-z]/,
        "New password must contain at least one Lowercase letter"
      ),

    // Ensures new password is not the same as the old one (can be checked in service too)
  })
  .superRefine((data, ctx) => {
    if (data.oldPassword === data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "New password cannot be the same as the current password.",
        path: ["newPassword"],
      });
    }
  });
