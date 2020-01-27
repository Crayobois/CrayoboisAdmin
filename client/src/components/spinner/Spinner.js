import React from "react";
import "./Spinner.css";

const Spinner = (props) => {
  return (
    <React.Fragment>
      <div className={props.addStyle ? "spinner-container spinner-in-parent" : "spinner-container"}>
        <div className={props.addStyle ? "spinner in-parent" : "spinner"}>
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Spinner;
