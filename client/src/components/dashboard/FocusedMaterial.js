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

  const deleteHandler = mat => {
    const r = window.confirm("Voulez-vous vraiment supprimer cet item?");
    if (r === true) {
      if (props.token) {
        context.deleteHaw(mat);
        props.resetFocus();
      } else {
        context.deleteItem(mat);
        props.resetFocus();
      }
    } else {
      return null;
    }
  };

  const editHandler = () => {
    if (editing === true) {
      if (props.token) {
      } else {
        let name = document.getElementById("material-name").value;
        let origin = document.getElementById("material-origin").value;
        let type = document.getElementById("material-type").value;
        let price = document
          .getElementById("material-price")
          .value.replace(",", ".");

        if (name === "") {
          name = material.name;
        }
        if (origin === "") {
          origin = material.origin;
        }
        if (type === "") {
          type = material.type;
        }
        if (price === "") {
          price = material.price;
        }

        if (
          name === material.name &&
          origin === material.origin &&
          price === material.price &&
          type === material.type
        ) {
          setEditing(false);
        } else if (!isNaN(price) && parseFloat(price) > 0) {
          context.editMaterial(
            name,
            origin,
            type,
            parseFloat(price),
            material._id
          );
          material.name = name;
          material.origin = origin;
          material.type = type;
          material.price = price;
          setEditing(false);
        } else {
          alert("Entrez un prix valide (par exemple: '16.75').");
        }
      }
    } else {
      setEditing(true);
    }
  };

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
              editHandler();
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
          <span className="delete-btn" onClick={() => deleteHandler(material)}>
            <i class="fas fa-trash-alt"></i>
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
                {props.token ? (
                  <React.Fragment>
                    <div className="focused-shop-form-field">
                      <span className="focused-shop-info-name">Type</span>
                      {editing ? (
                        <input
                          type="text"
                          name="material-type"
                          className="focused-input"
                          id="material-type"
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
                      <span className="focused-shop-info-name">Couleur</span>
                      {editing ? (
                        <input
                          type="text"
                          name="material-color"
                          className="focused-input"
                          id="material-color"
                          autoComplete="off"
                          placeholder={material.color}
                          required
                        />
                      ) : (
                        <span className="focused-shop-info-text">
                          {material.color}
                        </span>
                      )}
                    </div>
                    <div className="focused-shop-form-field">
                      <span className="focused-shop-info-name">Prix</span>
                      {editing ? (
                        <input
                          type="text"
                          name="material-price"
                          className="focused-input"
                          id="material-price"
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
                  </React.Fragment>
                ) : (
                  <React.Fragment>
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
                          name="material-type"
                          className="focused-input"
                          id="material-type"
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
                          name="material-price"
                          className="focused-input"
                          id="material-price"
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
                  </React.Fragment>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FocusedMaterial;
