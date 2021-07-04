import React from "react";
import { INote } from "./types";

interface Props {
  note: INote;
  onNoteContentChange: (newContent: string) => void;
}
export default React.memo((props: Props) => {
  return (
    <textarea
      value={props.note.content}
      onChange={(e) => props.onNoteContentChange(e.target.value)}
    />
  );
});
