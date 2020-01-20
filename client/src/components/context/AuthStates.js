import React, { useState } from "react";
import AuthContext from "./AuthContext";
import * as firebase from "firebase";
//const uuidv4 = require("uuid/v4");

const AuthStates = props => {
  const [initializedFirebase, setInitializedFirebase] = useState(null);
  const [caughtErr, setCaughtErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  //const [loading, setLoading] = useState(false);


  // firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyBccRjBkjdgTdVxFQwKvrbpUCGCMeVryAA",
    authDomain: "crayobois-fe722.firebaseapp.com",
    databaseURL: "https://crayobois-fe722.firebaseio.com",
    projectId: "crayobois-fe722",
    appId: "1:410478848299:web:b2f130cd32dba774fcbd6e",
    measurementId: "G-XHQN6JX1WG"
  };

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    setInitializedFirebase(true);
  }

  // make auth and firestore references
  const auth = firebase.auth();
  const db = firebase.firestore();
  const [isAuth, setIsAuth] = useState(auth.currentUser);

  // check firebase's initialization
  const isInitialized = () => {
    return new Promise(resolve => {
      auth.onAuthStateChanged(resolve);
    });
  };

  // signout user
  const signout = () => {
    auth.signOut();
    setInitializedFirebase(null);
    setIsAuth(null);
  };

  // signin user
  const signin = (email, password) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(cred => {
      //  setLoading(true);
        setCaughtErr(false);

        // get user from db to initialize session
        setIsAuth(auth.currentUser);

        //ui update here
        const signinForm = document.querySelector("#signin-form");
        signinForm.reset();
        setInitializedFirebase(cred.user);
      })
      .catch(err => {
        setCaughtErr(true);
        alert("L'accès vous a été refusé");
      });
  };

  return (
    <AuthContext.Provider
      value={{
          signin: signin,
          initializedFirebase: [initializedFirebase, setInitializedFirebase],
          isAuth: [isAuth, setIsAuth],
          caughtErr: [caughtErr, setCaughtErr],
          errorMsg: [errorMsg, setErrorMsg]
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthStates;
