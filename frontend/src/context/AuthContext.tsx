import React, { ReactElement, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../constants";

export interface User {
  email: string;
  token: string;
  _id: string;
}

const user: User | null = null;
const signup: (email: string, password: string) => void = () => {};
const login: (email: string, password: string) => void = () => {};
const logout: () => void = () => {};
const clearErrorAndLoadingState: () => void = () => {};

interface IAuthContext {
  user: User | null;
  signup: (email: string, password: string) => void;
  login: (email: string, password: string) => void;
  error: string | undefined;
  loading: boolean;
  logout: () => void;
  clearErrorAndLoadingState: () => void;
}

const context: IAuthContext = {
  user,
  signup,
  login,
  error: undefined,
  loading: false,
  logout,
  clearErrorAndLoadingState,
};
export const AuthContext = React.createContext(context);

const AuthContextProvider = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [checkingLoginState, setCheckingLoginState] = useState<boolean>(true);

  const checkForAutoLogin = useCallback(async () => {
    const token = localStorage.getItem("jwt");
    if (token) {
      saveTokenOnHeaders(token);
      try {
        const { data } = await axios.get("/api/v1/users/me");
        setUser({
          email: data.data.email,
          _id: data.data._id,
          token: token.replace("Bearer ", ""),
        });
      } catch (err) {
        setError(err.response.data.message);
      }
    }
    setCheckingLoginState(false);
  }, []);

  useEffect(() => {
    checkForAutoLogin();
  }, [checkForAutoLogin]);

  const saveJWTToLocalStorage = (token: string) => {
    localStorage.setItem("jwt", token);
  };

  const saveTokenOnHeaders = (token: string) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const handleAuthSuccess = (token: string) => {
    saveJWTToLocalStorage(token);
    saveTokenOnHeaders(token);
    setError(undefined);
    setLoading(false);
  };

  const signupHandler = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${API_ENDPOINT}/users/signup`, {
        email,
        password,
      });
      setUser({
        email: data.data.email,
        token: data.token,
        _id: data.data._id,
      });

      handleAuthSuccess(data.token);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response.data.message);
      throw err.response.data.message;
    }
  };

  const loginHandler = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${API_ENDPOINT}/users/login`, {
        email,
        password,
      });
      setUser({
        email: data.data.email,
        token: data.token,
        _id: data.data._id,
      });

      handleAuthSuccess(data.token);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response.data.message);
      throw err.response.data.message;
    }
  };

  const removeTokenFromHeaders = () => {
    delete axios.defaults.headers.common["Authorization"];
  };

  const removeTokenFromLocalStorage = () => {
    localStorage.removeItem("jwt");
  };

  const logout = () => {
    setUser(null);
    removeTokenFromLocalStorage();
    removeTokenFromHeaders();
  };

  const clearErrorAndLoadingState = () => {
    setError(undefined);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup: signupHandler,
        login: loginHandler,
        error,
        loading,
        logout,
        clearErrorAndLoadingState,
      }}
    >
      {!checkingLoginState && children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
