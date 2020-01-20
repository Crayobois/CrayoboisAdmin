import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

const SignIn = () => {
  const context = useContext(AuthContext);
  const test = context.test;

  return (
    <React.Fragment>
      <span>test: {test}</span>
    </React.Fragment>
  );
};

export default SignIn;
