import React, { useContext, useEffect, useState } from "react";
import "./FocusedOrder.css";
import AuthContext from "../context/AuthContext";

const FocusedOrder = props => {


  return (
    <div className="focused-order-container">
      <span className="focused-order-back" onClick={() => {
        props.removeFocus();
      }}><i className="fas fa-chevron-left focused-order-back-icon"></i>Précédent</span>
      <div className="focused-order">

      </div>
    </div>
  );
};

export default FocusedOrder;
