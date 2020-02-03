import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import "./Switch.css";

const Switch = props => {
  const context = useContext(AuthContext);
  const yearly = context.yearly[0];

  const checkbox = () => {
    const value = document.querySelector('#checkbox').checked;
    props.changeCurrentSet(value);
  }

  useEffect(() => {
    if (yearly) {
      document.querySelector('#checkbox').checked = true;
    }
  }, []);

  return (
    <React.Fragment>
      <label className="switch" htmlFor="checkbox">
        <input
          type="checkbox"
          id="checkbox"
          onClick={() => {checkbox()}}
        />
        <div className="slider round"></div>
      </label>
    </React.Fragment>
  );
};

export default Switch;
