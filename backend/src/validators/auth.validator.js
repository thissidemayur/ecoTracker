import {z} from "zod"
import { USER_ROLES } from "../constants/index.js";

// User Schema
const userRegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be atleast 3 characters long")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    )
    .trim()
    .toLowerCase()
    .optional(),

    
  email: z.string().email("Invalid email fomrat").trim().toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 character long")
    .max(128, "Password is too long")
    // Enforce strong password
    .regex(/[0-9]/, "Password must contain atleast one number")
    .regex(/[A-Z]/, "Password must contain atleast one Uppercase letter")
    .regex(/[a-z]/, "Password must contain atleast one Lowercase letter"),

  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.USER]).optional()
});

// Login Schema
const userLoginSchema = z.object({
    email:z.string().email().trim().toLowerCase(),
    password:z.string().min(1,"Password is required")
})



// export 
export { userRegisterSchema, userLoginSchema };