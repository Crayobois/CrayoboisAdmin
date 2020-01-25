import React, { useContext, useEffect, useState } from "react";
import "./Materials.css";
import AuthContext from "../context/AuthContext";
import Spinner from "../spinner/Spinner";
const uuidv4 = require("uuid/v4");

const Materials = props => {
  const context = useContext(AuthContext);

  const priceFormatter = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });

  useEffect(() => {}, []);

  return (
    <section className="shop-section">
      <div className="shop-top">
        <form id="search-item">
          <input
            type="text"
            name="search"
            className="search-input"
            autoComplete="off"
            placeholder="Recherche par #"
            required
          />
          <button className="filter-btn"><i className="fas fa-search"></i></button>
        </form>
      </div>
    </section>
  );
};

export default Materials;
