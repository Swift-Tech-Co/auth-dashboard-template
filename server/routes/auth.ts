import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { authenticate, AuthedRequest } from "../middleware/authenticate";

const router = Router();

// In-memory user store — replace with a real database (Prisma, Drizzle, etc.)
interface User { id: string; email: string; name: string; passwordHash: string; createdAt: string; }
const users = new Map<string, User>();

function getSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET not set");
  return s;
}

function signToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, getSecret(), { expiresIn: "7d" });
}

// POST /auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    name:     z.string().min(1).max(80),
    email:    z.string().email(),
    password: z.string().min(8),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { name, email, password } = parsed.data;

  if ([...users.values()].find((u) => u.email === email)) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const id           = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(password, 12);
  const user: User   = { id, email, name, passwordHash, createdAt: new Date().toISOString() };
  users.set(id, user);

  const token = signToken(id, email);
  res.status(201).json({ token, user: { id, email, name } });
});

// POST /auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { email, password } = parsed.data;
  const user = [...users.values()].find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = signToken(user.id, user.email);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// GET /auth/me — protected
router.get("/me", authenticate, (req: AuthedRequest, res: Response): void => {
  const user = users.get(req.userId ?? "");
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt } });
});

// POST /auth/refresh — issue a fresh token
router.post("/refresh", authenticate, (req: AuthedRequest, res: Response): void => {
  const token = signToken(req.userId!, req.email!);
  res.json({ token });
});

export default router;
