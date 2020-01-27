import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Analytics.css";
import Chart from "chart.js";
import Switch from "../switch/Switch";

const Analytics = props => {
  const context = useContext(AuthContext);
  const [
    ordersForAnalytics,
    setOrdersForAnalytics
  ] = context.ordersForAnalytics;
  const [analytics, setAnalytics] = context.analytics;
  const months = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const monthsName = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre"
  ];

  const refresh = (month, year) => {
    if (month) {
      context.getOrders();
      const spinIcon = document.getElementById("refresh-icon");
      spinIcon.classList.add("spin");
      setTimeout(() => {spinIcon.classList.remove("spin")}, 1000);
    }
  };

  const monthlyRevenuChart = () => {
    // create chart
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let labels = [];
    let activeOrders = [];

    // initializes x and y axis
    for (var i = 0; i < months[currentMonth]; i++) {
      labels.push(`${i + 1}`);
      activeOrders.push(0);
    }

    let canvas = document.getElementById("net-revenue-canvas").getContext("2d");

    // parse incoming date to [yyyy,mm,dd]
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
      // get year, month and day of order
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

    // add orders of the months to active orders
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
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function(value, index, values) {
                  return priceFormatter.format(value);
                }
              }
            }
          ]
        }
      }
    });
  };

  const priceFormatter = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });

  useEffect(() => {
    if (!analytics) {
      context.getAnalytics();
    }

    if (!ordersForAnalytics) {
      context.getOrders();
    }

    monthlyRevenuChart();
  }, [ordersForAnalytics]);

  return (
    <section className="analytics-section">
      <div className="revenue-insights">
        <div className="insights">
          <span className="insights-name">
            <i className="fas fa-briefcase insights-icon"></i>Revenu brut
          </span>
          <span className="insights-value">
            {analytics ? priceFormatter.format(analytics.grossRevenu) : ""}
          </span>
        </div>
        <div className="insights">
          <span className="insights-name">
            <i className="fab fa-canadian-maple-leaf insights-icon"></i>TPS
          </span>
          <span className="insights-value">
            {analytics ? priceFormatter.format(analytics.tps) : ""}
          </span>
        </div>
        <div className="insights">
          <span className="insights-name">
            <i className="fas fa-igloo insights-icon"></i>TVQ
          </span>
          <span className="insights-value">
            {analytics ? priceFormatter.format(analytics.tvq) : ""}
          </span>
        </div>
        <div className="insights">
          <span className="insights-name">
            <i className="fas fa-paper-plane insights-icon"></i>Livraison
          </span>
          <span className="insights-value">
            {analytics ? priceFormatter.format(analytics.totalShipping) : ""}
          </span>
        </div>
        <div className="stats-pills">
          <span className="pill">
            <i className="fas fa-user insights-icon"></i>
            <span className="customers-insights-name">Clients</span>{" "}
            <span className="customers-insights-value">
              {analytics ? analytics.totalCustomers : ""}
            </span>
          </span>
          <span className="pill">
            <i className="fas fa-pallet insights-icon"></i>
            <span className="customers-insights-name">Commandes</span>{" "}
            <span className="customers-insights-value">
              {analytics ? analytics.totalOrders - 100000000 : ""}
            </span>
          </span>
        </div>
      </div>
      <div className="revenue-canvas">
        <div className="graph-top">
          <span
            className="filter-btn sync-btn"
            onClick={() => {
              refresh(true, null);
            }}
          >
            Actualiser
            <i id="refresh-icon" className="fas fa-sync-alt btn-icon sync-btn-icon"></i>
          </span>
          <span className="graph-title">
            Revenu net en {monthsName[new Date().getMonth()]}
          </span>
          <div className="switch-container">
        <span className="year-long">Année</span>
            <Switch />
          </div>
        </div>
        <div className="div">
          <canvas id="net-revenue-canvas"></canvas>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
