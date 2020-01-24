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
            <span className="focused-order-sub-header">Commande</span>
            <div className="focused-order-items">
              {order.purchase_units[0].items.map(item => {
                return (
                  <div className="focused-order-item-info">
                    <div className="focused-order-item-name">
                      <span className="order-text">{item.name}</span>
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
            </div>
          </div>
          <div className="order-bill-breakdown">
            <span className="focused-order-sub-header">Facture</span>
            <div className="bill-breakdown">
              <i className="fas fa-clipboard-list order-icon"></i>
              <div className="bill-breakdown-amounts">
                <span className="order-text">
                  Sous-total:{" "}
                  {priceFormatter.format(
                    order.purchase_units[0].amount.breakdown.item_total.value
                  )}
                </span>
                <span className="order-text">
                  Taxes:{" "}
                  {priceFormatter.format(
                    order.purchase_units[0].amount.breakdown.tax_total.value
                  )}
                </span>
                <span className="order-text">
                  Livraison:{" "}
                  {priceFormatter.format(
                    order.purchase_units[0].amount.breakdown.shipping.value
                  )}
                </span>
                <span className="order-text">
                  Total:{" "}
                  {priceFormatter.format(order.purchase_units[0].amount.value)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusedOrder;
