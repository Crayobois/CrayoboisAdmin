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
    const [yearly, setYearly] = context.yearly;

    const refresh = async () => {
        context.getOrders(true).then(newOrders => {
            revenuChart(newOrders, false);
            document.querySelector("#checkbox").checked = false;
            const spinIcon = document.getElementById("refresh-icon");
            spinIcon.classList.add("spin");
            setTimeout(() => {
                spinIcon.classList.remove("spin");
            }, 750);
        });
    };

    const priceFormatter = new Intl.NumberFormat("fr-CA", {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 2
    });

    const revenuChart = (orders, yearly) => {
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

        let all;
        if (orders) {
            all = orders;
        } else {
            all = ordersForAnalytics;
        }
        // add orders of the month to active orders
        for (var i = 0; i < all.length; i++) {
            const dateOfOrder = parseDayMonthYear(all[i].create_time);
            if (currentYear === parseInt(dateOfOrder[0])) {
                yearlyOrders[dateOfOrder[1] - 1] += parseFloat(
                    all[i].purchase_units[0].amount.breakdown.item_total.value
                );
            }
        }
        for (var i = 0; i < all.length; i++) {
            const dateOfOrder = parseDayMonthYear(all[i].create_time);
            if (
                currentMonth === parseInt(dateOfOrder[1] - 1) &&
                currentYear === parseInt(dateOfOrder[0])
            ) {
                monthlyOrders[dateOfOrder[2] - 1] += parseFloat(
                    all[i].purchase_units[0].amount.breakdown.item_total.value
                );
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
        if (orders) {
            changeCurrentSet(false, {
                labels: monthlyLabels,
                orders: monthlyOrders
            });
        } else {
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
        }
    };

    const changeCurrentSet = (value, set) => {
        if (set) {
            setDestroy(!destroy);
            setActiveSet(set);
            setYearly(false);
        } else {
            if (!value) {
                setDestroy(!destroy);
                setActiveSet(monthlyData);
                setYearly(false);
            } else {
                setDestroy(!destroy);
                setActiveSet(yearlyData);
                setYearly(true);
            }
        }
    };

    function uploadFile(id) {
        const input = document.getElementById(id);
        let files = input.files;
        console.log(files);
        context.startUpload(files);
    }

    useEffect(() => {
        if (!analytics) {
            context.getAnalytics();
        }
        if (!ordersForAnalytics) {
            context.getOrders();
        } else if (!monthlyData && !yearlyData) {
            revenuChart();
        }
        if (activeSet === monthlyData) {
            setYearly(false);
        }

        return () => {
            setYearly(false);
            setActiveSet(monthlyData);
        };
    }, [ordersForAnalytics]);

    return (
        <section className="analytics-section">
            {/*     <label
                htmlFor="file-input"
                className="filter-btn add-item-btn upload-img"
            >
                <input
                    type="file"
                    name="file-input"
                    onChange={() => {
                        uploadFile("file-input");
                    }}
                    id="file-input"
                    multiple
                />
                Charger
            </label> */}
            <div className="revenue-insights">
                <div className="insights">
                    <span className="insights-name">
                        <i className="fas fa-briefcase insights-icon"></i>Revenu
                        net
                    </span>
                    <span className="insights-value">
                        {analytics
                            ? priceFormatter.format(
                                  analytics.grossRevenu -
                                      analytics.tps -
                                      analytics.tvq -
                                      analytics.totalShipping
                              )
                            : ""}
                    </span>
                </div>
                <div className="insights">
                    <span className="insights-name">
                        <i className="fab fa-canadian-maple-leaf insights-icon"></i>
                        TPS
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
                        <i className="fas fa-paper-plane insights-icon"></i>
                        Livraison
                    </span>
                    <span className="insights-value">
                        {analytics
                            ? priceFormatter.format(analytics.totalShipping)
                            : ""}
                    </span>
                </div>
                <div className="stats-pills">
                    <span className="pill-d">
                        <div>
                            <i className="fas fa-user insights-icon"></i>
                            <span className="customers-insights-name">
                                Clients
                            </span>{" "}
                        </div>
                        <span className="customers-insights-value">
                            {analytics ? analytics.totalCustomers : ""}
                        </span>
                    </span>
                    <span className="pill-d">
                        <div>
                            <i className="fas fa-pallet insights-icon"></i>
                            <span className="customers-insights-name">
                                Commandes
                            </span>{" "}
                        </div>
                        <span className="customers-insights-value last">
                            {analytics ? analytics.totalOrders - 100000000 : ""}
                        </span>
                    </span>
                </div>
                <span className="pill">
                    <div>
                        <i className="fas fa-user insights-icon"></i>
                        <span className="customers-insights-name">
                            Clients
                        </span>{" "}
                    </div>
                    <span className="customers-insights-value">
                        {analytics ? analytics.totalCustomers : ""}
                    </span>
                </span>
                <span className="pill">
                    <div>
                        <i className="fas fa-pallet insights-icon"></i>
                        <span className="customers-insights-name">
                            Commandes
                        </span>{" "}
                    </div>
                    <span className="customers-insights-value last">
                        {analytics ? analytics.totalOrders - 100000000 : ""}
                    </span>
                </span>
            </div>
            <div className="revenue-canvas">
                <div className="graph-top">
                    <span
                        className="filter-btn sync-btn"
                        onClick={() => {
                            refresh();
                        }}
                    >
                        <span className="sync">Actualiser</span>
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
