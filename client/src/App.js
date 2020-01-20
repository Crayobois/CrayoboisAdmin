import React from "react";
import "./App.css";
import RouterComponent from "./Router";
import AuthStates from "./components/context/AuthStates";

function App() {
  return (
    <React.Fragment>
      <AuthStates>
        <RouterComponent />
      </AuthStates>
    </React.Fragment>
  );
}

export default App;
