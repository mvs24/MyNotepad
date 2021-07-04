import mongoose from "mongoose";
import { UserDocument } from "./user";

interface NoteAttrs {
  title: string;
  content: string;
  user: UserDocument;
  createdAt?: Date;
}

export interface NoteDocument extends mongoose.Document {
  title: string;
  content: string;
  user: UserDocument;
  createdAt?: Date;
}

interface NoteModel extends mongoose.Model<NoteDocument> {
  build(attrs: NoteAttrs): NoteDocument;
}

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

noteSchema.statics.build = function (attrs: NoteAttrs): NoteDocument {
  return new Note(attrs);
};

const Note = mongoose.model<NoteDocument, NoteModel>("Note", noteSchema);

export default Note;
