import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Analytics.css";
import Chart from "chart.js";

const DataVisualization = props => {
  const context = useContext(AuthContext);
  const [destroy, setDestroy] = context.destroy;
  const [activeSet, setActiveSet] = context.activeSet;
  let chart;

  const priceFormatter = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });

  const createChart = (labels, data) => {
    let canvas = document.getElementById("net-revenue-canvas").getContext("2d");
    Chart.defaults.global.defaultFontFamily = "Poppins";
    chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            fill: false,
            backgroundColor: "rgba(199,92,15,1)",
            borderColor: "rgba(199,92,15,0.5)",
            data: data
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

  const destroyChart = chart => {
    // reseting canvas
    let div = document.getElementById("chart-canvas");
    div.childNodes.forEach((node, index) => {
      div.removeChild(div.childNodes[index]);
    });
    // creating canvas
    let canvas = document.createElement("canvas");
    canvas.id = "net-revenue-canvas";
    // append new canvas
    if (div.childNodes.length === 0) {
      div.appendChild(canvas);
    }
    setDestroy(false);
  };

  useEffect(() => {
    if (activeSet && !destroy) {
      createChart(activeSet.labels, activeSet.orders);
    } else if (destroy) {
      destroyChart(chart);
    }
  }, [activeSet, destroy]);

  return (
    <React.Fragment>
      <canvas id="net-revenue-canvas"></canvas>
    </React.Fragment>
  );
};

export default DataVisualization;
