import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import Spinner from "../spinner/Spinner";

const Dashboard = props => {
  const context = useContext(AuthContext);
  const user = context.user[0];
  const loading = context.loading[0];

  const signingOut = () => {
    context.signout();
    props.history.push("/user/connexion");
  };

  useEffect(() => {
    context.getUser();
  }, []);

  return (
    <React.Fragment>
      {loading ? <Spinner /> : <React.Fragment />}
      {user ? (
        <section className="dashboard-section">
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
        </section>
      ) : (
        <React.Fragment />
      )}
    </React.Fragment>
  );
};

export default Dashboard;
