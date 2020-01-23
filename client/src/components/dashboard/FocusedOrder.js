import React, { useContext, useEffect, useState } from "react";
import "./FocusedOrder.css";
import AuthContext from "../context/AuthContext";

const FocusedOrder = props => {
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

  return (
    <div className="focused-order-container">
      <div className="focused-order-top">
        <span
          className="focused-order-back"
          onClick={() => {
            props.removeFocus();
          }}
        >
          <i className="fas fa-chevron-left focused-order-back-icon"></i>
          Précédent
        </span>
        <span className="filter-btn">
          Livrer<i className="fas fa-shipping-fast ship"></i>
        </span>
      </div>
      <div className="focused-order">
        <div className="order-info">
          <div className="order-info-client">
            <span>{`${order.payer.name.given_name} ${order.payer.name.surname}`}</span>
            <span>{order.payer.email_address}</span>
            <span>{parseDate(order.create_time)}</span>
            <span>
              {order.purchase_units[0].shipping.address.address_line_1}
            </span>
            <span>
              {`${order.purchase_units[0].shipping.address.admin_area_2}, ${order.purchase_units[0].shipping.address.admin_area_1}, ${order.purchase_units[0].shipping.address.country_code}`}
            </span>
            <span>{order.purchase_units[0].shipping.address.postal_code}</span>
          </div>
          <div className="order-info-summary"></div>
        </div>
        <div className="order-bill"></div>
      </div>
    </div>
  );
};

export default FocusedOrder;
