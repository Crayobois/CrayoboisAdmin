import React, { useContext, useEffect, useState } from "react";
import "./FocusedOrder.css";
import AuthContext from "../context/AuthContext";
const uuidv4 = require("uuid/v4");

const FocusedOrder = props => {
  const context = useContext(AuthContext);
  let order = props.order;

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

  useEffect(() => {}, []);

  return (
    <div className="focused-order-container">
      <React.Fragment>
        <div className="focused-order-top">
          <span
            className="focused-back"
            onClick={() => {
              props.removeFocus();
            }}
          >
            <i className="fas fa-chevron-left focused-back-icon"></i>
            Précédent
          </span>
          {order.order_status !== "Livré" ? (
            <span
              className="filter-btn"
              onClick={() => {
                context.setToShipped(order);
              }}
            >
              Livrer<i className="fas fa-shipping-fast ship"></i>
            </span>
          ) : (
            <span className="shipped">
              Livré<i className="fas fa-check"></i>
            </span>
          )}
        </div>
        <div className="focused-order">
          <div className="focused-order-info">
            <div className="focused-order-info-client">
              <span className="focused-order-sub-header">
                Informations du client
              </span>
              <span className="order-text">
                <i className="fas fa-user order-icon"></i>
                {`${order.payer.name.given_name} ${order.payer.name.surname}`}
              </span>
              <span className="order-text">
                <i className="fas fa-envelope order-icon"></i>
                {order.payer.email_address}
              </span>
              <span className="order-text">
                <i className="far fa-calendar-alt order-icon"></i>
                Transaction: {parseDate(order.create_time)}
              </span>
            </div>
            <div className="order-info-summary">
              <span className="focused-order-sub-header">
                Adresse de livraison
              </span>
              <span className="order-text">
                <i className="fas fa-home order-icon"></i>
                {order.purchase_units[0].shipping.address.address_line_1}
              </span>
              <span className="order-text">
                <i className="fas fa-globe-americas order-icon"></i>
                {`${order.purchase_units[0].shipping.address.admin_area_2}, ${order.purchase_units[0].shipping.address.admin_area_1}, ${order.purchase_units[0].shipping.address.country_code}`}
              </span>
              <span className="order-text">
                <i className="fas fa-mail-bulk order-icon"></i>
                {order.purchase_units[0].shipping.address.postal_code}
              </span>
            </div>
          </div>
          <div className="order-bill">
            <div className="items">
              <span className="focused-order-sub-header order-header">
                Commande #{order.customId - 100000000}
              </span>
              <div className="focused-order-items">
                {order.purchase_units[0].items.map(item => {
                  return (
                    <div key={item.name} className="focused-order-item-info">
                      <div className="focused-order-img-container">
                        {item.path.map((path, index) => {
                          return (
                            <img
                              key={uuidv4()}
                              src={path}
                              className={index === 1 ? "focused-order-img second" : "focused-order-img"}
                            />
                          );
                        })}
                      </div>
                      <div className="focused-order-item-name">
                        <span className="order-text wrap">{item.name}</span>
                      </div>
                      <div className="focused-order-qty">
                        <span className="focused-order-item-qty order-text">
                          <i className="fas fa-pen-alt order-icon"></i>
                          {item.quantity}
                        </span>
                      </div>
                      <div className="focused-order-item-price">
                        <span className="order-text">
                          {priceFormatter.format(item.unit_amount.value)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="focused-order-total">
                  <span>
                    Sous-total:{" "}
                    {priceFormatter.format(
                      order.purchase_units[0].amount.breakdown.item_total.value
                    )}
                  </span>
                  <span>
                    Taxes:{" "}
                    {priceFormatter.format(
                      order.purchase_units[0].amount.breakdown.tax_total.value
                    )}
                  </span>
                  <span>
                    Livraison:{" "}
                    {priceFormatter.format(
                      order.purchase_units[0].amount.breakdown.shipping.value
                    )}
                  </span>
                  <span>
                    Total:{" "}
                    {priceFormatter.format(
                      order.purchase_units[0].amount.value
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default FocusedOrder;
