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
    // create chart

    const months = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let labels = [];
    let activeOrders = [];

    for (var i = 0; i < months[currentMonth]; i++) {
      labels.push(`${i + 1}`);
      activeOrders.push(0);
    }

    let canvas = document.getElementById("net-revenue-canvas").getContext("2d");

    const parseDayMonthYear = date => {
      let allowedChar = "0123456789-";
      let newDate = "";
      let year = "";
      let month = "";
      let day = "";

      // convert to yyyy-mm-dd
      for (let e = 0; e < date.length; e++) {
        if (allowedChar.includes(date[e])) {
          newDate += date[e];
        } else {
          break;
        }
      }

      // get year
      let encounteredDash = 0;
      for (let g = 0; g < newDate.length; g++) {
        if (newDate[g] === "-") {
          encounteredDash++;
        }
        if (newDate[g] != "-" && encounteredDash === 0) {
          year += newDate[g];
        } else if (newDate[g] != "-" && encounteredDash === 1) {
          month += newDate[g];
        } else if (newDate[g] != "-" && encounteredDash === 2) {
          day += newDate[g];
        }
      }

      return [year, month, day];
    };

    if (ordersForAnalytics) {
      for (var i = 0; i < ordersForAnalytics.length; i++) {
        const dateOfOrder = parseDayMonthYear(
          ordersForAnalytics[i].create_time
        );
        if (
          currentMonth === parseInt(dateOfOrder[1] - 1) &&
          currentYear === parseInt(dateOfOrder[0])
        ) {
          activeOrders[dateOfOrder[2] - 1] += parseFloat(
            ordersForAnalytics[i].purchase_units[0].amount.breakdown.item_total
              .value
          );
        }
      }
    }

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
            data: activeOrders
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false
        }
      }
    });
  }, [ordersForAnalytics]);

  return (
    <section className="analytics-section">
      <div className="revenue-insights">
        <div className="insights">
          <span className="insights-name">
            <i className="fas fa-briefcase insights-icon"></i>Revenu brut
          </span>
          <span className="insights-value">
            {priceFormatter.format(10050.25)}
          </span>
        </div>
        <div className="insights">
          <span className="insights-name">
            <i className="fab fa-canadian-maple-leaf insights-icon"></i>TPS
          </span>
          <span className="insights-value">{priceFormatter.format(17.2)}</span>
        </div>
        <div className="insights">
          <span className="insights-name">
            <i className="fas fa-igloo insights-icon"></i>TVQ
          </span>
          <span className="insights-value">{priceFormatter.format(25.35)}</span>
        </div>
        <div className="insights">
          <span className="insights-name">
            <i className="fas fa-paper-plane insights-icon"></i>Livraison
          </span>
          <span className="insights-value">{priceFormatter.format(15.25)}</span>
        </div>
        <div className="stats-pills">
          <span className="pill">
            <i className="fas fa-user insights-icon"></i>
            <span className="customers-insights-name">Clients</span>{" "}
            <span className="customers-insights-value">256</span>
          </span>
          <span className="pill">
            <i className="fas fa-pallet insights-icon"></i>
            <span className="customers-insights-name">Commandes</span>{" "}
            <span className="customers-insights-value">140</span>
          </span>
        </div>
      </div>
      <div className="revenue-canvas">
        <div className="div">
          <canvas id="net-revenue-canvas"></canvas>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
