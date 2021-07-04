import express, { Router } from "express";
import { protect } from "../controllers/auth";
import {
  createNote,
  getAllNotes,
  getNote,
  updateNote,
} from "../controllers/note";

const router: Router = express.Router();

router.use(protect);
router.route("/").post(createNote).get(getAllNotes);
router.route("/:id").get(getNote).patch(updateNote);

export default router;
