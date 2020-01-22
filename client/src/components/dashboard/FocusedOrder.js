import React, { useContext, useEffect, useState } from "react";
import "./FocusedOrder.css";
import AuthContext from "../context/AuthContext";

const FocusedOrder = props => {


  return (
    <div className="focused-order-container">
      <span>{props.order.create_time}</span>
    </div>
  );
};

export default FocusedOrder;
