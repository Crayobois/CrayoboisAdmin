import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useState } from "react";
import Spinner from "../spinner/Spinner";

const SignIn = props => {
  const context = useContext(AuthContext);
  const isLoggedIn = context.isLoggedIn;
  const [stateChecked, setStateChecked] = useState(false);
  const loading = context.loading[0];

  useEffect(() => {
    context.checkIfLoggedIn().then(val => {
      if (val) {
        props.history.push("/user/dashboard");
      } else {
        setStateChecked(true);
      }
    });

    if (stateChecked) {
      const form = document.getElementById("signin-form");
      form.addEventListener("submit", e => {
        e.preventDefault();

        // get user info
        const email = form["signin-email"].value;
        const password = form["signin-password"].value;
        context.signin(email, password);
      });
    }
  }, [stateChecked]);

  return (
    <React.Fragment>
      {isLoggedIn ? props.history.push("/user/dashboard") : <React.Fragment />}
      {loading ? <Spinner /> : <React.Fragment />}
      {stateChecked ? (
        <form id="signin-form">
          <input
            type="email"
            name="email"
            id="signin-email"
            autoComplete="off"
            placeholder="Adresse e-mail"
            required
          />
          <input
            type="password"
            name="password"
            id="signin-password"
            autoComplete="off"
            placeholder="Mot de passe"
            required
          />
          <button id="signin-btn">Connexion</button>
        </form>
      ) : (
        <React.Fragment />
      )}
    </React.Fragment>
  );
};

export default SignIn;
