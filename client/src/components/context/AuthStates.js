import React, { useState } from "react";
import AuthContext from "./AuthContext";
import * as firebase from "firebase";
//const uuidv4 = require("uuid/v4");

const AuthStates = props => {
  const [initializedFirebase, setInitializedFirebase] = useState(null);
  const [caughtErr, setCaughtErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  // check login status
  const checkIfLoggedIn = () => {
    return new Promise(resolve => {
      auth.onAuthStateChanged(resolve);
    });
  };

  // signout user
  const signout = () => {
    auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
  };

  // signin user
  const signin = (email, password) => {
    setLoading(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then(cred => {
        if (auth.currentUser !== null) {
          db.collection("users")
            .doc(auth.currentUser.uid)
            .get()
            .then(doc => {
              const userData = doc.data();
              if (userData.admin === true) {
                setCaughtErr(false);
                setErrorMsg(null);
                // initialize session
                getUser();

                //ui update here
                const signinForm = document.querySelector("#signin-form");
                signinForm.reset();
                setIsLoggedIn(true);
              } else {
                signout();
                setLoading(false);
                setCaughtErr(true);
                setErrorMsg("L'accès vous a été refusé.");
              }
            });
        }
      })
      .catch(err => {
        setLoading(false);
        setCaughtErr(true);
        setErrorMsg("L'accès vous a été refusé.");
      });
  };

  const getUser = () => {
    setLoading(true);
    if (auth.currentUser !== null) {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .get()
        .then(doc => {
          const userData = doc.data();
          if (userData.admin === true) {
            const userObj = {
              email: userData.email,
              fullName: userData.fullName
            };
            setUser(userObj);
            setLoading(false);
          } else {
            setLoading(false);
            return null;
          }
        });
    } else {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signin: signin,
        signout: signout,
        initializedFirebase: [initializedFirebase, setInitializedFirebase],
        isAuth: [isAuth, setIsAuth],
        caughtErr: [caughtErr, setCaughtErr],
        errorMsg: [errorMsg, setErrorMsg],
        getUser: getUser,
        user: [user, setUser],
        isLoggedIn: isLoggedIn,
        loading: [loading, setLoading],
        checkIfLoggedIn: checkIfLoggedIn
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthStates;
