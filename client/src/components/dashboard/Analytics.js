import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Analytics.css";
import Chart from "chart.js";

const Analytics = props => {
  const context = useContext(AuthContext);
  const [
    ordersForAnalytics,
    setOrdersForAnalytics
  ] = context.ordersForAnalytics;

  const priceFormatter = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });

  useEffect(() => {
    if (!ordersForAnalytics) {
      context.getOrders();
    }
    const months = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let labels = [];
    let activeOrders = [];

    for (var i = 0; i < months[currentMonth]; i++) {
      labels.push(`${i + 1}`);
    }

    let canvas = document.getElementById("net-revenue-canvas").getContext("2d");

    /*** Gradient ***/
    var gradient = canvas.createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, "rgba(199,92,15,1)");
    gradient.addColorStop(1, "rgba(199,92,15,0)");
    /***************/

    Chart.defaults.global.defaultFontFamily = "Poppins";

    let chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Revenu net",
            fill: false,
            backgroundColor: "rgba(199,92,15,1)",
            borderColor: "rgba(199,92,15,0.5)",
            data: [
              25.0,
              32.4,
              22.2,
              39.4,
              34.2,
              22.0,
              23.2,
              24.1,
              20.0,
              18.4,
              19.1,
              17.4
            ]
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
            labels: {
                // This more specific font property overrides the global property
                fontColor: '#29353D',
                fontSize: 18,
                fontStyle: 500
            }
        }
      }
    });
  }, []);

  return (
    <section className="analytics-section">
      {/*
 <div className="customers-insights">
        <div className="insights insights-clients">
          <span className="insights-name">
            <i className="fas fa-user insights-icon"></i>Clients
          </span>
          <span className="insights-value">154</span>
        </div>
        <div className="insights insights-orders">
          <span className="insights-name">
            <i className="fas fa-pallet insights-icon"></i>Commandes
          </span>
          <span className="insights-value">256</span>
        </div>
      </div>
        */}

      <div className="revenue-insights">
        <div className="insights insights-clients">
          <span className="insights-name">
            <i className="fas fa-briefcase insights-icon"></i>Revenu brut
          </span>
          <span className="insights-value">
            {priceFormatter.format(10050.25)}
          </span>
        </div>
        <div className="insights insights-orders revenu-right">
          <span className="insights-name">
            <i className="fab fa-canadian-maple-leaf insights-icon"></i>TPS
          </span>
          <span className="insights-value">{priceFormatter.format(17.2)}</span>
        </div>
        <div className="insights insights-orders revenu-right">
          <span className="insights-name">
            <i className="fas fa-igloo insights-icon"></i>TVQ
          </span>
          <span className="insights-value">{priceFormatter.format(25.35)}</span>
        </div>
        <div className="insights insights-orders">
          <span className="insights-name">
            <i className="fas fa-paper-plane insights-icon"></i>Livraison
          </span>
          <span className="insights-value">{priceFormatter.format(15.25)}</span>
        </div>
      </div>
      <div className="revenue-canvas">
        <canvas id="net-revenue-canvas"></canvas>
      </div>
    </section>
  );
};

export default Analytics;
