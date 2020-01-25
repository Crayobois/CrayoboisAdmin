import React, { useContext, useEffect, useState } from "react";
import "./FocusedMaterial.css";
import AuthContext from "../context/AuthContext";
import Spinner from "../spinner/Spinner";
const uuidv4 = require("uuid/v4");

const FocusedMaterial = props => {
  const context = useContext(AuthContext);
  const material = props.material;
  const [editing, setEditing] = useState(false);

  const priceFormatter = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });

  useEffect(() => {}, []);

  return (
    <React.Fragment>
      <div className="shop-top">
        <span
          className="focused-back"
          onClick={() => {
            props.resetFocus();
          }}
        >
          <i className="fas fa-chevron-left focused-back-icon"></i>
          Précédent
        </span>
      </div>
      <div className="focused-shop-container">
        <div className="focused-shop-infos-container">
          <div className="focused-shop-left">
            <img src={material.path} className="focused-shop-img" />
            <span className="tag">#{material.tag}</span>
          </div>
          <div className="focused-shop-right">
            <div className="focused-shop-infos">
              <form id="change-material" className="change-material">
                <div className="focused-shop-form-field">
                  <span className="focused-shop-info-name">Nom</span>
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
                <div className="focused-shop-form-field">
                  <span className="focused-shop-info-name">Type</span>
                  <input
                    type="text"
                    name="material-origin"
                    className="focused-input"
                    id="material-origin"
                    autoComplete="off"
                    placeholder={material.type}
                    readOnly
                    required
                  />
                </div>
                <div className="focused-shop-form-field">
                  <span className="focused-shop-info-name">Prix</span>
                  <input
                    type="text"
                    name="material-origin"
                    className="focused-input"
                    id="material-origin"
                    autoComplete="off"
                    placeholder={priceFormatter.format(material.price)}
                    readOnly
                    required
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FocusedMaterial;
