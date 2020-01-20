import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useState } from "react";
import SignIn from "./SignIn";
import Dashboard from "../dashboard/Dashboard";

const User = props => {
  const context = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    context.checkIfLoggedIn().then(val => {
      if (val) {
        setUser(val);
      } else {
        props.history.push("/user/connexion");
      }
    });
  }, []);

  return (
    <React.Fragment>{user ? <Dashboard history={props.history} /> : <React.Fragment />}</React.Fragment>
  );
};

export default User;
