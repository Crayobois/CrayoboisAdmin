import React from "react";
import "./Spinner.css";

const Spinner = () => {
  return (
    <React.Fragment>
      <div className="spinner-container">
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Spinner;
