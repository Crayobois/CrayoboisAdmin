import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import "./Switch.css"

const Switch = props => {
  const context = useContext(AuthContext);

  useEffect(() => {}, []);

  return (
    <React.Fragment>
      <label className="switch" htmlFor="checkbox">
        <input type="checkbox" id="checkbox" />
        <div className="slider round"></div>
      </label>
    </React.Fragment>
  );
};

export default Switch;
