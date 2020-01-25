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
      <div className="shop-top multiple-elems">
        <span
          className="focused-back"
          onClick={() => {
            props.resetFocus();
          }}
        >
          <i className="fas fa-chevron-left focused-back-icon"></i>
          Précédent
        </span>
        <div className="shop-top-right-buttons">
          <span
            className="filter-btn"
            onClick={() => {
              setEditing(!editing);
            }}
          >
            {editing ? "Sauvegarder" : "Modifier"}
            <i
              className={
                editing
                  ? "fas fa-save filter-btn-icon"
                  : "fas fa-edit filter-btn-icon"
              }
            ></i>
          </span>
        </div>
      </div>
      <div className="focused-shop-container">
        <div className="focused-shop-infos-container">
          <div className="focused-shop-left">
            <img src={material.path} className="focused-shop-img" />
          </div>
          <div className="focused-shop-right">
            <div className="focused-shop-infos">
              <form id="change-material" className="change-material">
                <div className="focused-shop-form-field">
                  <span className="focused-shop-info-name">Nom</span>
                  {editing ? (
                    <input
                      type="text"
                      name="material-name"
                      className="focused-input"
                      id="material-name"
                      autoComplete="off"
                      placeholder={material.name}
                      required
                    />
                  ) : (
                    <span className="focused-shop-info-text">
                      {material.name}
                    </span>
                  )}
                </div>
                <div className="focused-shop-form-field">
                  <span className="focused-shop-info-name">Origine</span>
                  {editing ? (
                    <input
                      type="text"
                      name="material-origin"
                      className="focused-input"
                      id="material-origin"
                      autoComplete="off"
                      placeholder={material.origin}
                      required
                    />
                  ) : (
                    <span className="focused-shop-info-text">
                      {material.origin}
                    </span>
                  )}
                </div>
                <div className="focused-shop-form-field">
                  <span className="focused-shop-info-name">Type</span>
                  {editing ? (
                    <input
                      type="text"
                      name="material-origin"
                      className="focused-input"
                      id="material-origin"
                      autoComplete="off"
                      placeholder={material.type}
                      required
                    />
                  ) : (
                    <span className="focused-shop-info-text">
                      {material.type}
                    </span>
                  )}
                </div>
                <div className="focused-shop-form-field">
                  <span className="focused-shop-info-name">Prix</span>
                  {editing ? (
                    <input
                      type="text"
                      name="material-origin"
                      className="focused-input"
                      id="material-origin"
                      autoComplete="off"
                      placeholder={material.price}
                      required
                    />
                  ) : (
                    <span className="focused-shop-info-text">
                      {priceFormatter.format(material.price)}
                    </span>
                  )}
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
