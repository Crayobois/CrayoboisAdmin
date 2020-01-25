import React, { useContext, useEffect, useState } from "react";
import "./Materials.css";
import AuthContext from "../context/AuthContext";
import Spinner from "../spinner/Spinner";
const uuidv4 = require("uuid/v4");

const Materials = props => {
  const context = useContext(AuthContext);
  const materials = context.materials[0];

  const priceFormatter = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });

  useEffect(() => {
    context.getMaterials();
  }, []);

  return (
    <section className="shop-section">
      <div className="shop-top">
        <form id="search-item">
          <input
            type="text"
            name="search"
            className="search-input"
            autoComplete="off"
            placeholder="Rechercher par #"
            required
          />
          <button className="filter-btn">
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>
      <div className="shop-content">
        {!materials ? (
          <React.Fragment />
        ) : (
          <React.Fragment>
            {materials.map(material => {
              return (
                <div key={uuidv4()} className="thumbnail">
                  <img src={material.path} className="thumbnail-image" />
                  <div className="thumbnail-info-container">
                    <span className="thumbnail-text">{material.name}<i className="fas fa-tree thumbnail-icon"></i></span>
                    <span className="thumbnail-text tag">#{material.tag}</span>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        )}
      </div>
    </section>
  );
};

export default Materials;
