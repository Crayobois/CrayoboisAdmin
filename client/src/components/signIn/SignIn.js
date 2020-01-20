import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useState } from "react";
import Spinner from "../spinner/Spinner";
import "./SignIn.css";

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
      const btn = document.getElementById("signin-btn");
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
        <section className="signin-section">
          <div className="signin-container">
            <img
              className="signin-logo"
              src="https://firebasestorage.googleapis.com/v0/b/crayobois-fe722.appspot.com/o/logos%2Flogo%20black.png?alt=media&token=8fd71150-e1e3-4e64-92fb-3bb4c43a3935"
            />
            <form id="signin-form" className="signin-form">
              <label htmlFor="email" className="signin-label"><i className="fas fa-envelope label-icon"></i>Adresse e-mail</label>
              <input
                type="email"
                name="email"
                id="signin-email"
                className="signin-input"
                autoComplete="off"
                placeholder="Adresse e-mail"
                required
              />
              <label htmlFor="password" className="signin-label"><i className="fas fa-lock label-icon"></i>Mot de passe</label>
              <input
                type="password"
                name="password"
                className="signin-input"
                id="signin-password"
                autoComplete="off"
                placeholder="Mot de passe"
                required
              />
              <button id="signin-btn" className="signin-btn">
                Connexion
              </button>
            </form>
          </div>
        </section>
      ) : (
        <React.Fragment />
      )}
    </React.Fragment>
  );
};

export default SignIn;
