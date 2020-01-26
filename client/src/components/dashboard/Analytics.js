import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Analytics.css";

const Analytics = props => {
  const context = useContext(AuthContext);

  const priceFormatter = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });


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
      <div className="revenue-insights">
        <div className="insights insights-clients">
          <span className="insights-name">Revenu brut</span>
          <span className="insights-value">{priceFormatter.format(10050.25)}</span>
        </div>
        <div className="insights insights-orders revenu-right">
          <span className="insights-name">TPS</span>
          <span className="insights-value">{priceFormatter.format(17.20)}</span>
        </div>
        <div className="insights insights-orders revenu-right">
          <span className="insights-name">TVQ</span>
          <span className="insights-value">{priceFormatter.format(25.35)}</span>
        </div>
        <div className="insights insights-orders">
          <span className="insights-name">Livraison</span>
          <span className="insights-value">{priceFormatter.format(15.25)}</span>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
