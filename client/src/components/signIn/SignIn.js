import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";

const SignIn = () => {
  const context = useContext(AuthContext);
  

  useEffect(() => {
    const form = document.getElementById("signin-form");
    form.addEventListener("submit", e => {
      e.preventDefault();

      // get user info
      const email = form["signin-email"].value;
      const password = form["signin-password"].value;
      context.signin(email, password);
    });
  }, []);

  return (
    <React.Fragment>
      <form id="signin-form">
        <input
          type="email"
          name="email"
          id="signin-email"
          autoComplete="off"
          placeHolder="Adresse e-mail"
          required
        />
        <input
          type="password"
          name="password"
          id="signin-password"
          autoComplete="off"
          placeHolder="Mot de passe"
          required
        />
        <button id="signin-btn">Connexion</button>
      </form>
    </React.Fragment>
  );
};

export default SignIn;
