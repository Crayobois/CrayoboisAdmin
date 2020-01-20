import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

const Dashboard = props => {
  const context = useContext(AuthContext);
  const [user, setUser] = context.user;

  const signingOut = () => {
    context.signout();
    props.history.push("/user/connexion");
  };

  useEffect(() => {
    context.getUser();
  }, []);

  return (
    <React.Fragment>
      {user ? (
        <React.Fragment>
          <span>Dashboard</span>
          <span>Bonjour: {user.fullName}</span>
          <button
            id="signout-btn"
            onClick={() => {
              signingOut();
            }}
          >
            Sign out
          </button>
        </React.Fragment>
      ) : (
        <React.Fragment></React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Dashboard;
