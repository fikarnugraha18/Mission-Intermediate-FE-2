import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.services";

export async function register(req: Request, res: Response) {
  try {
    const { email, password, role } = req.body;
    const user = await registerUser(email, password, role);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.json(token);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
