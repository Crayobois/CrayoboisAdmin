import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import "./Switch.css";

const Switch = props => {

  const checkbox = () => {
    const value = document.querySelector('#checkbox').checked;
    props.changeCurrentSet(value);
  }

  useEffect(() => {
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
