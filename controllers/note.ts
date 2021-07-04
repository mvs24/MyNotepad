import { NextFunction, Request, Response } from "express";
import Note from "../models/note";
import { asyncWrapper } from "../utils/asyncWrapper";
import HTTPError from "../utils/HTTPError";

export const createNote = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;

    if (!title || !content)
      return next(new HTTPError("Title and content must be defined.", 400));

    const note = Note.build({ title, content, user: req.user!._id });
    await note.save();

    res.status(201).json({
      status: "success",
      data: note,
    });
  }
);

export const getAllNotes = asyncWrapper(
  async (req: Request, res: Response, _next: NextFunction) => {
    const notes = await Note.find({ user: req.user!._id }).sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: notes.length,
      data: notes,
    });
  }
);

export const updateNote = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { content, title } = req.body;
    const note = await Note.findById(id);

    if (!note) return next(new HTTPError("Note not found.", 404));

    if (note.user.toString() !== req.user!._id.toString())
      return next(
        new HTTPError("You do not have access to update this note", 403)
      );

    note.title = title || note.title;
    note.content = content || note.content;

    await note.save();

    res.status(200).json({
      status: "success",
      data: note,
    });
  }
);

export const getNote = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) return next(new HTTPError("Note not found.", 404));
    if (note.user.toString() !== req.user!._id.toString())
      return next(
        new HTTPError("You do not have access to get this note", 403)
      );

    res.status(200).json({
      status: "success",
      data: note,
    });
  }
);
