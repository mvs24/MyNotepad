import express, { Router } from "express";
import { signup, login, protect, getMe } from "../controllers/auth";

const router: Router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;
