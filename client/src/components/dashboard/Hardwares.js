import React, { useContext, useEffect, useState } from "react";
import "./Materials.css";
import AuthContext from "../context/AuthContext";
import Spinner from "../spinner/Spinner";
import FocusedMaterial from "./FocusedMaterial";
const uuidv4 = require("uuid/v4");

const Hardwares = props => {
  const context = useContext(AuthContext);
  const hardwares = context.hardwares[0];
  const [focusedHardware, setFocusedHardware] = useState(null);
  const [newHaw, setNewHaw] = useState(false);
  const [itemImg, setItemImg] = useState(null);
  const [sortedHaws, setSortedHaws] = context.sortedHaws;
  const [displayedHaws, setDisplayedHaws] = context.displayedHaws;
  const [type, setType] = useState(null);

  const priceFormatter = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });

  const changeDisplayedHaws = select => {
    const elem = document.getElementById(select);
    const value = elem.options[elem.selectedIndex].value;
    if (value === "*") {
      let temp = [];
      for (let [key, value] of Object.entries(hardwares)) {
        value.forEach(element => {
          temp.push(element);
        });
      }
      setType(value);
      setDisplayedHaws(temp);
    } else {
      setType(value);
      setDisplayedHaws(hardwares[value]);
    }
  };

  const addNewItem = () => {
    let path = document.getElementById("new-item-path").value;
    let type = document.getElementById("new-item-type").value;
    let color = document.getElementById("new-item-color").value;
    let price = document
      .getElementById("new-item-price")
      .value.replace(",", ".");

    if (path === "" || color === "" || type === "" || price === "") {
      alert("Veuillez remplir tous les champs.");
    } else if (!isNaN(price) && parseFloat(price) > 0) {
      let obj = {
        _id: uuidv4(),
        path: path,
        color: color,
        type: type,
        price: parseFloat(price)
      };
      context.addNewHaw(obj);
      setNewHaw(false);
      setItemImg(null);
    } else {
      alert("Entrez un prix valide (par exemple: '16.75').");
    }
  };

  useEffect(() => {
    if (!hardwares) {
      context.getHardwares();
    }

    if (type && !focusedHardware) {
      const elem = document.getElementById("haws-type");
      elem.value = type;
    }

    if (newHaw) {
      const pathInput = document.getElementById("new-item-path");
      pathInput.addEventListener("input", () => {
        if (pathInput.value === "") {
          setItemImg(null);
        } else {
          setItemImg(pathInput.value);
        }
      });
    }
  }, [newHaw, focusedHardware]);

  return (
    <React.Fragment>
      {newHaw ? (
        <React.Fragment>
          <div className="new-item-container">
            <div className="new-item-top">
              <span className="exit-btn" onClick={() => setNewHaw(false)}>
                <i className="fas fa-times"></i>
              </span>
            </div>
            <div className="new-item">
              <div className="new-item-image">
                {itemImg ? (
                  <img src={itemImg} className="new-item-img" />
                ) : (
                  <React.Fragment>
                    <span className="file-img">
                      <i className="fas fa-file-image"></i>
                    </span>
                  </React.Fragment>
                )}
              </div>
              <div className="path">
                <input
                  type="text"
                  name="path"
                  className="new-item-input path-input"
                  id="new-item-path"
                  autoComplete="off"
                  placeholder="Lien vers l'image"
                  required
                />
              </div>
              <label htmlFor="name" className="new-item-label">
                Type
              </label>
              <input
                type="text"
                name="origin"
                className="new-item-input"
                id="new-item-type"
                autoComplete="off"
                placeholder="Type du matériel"
                required
              />
              <label htmlFor="name" className="new-item-label">
                Couleur
              </label>
              <input
                type="text"
                name="type"
                className="new-item-input"
                id="new-item-color"
                autoComplete="off"
                placeholder="Couleur du matériel"
                required
              />
              <label htmlFor="name" className="new-item-label">
                Prix
              </label>
              <input
                type="text"
                name="price"
                className="new-item-input"
                id="new-item-price"
                autoComplete="off"
                placeholder="Prix du matériel"
                required
              />
            </div>
            <span
              className="filter-btn add-item-btn"
              onClick={() => addNewItem()}
            >
              Ajouter<i className="fas fa-plus filter-btn-icon"></i>
            </span>
          </div>
          <div className="overlay"></div>
        </React.Fragment>
      ) : (
        <React.Fragment />
      )}
      <section
        className={hardwares ? "shop-section" : "shop-section section-loading"}
      >
        {hardwares ? (
          <React.Fragment>
            {focusedHardware ? (
              <FocusedMaterial
                resetFocus={() => {
                  setFocusedHardware(null);
                }}
                token="hardware"
                material={focusedHardware}
              />
            ) : (
              <React.Fragment>
                <div className="shop-top">
                  <select
                    id="haws-type"
                    className="orders-select"
                    name="displayed-haws"
                    onChange={() => {
                      changeDisplayedHaws("haws-type");
                    }}
                  >
                    {sortedHaws ? (
                      <React.Fragment>
                        <option value="*">Tous les matériels</option>
                        {sortedHaws.map((type, index) => {
                          return (
                            <option key={index} value={type[0]}>
                              {type[0]}
                            </option>
                          );
                        })}
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}
                  </select>
                  <span
                    className="filter-btn"
                    onClick={() => {
                      setNewHaw(true);
                    }}
                  >
                    Ajouter un matériel
                    <i className="fas fa-plus filter-btn-icon"></i>
                  </span>
                </div>
                <div className="shop-content">
                  {!displayedHaws ? (
                    <React.Fragment />
                  ) : (
                    <React.Fragment>
                      {displayedHaws.map(hardware => {
                        return (
                          <div
                            key={uuidv4()}
                            className="thumbnail"
                            onClick={() => {
                              setFocusedHardware(hardware);
                            }}
                          >
                            <img
                              src={hardware.path}
                              className="thumbnail-image"
                            />
                            <div className="thumbnail-info-container">
                              <span className="thumbnail-text">
                                {hardware.type}
                              </span>
                              <span className="thumbnail-text tag">
                                {hardware.color}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  )}
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <Spinner addStyle={true} />
        )}
      </section>
    </React.Fragment>
  );
};

export default Hardwares;
