import React, { useContext, useEffect, useState } from "react";
import "./FocusedMaterial.css";
import AuthContext from "../context/AuthContext";
import Spinner from "../spinner/Spinner";
const uuidv4 = require("uuid/v4");

const FocusedMaterial = props => {
  const context = useContext(AuthContext);
  const material = props.material;

  const priceFormatter = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });

  useEffect(() => {}, []);

  return (
    <div className="focused-shop-container">
      <div className="focused-shop-infos-container">
        <img src={material.path} className="focused-shop-img" />
        <div className="focused-shop-infos">
          <form id="change-material" className="change-material">
            <div className="focused-shop-form-field">
              <span className="focused-shop-info-name">Nom du matériau</span>
              <input
                type="text"
                name="material-name"
                className="focused-input"
                id="material-name"
                autoComplete="off"
                placeholder={material.name}
                readOnly
                required
              />
            </div>
            <div className="focused-shop-form-field">
              <span className="focused-shop-info-name">Origine</span>
              <input
                type="text"
                name="material-origin"
                className="focused-input"
                id="material-origin"
                autoComplete="off"
                placeholder={material.origin}
                readOnly
                required
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FocusedMaterial;
