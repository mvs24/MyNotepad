import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { Box, Input, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import classes from "./LoginModal.module.css";

interface Props {
  setOpenedLoginModal: (opened: boolean) => void;
}

export default React.memo((props: Props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, error, loading, clearErrorAndLoadingState } =
    useContext(AuthContext);
  const { setOpenedLoginModal } = props;

  const loginHandler = async () => {
    try {
      await login(email, password);
      setOpenedLoginModal(false);
    } catch (err) {}
  };

  const closeModalHandler = () => {
    setOpenedLoginModal(false);
    clearErrorAndLoadingState();
  };

  return (
    <Modal closeModal={closeModalHandler} open={true}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          loginHandler();
        }}
        className={classes.loginContainer}
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
        <Button title="Login" onClick={loginHandler} />
      </form>
    </Modal>
  );
});
