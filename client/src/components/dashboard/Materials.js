import React, { useContext, useEffect, useState } from "react";
import "./Materials.css";
import AuthContext from "../context/AuthContext";
import Spinner from "../spinner/Spinner";
import FocusedMaterial from "./FocusedMaterial";
const uuidv4 = require("uuid/v4");

const Materials = props => {
  const context = useContext(AuthContext);
  const materials = context.materials[0];
  const [focusedMaterial, setFocusedMaterial] = useState(null);
  const [newMat, setNewMat] = useState(false);
  const [itemImg, setItemImg] = useState(null);

  const priceFormatter = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });

  const addNewItem = () => {
    let path = document.getElementById("new-item-path").value;
    let name = document.getElementById("new-item-name").value;
    let origin = document.getElementById("new-item-origin").value;
    let type = document.getElementById("new-item-type").value;
    let price = document
      .getElementById("new-item-price")
      .value.replace(",", ".");

    if (
      path === "" ||
      name === "" ||
      origin === "" ||
      type === "" ||
      price === ""
    ) {
      alert("Veuillez remplir tous les champs.");
    } else if (!isNaN(price) && parseFloat(price) > 0) {
      let obj = {
        _id: uuidv4(),
        path: path,
        name: name,
        origin: origin,
        type: type,
        price: parseFloat(price),
        nature: "bois"
      };
      context.addNewItem(obj);
      setNewMat(false);
      setItemImg(null);
    } else {
      alert("Entrez un prix valide (par exemple: '16.75').");
    }
  };

  useEffect(() => {
    if (!materials) {
      context.getMaterials();
    }

    if (newMat) {
      const pathInput = document.getElementById("new-item-path");
      pathInput.addEventListener("input", () => {
        if (pathInput.value === "") {
          setItemImg(null);
        } else {
          setItemImg(pathInput.value);
        }
      });
    }
  }, [newMat]);

  return (
    <React.Fragment>
      {newMat ? (
        <React.Fragment>
          <div className="new-item-container">
            <div className="new-item-top">
              <span className="exit-btn" onClick={() => setNewMat(false)}>
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
                Nom
              </label>
              <input
                type="text"
                name="name"
                className="new-item-input"
                id="new-item-name"
                autoComplete="off"
                placeholder="Nom du matériau"
                required
              />
              <label htmlFor="name" className="new-item-label">
                Origine
              </label>
              <input
                type="text"
                name="origin"
                className="new-item-input"
                id="new-item-origin"
                autoComplete="off"
                placeholder="Origine du matériau"
                required
              />
              <label htmlFor="name" className="new-item-label">
                Type
              </label>
              <input
                type="text"
                name="type"
                className="new-item-input"
                id="new-item-type"
                autoComplete="off"
                placeholder="Type du matériau"
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
                placeholder="Prix du matériau"
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
      <section className={materials ? "shop-section" : "shop-section section-loading"}>
        {materials ? (
          <React.Fragment>
            {focusedMaterial ? (
              <FocusedMaterial
                resetFocus={() => {
                  setFocusedMaterial(null);
                }}
                material={focusedMaterial}
              />
            ) : (
              <React.Fragment>
                <div className="shop-top multiple-elems">
                  <form id="search-item">
                    <input
                      type="text"
                      name="search"
                      className="search-input"
                      autoComplete="off"
                      placeholder="Chercher un matériau"
                      required
                    />
                    <button className="filter-btn search-btn">
                      <i className="fas fa-search"></i>
                    </button>
                  </form>
                  <span
                    className="filter-btn"
                    onClick={() => {
                      setNewMat(true);
                    }}
                  >
                    Ajouter un matériau
                    <i className="fas fa-plus filter-btn-icon"></i>
                  </span>
                </div>
                <div className="shop-content">
                  {!materials ? (
                    <React.Fragment />
                  ) : (
                    <React.Fragment>
                      {materials.map(material => {
                        return (
                          <div
                            key={uuidv4()}
                            className="thumbnail"
                            onClick={() => {
                              setFocusedMaterial(material);
                            }}
                          >
                            <img
                              src={material.path}
                              className="thumbnail-image"
                            />
                            <div className="thumbnail-info-container">
                              <span className="thumbnail-text">
                                {material.name}
                              </span>
                              <span className="thumbnail-text tag">
                                #{material.tag}
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

export default Materials;
