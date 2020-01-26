import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import Spinner from "../spinner/Spinner";
import logo from "../images/logo_black.png";
import "./Dashboard.css";
import Orders from "./Orders";
import Materials from "./Materials";
import Hardwares from "./Hardwares";
import Analytics from "./Analytics";

const Dashboard = props => {
  const context = useContext(AuthContext);
  const user = context.user[0];
  const loading = context.loading[0];
  const [activeLink, setActiveLink] = useState("dashboard");

  const signingOut = () => {
    context.signout();
    props.history.push("/user/login");
  };

  useEffect(() => {
    context.getUser();
  }, []);

  return (
    <React.Fragment>
      {loading ? <Spinner /> : <React.Fragment />}
      {user ? (
        <section className="dashboard-section">
          <div className="dashboard-left">
            <div className="dashboard-left-container">
              <div className="dashboard-logo-container">
                <img src={logo} className="dashboard-logo" />
              </div>
              <div className="dashboard-nav">
                <ul>
                  <li
                    className={
                      activeLink === "dashboard"
                        ? "dashboard-link active-link"
                        : "dashboard-link"
                    }
                    onClick={() => {
                      setActiveLink("dashboard");
                    }}
                  >
                    <i
                      className={
                        activeLink === "dashboard"
                          ? "fas fa-chart-line dashboard-nav-icon active-link-icon"
                          : "fas fa-chart-line dashboard-nav-icon"
                      }
                    ></i>
                    Tableau de bord
                  </li>
                  <li
                    className={
                      activeLink === "orders"
                        ? "dashboard-link active-link"
                        : "dashboard-link"
                    }
                    onClick={() => {
                      setActiveLink("orders");
                    }}
                  >
                    <i
                      className={
                        activeLink === "orders"
                          ? "fas fa-pallet dashboard-nav-icon active-link-icon"
                          : "fas fa-pallet dashboard-nav-icon"
                      }
                    ></i>
                    Commandes
                  </li>
                  <li
                    className={
                      activeLink === "materials"
                        ? "dashboard-link active-link"
                        : "dashboard-link"
                    }
                    onClick={() => {
                      setActiveLink("materials");
                    }}
                  >
                    <i
                      className={
                        activeLink === "materials"
                          ? "fas fa-tree dashboard-nav-icon active-link-icon"
                          : "fas fa-tree dashboard-nav-icon"
                      }
                    ></i>
                    Matériaux
                  </li>
                  <li
                    className={
                      activeLink === "hardwares"
                        ? "dashboard-link active-link"
                        : "dashboard-link"
                    }
                    onClick={() => {
                      setActiveLink("hardwares");
                    }}
                  >
                    <i
                      className={
                        activeLink === "hardwares"
                          ? "fas fa-pen-alt dashboard-nav-icon active-link-icon"
                          : "fas fa-pen-alt dashboard-nav-icon"
                      }
                    ></i>
                    Matériels
                  </li>
                </ul>
              </div>
              <div className="dashboard-logout">
                <button
                  className="btn"
                  onClick={() => {
                    signingOut();
                  }}
                >
                  Déconnexion<i className="fas fa-sign-out-alt btn-icon"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="dashboard-right">
            {activeLink === "orders" ? <Orders /> : <React.Fragment />}
            {activeLink === "materials" ? <Materials /> : <React.Fragment />}
            {activeLink === "hardwares" ? <Hardwares /> : <React.Fragment />}
            {activeLink === "dashboard" ? <Analytics /> : <React.Fragment />}
          </div>
        </section>
      ) : (
        <React.Fragment />
      )}
    </React.Fragment>
  );
};

export default Dashboard;
