import React, { useContext, useState, useEffect } from "react";
import Context from "../context/AuthContext";
import "./Orders.css";

const Orders = props => {
  const context = useContext(Context);
  const displayedList = context.displayedList[0];
  const generateNewList = context.generateNewList;

  const newList = () => {
    const stateSelect = document.querySelector("#orders-state");
    const state = stateSelect.options[stateSelect.selectedIndex].value;
    const orderSelect = document.querySelector("#orders-order");
    const order = orderSelect.options[orderSelect.selectedIndex].value;

    generateNewList(state, order);
  }

  useEffect(() => {
    if (!displayedList) {
      context.getOrders();
    }
  }, [displayedList]);

  return (
    <React.Fragment>
      <section className="orders-section">
        <div className="orders-filter">
          <label className="orders-filter-label" htmlFor="displayed-orders">
            État des commandes:
          </label>
          <select
            id="orders-state"
            className="orders-select"
            name="displayed-orders"
          >
            <option value="*">Toutes les commandes</option>
            <option value="waiting">En attente</option>
            <option value="shipped">Livrée</option>
          </select>
          <label className="orders-filter-label" htmlFor="orders-order">
            Ancienneté:
          </label>
          <select
            id="orders-order"
            className="orders-select"
            name="orders-order"
          >
            <option value="recent">Récente</option>
            <option value="old">Ancienne</option>
          </select>
          <button
            className="filter-btn"
            onClick={() => {
              newList();
            }}
          >
            Filtrer
          </button>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Orders;
