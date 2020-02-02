import React, { useState, useEffect, useContext } from "react";
import "./Analytics.css";
import Chart from "chart.js";


const DataVisualization = props => {
  const priceFormatter = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });

  useEffect(() => {
    console.log(props.orders, props.labels);
    let chart;
    if (props.orders) {
      let canvas = document
        .getElementById("net-revenue-canvas")
        .getContext("2d");
      Chart.defaults.global.defaultFontFamily = "Poppins";
      chart = new Chart(canvas, {
        type: "line",
        data: {
          labels: props.labels,
          datasets: [
            {
              fill: false,
              backgroundColor: "rgba(199,92,15,1)",
              borderColor: "rgba(199,92,15,0.5)",
              data: props.orders
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
    }
  }, [props.orders]);

  return (
    <React.Fragment>
      <canvas id="net-revenue-canvas"></canvas>
    </React.Fragment>
  );
};

export default DataVisualization;
