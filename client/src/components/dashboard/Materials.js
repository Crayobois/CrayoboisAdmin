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
    <div className="focused-order-container">

    </div>
  );
};

export default Materials;
