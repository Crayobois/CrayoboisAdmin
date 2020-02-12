import React, { useContext, useState, useEffect } from "react";
import Context from "../context/AuthContext";
import "./Orders.css";
import Spinner from "../spinner/Spinner";
import FocusedOrder from "./FocusedOrder";

const Orders = props => {
  const context = useContext(Context);
  const displayedList = context.displayedList[0];
  const generateNewList = context.generateNewList;
  const [focusedOrder, setFocusedOrder] = context.focusedOrder;
  const [scroll, setScroll] = context.scroll;

  const newList = () => {
    const stateSelect = document.querySelector("#orders-state");
    const state = stateSelect.options[stateSelect.selectedIndex].value;
    const orderSelect = document.querySelector("#orders-order");
    const order = orderSelect.options[orderSelect.selectedIndex].value;

    generateNewList(state, order);
  };

  const removeFocus = () => {
    setFocusedOrder(null);
  };

  const searchOrder = id => {
    const value = parseInt(document.getElementById(id).value);
    if (value != "" && !isNaN(value)) {
      context.searchOrder(value);
    }
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
    const d = document.querySelector(".dashboard-right");
    d.scrollTo(0, scroll);
    if (!displayedList) {
      context.getOrders();
    }

  }, [focusedOrder]);

  return (
    <React.Fragment>
      <section
        className={
          !displayedList ? "orders-section orders-loading" : "orders-section"
        }
      >
        {focusedOrder ? (
          <FocusedOrder order={focusedOrder} removeFocus={removeFocus} />
        ) : (
          <React.Fragment>
            {displayedList ? (
              <div className="orders-filter multiple-elems">
                <div id="search-item" className="orders-search">
                  <input
                    type="text"
                    name="search"
                    id="mat-search-input"
                    className="search-input"
                    autoComplete="off"
                    placeholder="# de commande"
                    required
                  />
                  <button
                    className="filter-btn search-btn"
                    onClick={() => {
                      searchOrder("mat-search-input");
                    }}
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                <div className="filter">
                  <div className="selects">
                    <select
                      id="orders-state"
                      className="orders-select"
                      name="displayed-orders"
                    >
                      <option value="*">Toutes les commandes</option>
                      <option value="waiting">En attente</option>
                      <option value="shipped">Livrée</option>
                    </select>
                    <select
                      id="orders-order"
                      className="orders-select right"
                      name="orders-order"
                    >
                      <option value="recent">Récente</option>
                      <option value="old">Ancienne</option>
                    </select>
                  </div>

                  <button
                    className="filter-btn wide"
                    onClick={() => {
                      newList();
                    }}
                  >
                    Filtrer<i className="fas fa-filter filter-btn-icon"></i>
                  </button>
                </div>
              </div>
            ) : (
              <React.Fragment />
            )}
            {displayedList ? (
              <div className="orders">
                {displayedList.map(order => {
                  return (
                    <div
                      className="order"
                      onClick={() => {
                        setFocusedOrder(order);
                        const d = document.querySelector(".dashboard-right");
                        setScroll(d.scrollTop);
                      }}
                      key={order.id}
                    >
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
                          {order.order_status === "Livré"
                            ? "Livré"
                            : "En attente"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="orders">
                <Spinner addStyle={true} />
              </div>
            )}
          </React.Fragment>
        )}
      </section>
    </React.Fragment>
  );
};

export default Orders;
