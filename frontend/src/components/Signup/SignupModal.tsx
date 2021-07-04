import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { Box, Input, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import classes from "./SignupModal.module.css";

interface Props {
  setOpenedSignupModal: (opened: boolean) => void;
}

export default React.memo((props: Props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signup, error, loading, clearErrorAndLoadingState } =
    useContext(AuthContext);
  const { setOpenedSignupModal } = props;

  const signupHandler = async () => {
    try {
      await signup(email, password);
      setOpenedSignupModal(false);
    } catch (err) {}
  };

  const closeModalHandler = () => {
    clearErrorAndLoadingState();
    setOpenedSignupModal(false);
  };

  return (
    <Modal closeModal={closeModalHandler} open={true}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signupHandler();
        }}
        className={classes.signupContainer}
      >
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <Box py={1}></Box>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {loading && <LoadingSpinner />}
        {error && <Typography style={{ color: "red" }}>{error}</Typography>}
        <Box py={1}></Box>
        <Button title="Signup" onClick={signupHandler} />
      </form>
    </Modal>
  );
});
