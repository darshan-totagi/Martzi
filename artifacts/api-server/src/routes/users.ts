import { Router, type IRouter } from "express";
import { db, usersTable, eq, and } from "@workspace/db";

const router: IRouter = Router();

// Registration endpoint
router.post("/users/register", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Missing name, email, or password" });
      return;
    }

    const userId = `user-${Date.now()}`;
    const newUser = {
      id: userId,
      name,
      email: email.toLowerCase(),
      password,
      role: role || "customer",
      createdAt: new Date(),
    };

    await db.insert(usersTable).values(newUser);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    console.error("REGISTER ROUTE EXCEPTION:", error);
    const isUniqueViolation = 
      error.code === '23505' || 
      error.cause?.code === '23505' || 
      error.message?.includes('unique constraint') || 
      error.cause?.message?.includes('unique constraint');

    if (isUniqueViolation) {
      res.status(409).json({ error: "Email already registered" });
    } else {
      next(error);
    }
  }
});

// Login endpoint
router.post("/users/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Missing email or password" });
      return;
    }

    const foundUsers = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.email, email.toLowerCase()),
          eq(usersTable.password, password)
        )
      )
      .limit(1);

    if (foundUsers.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const { password: _, ...userWithoutPassword } = foundUsers[0];
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// Get all users endpoint
router.get("/users", async (req, res, next) => {
  try {
    const allUsers = await db.select().from(usersTable);
    res.json(allUsers.map(({ password: _, ...u }) => u));
  } catch (error) {
    next(error);
  }
});

export default router;
