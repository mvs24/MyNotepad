import React from "react";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import AuthContextProvider from "./context/AuthContext";

function App() {
  return (
    <AuthContextProvider>
      <Layout>
        <Home />
      </Layout>
    </AuthContextProvider>
  );
}

export default App;
