import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { db } from "./db";
import { users, insertUserSchema, workspaces, type User } from "@shared/schema";
import { eq } from "drizzle-orm";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

// Validation schemas
const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create user
export async function createUser(userData: SignUpData): Promise<User> {
  // Validate input
  const validatedData = signUpSchema.parse(userData);
  
  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, validatedData.email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("An account with this email already exists");
  }

  // Hash password
  const passwordHash = await hashPassword(validatedData.password);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      passwordHash,
    })
    .returning();

  // Create default workspace
  await db.insert(workspaces).values({
    name: "My Marketing Campaigns",
    userId: newUser.id,
  });

  return newUser;
}

// Authenticate user
export async function authenticateUser(credentials: SignInData): Promise<User> {
  // Validate input
  const validatedData = signInSchema.parse(credentials);

  // Find user by email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, validatedData.email))
    .limit(1);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isValidPassword = await verifyPassword(validatedData.password, user.passwordHash);
  
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  return user;
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user || null;
}

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// Get current user middleware
export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await getUserById(req.session.userId);
    if (!user) {
      req.session.destroy((err) => {
        if (err) console.error("Session destroy error:", err);
      });
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Add user to request
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}