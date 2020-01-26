import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Analytics.css";

const Analytics = props => {
  const context = useContext(AuthContext);

  return (
    <section className="analytics-section">
      <div className="customers-insights">
        <div className="insights insights-clients">
          <span className="insights-name">Clients</span>
          <span className="insights-value">154</span>
        </div>
        <div className="insights insights-orders">
          <span className="insights-name">Commandes</span>
          <span className="insights-value">256</span>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
