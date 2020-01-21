import React, { useContext, useState, useEffect } from "react";
import Context from "../context/AuthContext";

const Orders = props => {
  const context = useContext(Context);
  const [orders, setOrders] = context.orders;

  useEffect(() => {
    context.getOrders();
  }, []);

  return (
    <React.Fragment>
    </React.Fragment>
  );
};

export default Orders;
