import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useState } from "react";
import SignIn from "./SignIn";
import Dashboard from "../dashboard/Dashboard";

const User = props => {
  const context = useContext(AuthContext);
  const [user, setUser] = context.user;

  useEffect(() => {
    context.checkIfLoggedIn().then(val => {
      if (val) {
        context.getUser();
      } else {
        props.history.push("/user/login");
      }
    });
  }, []);

  return (
    <React.Fragment>
      {props.redirect ? (
        props.history.push(props.redirect)
      ) : user ? (
        <Dashboard history={props.history} />
      ) : (
        <React.Fragment />
      )}
    </React.Fragment>
  );
};

export default User;
