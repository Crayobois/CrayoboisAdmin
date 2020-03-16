import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Gallery.css"
import NewImage from "./NewImage";
import Spinner from "../spinner/Spinner";

const Gallery = props => {
    const context = useContext(AuthContext);
    const gallery = context.gallery;
    const [newImage, setNewImage] = useState(false);

    function deleteHandler(ref, id) {
        const r = window.confirm("Voulez-vous vraiment supprimer cette image?");
        if (r === true) {
          context.deleteImage(ref, id);
        }
    };

    function removeFocus() {
        setNewImage(false);
    }

    useEffect(() => {
        if (gallery.length === 0) {
            context.getGallery();
        }
    }, []);

    return(
        <React.Fragment>
            <section className="shop-section">
                {newImage ? <NewImage removeFocus={() => removeFocus()} /> : <React.Fragment />}
                <div className="shop-top">
                  <span
                    className="filter-btn wide add-item"
                    onClick={() => {
                      setNewImage(true);
                    }}
                  >
                    Ajouter une image
                    <i className="fas fa-plus filter-btn-icon"></i>
                  </span>
                </div>
                <section className="gallery-section">
                {gallery.length === 0 ? <Spinner /> : (
                    gallery.map((img, index) => {
                    return(
                        <div className="image-container" key={index}>
                            <img
                                src={img.url}
                                id={img._id}
                                className="gallery-image"
                            />
                            <span className="image-description">
                                {img.description}
                            </span>
                            <span className="delete-image" onClick={() => {deleteHandler(img.ref, img._id)}}>
                            <i className="fas fa-times delete-image-icon"></i>
                            </span>
                        </div>
                    )
                    })
                )}
                </section>
            </section>
        </React.Fragment>
    );
}

export default Gallery;