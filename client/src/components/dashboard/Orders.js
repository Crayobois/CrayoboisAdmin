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
  };

  const parseDate = prevDate => {
    let allowedChar = "0123456789-";
    let newDate = "";

    for (let e = 0; e < prevDate.length; e++) {
      if (allowedChar.includes(prevDate[e])) {
        newDate += prevDate[e];
      } else {
        break;
      }
    }

    return newDate;
  };

  const priceFormatter = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });

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
            Filtrer<i className="fas fa-filter filter-btn-icon"></i>
          </button>
        </div>
        {displayedList ? (
          <div className="orders">
            {displayedList.map(order => {
              return (
                <div className="order" key={order.id}>
                  <div className="order-id-container">
                    <span className="order-text">
                      #{order.customId - 100000000}
                    </span>
                  </div>
                  <div className="order-client-info-container">
                    <div className="order-user">
                      <div className="order-user-info">
                        <span className="order-text">
                          <i className="fas fa-user order-icon"></i>
                          {`${order.payer.name.given_name} ${order.payer.name.surname}`}
                        </span>
                        <span className="order-text">
                          <i className="fas fa-envelope order-icon"></i>
                          {order.payer.email_address}
                        </span>
                      </div>
                      <span className="order-text">
                        <i className="far fa-calendar-alt order-icon"></i>
                        {parseDate(order.create_time)}
                      </span>
                    </div>
                  </div>
                  <div className="order-info-container">
                    <div className="order-info-quantities">
                      <span className="order-text">
                        {priceFormatter.format(
                          order.purchase_units[0].amount.value
                        )}
                      </span>
                      <span className="order-text">
                        {order.purchase_units[0].items.length}
                        <i className="fas fa-pen-alt order-icon order-icon-right"></i>
                      </span>
                    </div>
                    <span className="order-text order-state">
                      {order.order_status === "Livré" ? "Livré" : "En attente"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <React.Fragment />
        )}
      </section>
    </React.Fragment>
  );
};

export default Orders;
