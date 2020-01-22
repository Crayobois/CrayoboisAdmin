import React, { useContext, useState, useEffect } from "react";
import Context from "../context/AuthContext";
import "./Orders.css";

const Orders = props => {
  const context = useContext(Context);
  const orders = context.orders[0];

  useEffect(() => {
    if (!orders) {
      context.getOrders();
    }
  }, []);

  return (
    <React.Fragment>
      <section className="orders-section">
        <div className="orders-filter">
          <label className="orders-filter-label" htmlFor="displayed-orders">État des commandes:</label>
          <select
            id="displayed-orders"
            className="orders-select"
            name="displayed-orders"
          >
            <option value="*">Toutes les commandes</option>
            <option value="waiting">En attente</option>
            <option value="shipped">Livrée</option>
          </select>
          <label className="orders-filter-label" htmlFor="orders-order">Ancienneté:</label>
          <select
            id="orders-order"
            className="orders-select last-select"
            name="orders-order"
          >
            <option value="recent">Récente</option>
            <option value="old">Ancienne</option>
          </select>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Orders;
