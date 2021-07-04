import { Typography, Box } from "@material-ui/core";
import { useContext, useState } from "react";
import Button from "../components/Button/Button";
import SignupModal from "../components/Signup/SignupModal";
import { AuthContext } from "../context/AuthContext";
import LoginModal from "../components/Login/LoginModal";
import classes from "./Home.module.css";
import MyNotepad from "../components/MyNotepad/MyNotepad";
import NotLoggedIn from "../components/NotLoggedIn/NotLoggedIn";

const Home = () => {
  const [openedLoginModal, setOpenedLoginModal] = useState(false);
  const [openedSignupModal, setOpenedSignupModal] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      {openedSignupModal && (
        <SignupModal setOpenedSignupModal={setOpenedSignupModal} />
      )}
      {openedLoginModal && (
        <LoginModal setOpenedLoginModal={setOpenedLoginModal} />
      )}
      {!user ? (
        <div className={classes.signupLoginContainerButton}>
          <Button title="Signup" onClick={() => setOpenedSignupModal(true)} />
          <Box px={2}>
            <Button title="Login" onClick={() => setOpenedLoginModal(true)} />
          </Box>
        </div>
      ) : (
        <div className={classes.headerContainer}>
          <Typography>Welcome {user.email}</Typography>
          <Box p={1}>
            <Button title="Logout" onClick={logout} />
          </Box>
        </div>
      )}
      {user ? <MyNotepad /> : <NotLoggedIn />}
    </div>
  );
};

export default Home;
