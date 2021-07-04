import { Box, Typography } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Button from "../Button/Button";
import classes from "./MyNotepad.module.css";
import { useHttp } from "../../hooks/useHttp";
import ErrorModal from "../ErrorModal/ErrorModal";
import { API_ENDPOINT } from "../../constants";
import NoteTitle from "./NoteTitle";
import Input from "../Input/Input";
import { INote } from "./types";
import NoteContent from "./NoteContent";

const MyNotepad = () => {
  const { loading, sendRequest } = useHttp();
  const [notes, setNotes] = useState<INote[]>([]);
  const [isInCreateMode, setIsInCreateMode] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [noteToBeCreatedTitle, setNoteToBeCreatedTitle] = useState("");
  const [noteToBeCreatedContent, setNoteToBeCreatedContent] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<undefined | string>();
  const [selectedNote, setSelectedNote] = useState<undefined | INote>(
    undefined
  );
  const [filterInputValue, setFilterInputValue] = useState<string>("");
  const [allNotes, setAllNotes] = useState<INote[]>([]);

  const getMyNotes = useCallback(async () => {
    try {
      const { data } = await sendRequest("get", `${API_ENDPOINT}/notes`);
      setNotes(data);
      setAllNotes(data);
    } catch (err) {
      setError(err);
    }
  }, [sendRequest]);

  useEffect(() => {
    getMyNotes();
  }, [getMyNotes]);

  useEffect(() => {
    setSelectedNote(notes.find((note) => note._id === selectedNoteId));
  }, [selectedNoteId, notes]);

  const updateNotes = (title: string, content: string, _id: string) => {
    const updatedNotes = [{ title, content, _id }, ...notes];
    setNotes(updatedNotes);
    setAllNotes([{ title, content, _id }, ...allNotes]);
    return updatedNotes;
  };

  const addNote = function () {
    setIsInCreateMode(true);
  };

  const updateSelectedNoteOnCreate = (updatedNotes: INote[], newId: string) => {
    setSelectedNote(updatedNotes.find((note) => note._id === newId));
    setSelectedNoteId(newId);
  };

  const createNewNote = async () => {
    try {
      const { data } = await sendRequest("post", `${API_ENDPOINT}/notes`, {
        title: noteToBeCreatedTitle,
        content: noteToBeCreatedContent,
      });

      const updatedNotes = updateNotes(data.title, data.content, data._id);
      updateSelectedNoteOnCreate(updatedNotes, data._id);
    } catch (err) {
      setError(err);
    }
    setNoteToBeCreatedContent("");
    setNoteToBeCreatedTitle("");
    setIsInCreateMode(false);
  };

  const updateSelectedNote = async () => {
    try {
      const { data } = await sendRequest(
        "patch",
        `${API_ENDPOINT}/notes/${selectedNoteId}`,
        {
          title: selectedNote!.title,
          content: selectedNote!.content,
        }
      );

      const updatedNotes = [...notes] as INote[];
      updatedNotes.find((note) => note._id === selectedNoteId)!.content =
        data.content;
      setNotes(updatedNotes);

      const updatedAllNotes = [...allNotes] as INote[];
      updatedAllNotes.find((note) => note._id === selectedNoteId)!.content =
        data.content;
      setAllNotes(updatedAllNotes);
    } catch (err) {
      setError(err);
    }
  };

  const saveNote = async () => {
    if (isInCreateMode) {
      createNewNote();
    } else {
      updateSelectedNote();
    }
  };

  const onNoteClick = useCallback((_id: string) => {
    setSelectedNoteId(_id);
  }, []);

  const onNoteContentChange = useCallback((newContent: string) => {
    setSelectedNote((prevNote) => {
      if (prevNote) {
        return { ...prevNote, content: newContent };
      }
    });
  }, []);

  const filterNotesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filterValue = e.target.value;
    setFilterInputValue(filterValue);
    setNotes(
      allNotes.filter(
        (note) => note.title.indexOf(filterValue.toLowerCase()) !== -1
      )
    );
    setSelectedNoteId(undefined);
  };

  const isSaveButtonEnabled = (): boolean => {
    if (isInCreateMode || selectedNote) return true;

    return false;
  };

  return (
    <div>
      {error && (
        <ErrorModal removeHandler={() => setError(undefined)}>
          {error}
        </ErrorModal>
      )}
      {loading && <LoadingSpinner />}

      <div className={classes.firstHeading}>
        <Button title="+" onClick={addNote} />
        <Box px={1} />
        <Input
          value={filterInputValue}
          placeholder="Filter by title"
          onChange={filterNotesHandler}
        />
        <Typography className={classes.notepadHeading}>
          My awesome Notepad
        </Typography>
      </div>
      <div className={classes.notepadContainer}>
        <div className={classes.firstNotepadColumn}>
          {isInCreateMode && (
            <Input
              value={noteToBeCreatedTitle}
              placeholder="New Note"
              onChange={(e) => setNoteToBeCreatedTitle(e.target.value)}
            />
          )}
          {notes.length === 0 && !isInCreateMode && (
            <Typography>
              {!filterInputValue
                ? "Start by creating your first note."
                : "Nothing found with that filter!"}
            </Typography>
          )}
          {notes.map((note: INote) => (
            <NoteTitle
              isSelectedNote={note._id === selectedNoteId}
              key={note._id}
              note={note}
              onNoteClick={onNoteClick}
            />
          ))}
        </div>
        <div className={classes.secondNotepadColumn}>
          {isInCreateMode && (
            <textarea
              placeholder="Content of new note"
              value={noteToBeCreatedContent}
              onChange={(e) => setNoteToBeCreatedContent(e.target.value)}
            />
          )}

          {!isInCreateMode && selectedNote ? (
            <NoteContent
              note={selectedNote}
              onNoteContentChange={onNoteContentChange}
            />
          ) : (
            !isInCreateMode && (
              <textarea
                value={`Select a note to see it's content`}
                onChange={(e) => setNoteToBeCreatedContent(e.target.value)}
              />
            )
          )}
        </div>
      </div>
      <Box p={1.5} className={classes.saveBtnContainer}>
        <Button
          title="Save"
          disabled={!isSaveButtonEnabled()}
          onClick={saveNote}
        />
      </Box>
    </div>
  );
};

export default MyNotepad;
