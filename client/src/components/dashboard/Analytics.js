import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Analytics.css";
import DataVisualization from "./DataVisualization";
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
  const [monthlyData, setMonthlyData] = useState(null);
  const [yearlyData, setYearlyData] = useState(null);
  const [activeSet, setActiveSet] = context.activeSet;
  const [destroy, setDestroy] = context.destroy;
  const [yearly, setYearly] = useState(false);

  const refresh = () => {
    revenuChart();
  };

  const priceFormatter = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });

  const revenuChart = () => {
    // create chart
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let monthlyLabels = [];
    let yearlyLabels = [...monthsName];
    let monthlyOrders = [];
    let yearlyOrders = [];

    // initializes x and y axis
    for (var i = 0; i < months.length; i++) {
      yearlyOrders.push(0);
    }
    for (var i = 0; i < months[currentMonth]; i++) {
      monthlyLabels.push(`${i + 1}`);
      monthlyOrders.push(0);
    }

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

    // add orders of the month to active orders
    if (ordersForAnalytics) {
      for (var i = 0; i < ordersForAnalytics.length; i++) {
        const dateOfOrder = parseDayMonthYear(
          ordersForAnalytics[i].create_time
        );
        if (currentYear === parseInt(dateOfOrder[0])) {
          yearlyOrders[dateOfOrder[1] - 1] += parseFloat(
            ordersForAnalytics[i].purchase_units[0].amount.breakdown.item_total
              .value
          );
        }
      }
      for (var i = 0; i < ordersForAnalytics.length; i++) {
        const dateOfOrder = parseDayMonthYear(
          ordersForAnalytics[i].create_time
        );
        if (
          currentMonth === parseInt(dateOfOrder[1] - 1) &&
          currentYear === parseInt(dateOfOrder[0])
        ) {
          monthlyOrders[dateOfOrder[2] - 1] += parseFloat(
            ordersForAnalytics[i].purchase_units[0].amount.breakdown.item_total
              .value
          );
        }
      }
    }

    setMonthlyData({
      labels: monthlyLabels,
      orders: monthlyOrders
    });
    setYearlyData({
      labels: yearlyLabels,
      orders: yearlyOrders
    });
    if (yearly) {
      setActiveSet({
        labels: yearlyLabels,
        orders: yearlyOrders
      });
    } else {
      setActiveSet({
        labels: monthlyLabels,
        orders: monthlyOrders
      });
    }
  };

  const changeCurrentSet = value => {
    if (!value) {
      setDestroy(!destroy);
      setActiveSet(monthlyData);
      setYearly(false);
    } else {
      setDestroy(!destroy);
      setActiveSet(yearlyData);
      setYearly(true);
    }
  };

  useEffect(() => {
    if (!analytics) {
      context.getAnalytics();
    }
    if (!ordersForAnalytics) {
      context.getOrders();
    } else if (!monthlyData && !yearlyData) {
      revenuChart();
    }
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
            <i
              id="refresh-icon"
              className="fas fa-sync-alt btn-icon sync-btn-icon"
            ></i>
          </span>
          <span className="graph-title">
            Revenu net en{" "}
            {!yearly
              ? monthsName[new Date().getMonth()]
              : new Date().getFullYear()}
          </span>
          <div className="switch-container">
            <span className="year-long">Année</span>
            <div className="switch-container">
              <Switch changeCurrentSet={changeCurrentSet} />
            </div>
          </div>
        </div>
        <div id="chart-canvas" className="div">
          {activeSet ? <DataVisualization /> : null}
        </div>
      </div>
    </section>
  );
};

export default Analytics;
