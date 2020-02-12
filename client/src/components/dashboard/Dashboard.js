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
  const [toggled, setToggled] = useState(false);
  const [scroll, setScroll] = context.scroll;

  const signingOut = () => {
    context.signout();
    props.history.push("/admin/login");
  };

  window.addEventListener("resize", () => {
    if (toggled) {
      toggle();
    }
  });

  const toggle = () => {
    const elem = document.getElementById("dashboard-left");
    const l1 = document.getElementById("l1");
    const l2 = document.getElementById("l2");
    const l3 = document.getElementById("l3");
    const vw = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );

    if (vw <= 1250) {
      if (toggled) {
        l1.classList.remove("l1");
        l2.classList.remove("l2");
        l3.classList.remove("l3");
        elem.style.transform = "translateX(-150%)";
        elem.style.opacity = "0";
        setToggled(false);
      } else {
        l1.classList.add("l1");
        l2.classList.add("l2");
        l3.classList.add("l3");
        elem.style.transform = "translateX(0)";
        elem.style.opacity = "1";
        setToggled(true);
      }
    }
  };

  useEffect(() => {
    context.getUser();
  }, []);

  return (
    <React.Fragment>
      {loading ? <Spinner /> : <React.Fragment />}
      {user ? (
        <section className="dashboard-section">
          <nav>
            <img src={logo} className="dashboard-logo mobile" />
            <div
              className="ham"
              id="ham"
              onClick={() => {
                toggle();
              }}
            >
              <span id="l1" className="line"></span>
              <span id="l2" className="line"></span>
              <span id="l3" className="line"></span>
            </div>
          </nav>
          <div className="dashboard-left" id="dashboard-left">
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
                      let d = document.querySelector(".dashboard-right");
                      d.scrollTo(0, 0);
                      setScroll(0);
                      setActiveLink("dashboard");
                      toggle();
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
                      let d = document.querySelector(".dashboard-right");
                      d.scrollTo(0, 0);
                      setScroll(0);
                      setActiveLink("orders");
                      toggle();
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
                      let d = document.querySelector(".dashboard-right");
                      d.scrollTo(0, 0);
                      setScroll(0);
                      setActiveLink("materials");
                      toggle();
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
                      let d = document.querySelector(".dashboard-right");
                      d.scrollTo(0, 0);
                      setScroll(0);
                      setActiveLink("hardwares");
                      toggle();
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
                  className="btn signout-btn"
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
