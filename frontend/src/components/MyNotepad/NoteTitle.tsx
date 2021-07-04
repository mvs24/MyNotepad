import React from "react";
import { Box, Typography } from "@material-ui/core";
import classes from "./MyNotepad.module.css";
import { INote } from "./types";

export default React.memo(
  (props: {
    note: INote;
    onNoteClick: (_id: string) => void;
    isSelectedNote: boolean;
  }) => {
    const { note, onNoteClick, isSelectedNote } = props;

    return (
      <Box
        style={{ background: isSelectedNote ? "gray" : "white" }}
        onClick={() => onNoteClick(note._id)}
        className={classes.note}
      >
        <Typography>{note.title}</Typography>
      </Box>
    );
  }
);
