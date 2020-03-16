import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Compressor from 'compressorjs';
import "./NewImage.css";

const NewImage = props => {
    const context = useContext(AuthContext);
    const [desc, setDesc] = useState("");
    const [previewImg, setPreviewImg] = useState(null);

    function uploadFile(id) {
        if (previewImg) {
            const input = document.getElementById(id);
            const desc = document.getElementById("new-image-desc").value;
            let file = input.files[0];
            if (file && desc) {
                new Compressor(file, {
                    quality: 0.7,
                    success(result) {
                        context.uploadFile(result, desc);
                        props.removeFocus();
                    },
                    error(err) {
                        alert("Une erreur s'est produite.");
                    },
                });
            } else {
                alert("Veuillez remplir tous les champs.")
            }
        }
    }

    function preview(id) {
        const input = document.getElementById(id);
        let file = input.files[0];
        if (file) {
            let fr = new FileReader();
            fr.onload = function () {
                document.getElementById("preview-img").src = fr.result;
            }
            fr.readAsDataURL(file);
            setPreviewImg(file);
        } 
    }
 
    return(
        <React.Fragment>
          <div className="new-item-container">
            <div className="new-item-top">
              <span className="exit-btn" onClick={() => {props.removeFocus()}}>
                <i className="fas fa-times"></i>
              </span>
            </div>
            <div className="new-image-preview-top">
                <span className="img-preview-header">
                    Nouvelle image
                </span>
                <label htmlFor="file-input" className="filter-btn add-item-btn upload-img">
                    <input 
                        type="file" 
                        id="file-input" 
                        onChange={() => {preview("file-input")}} 
                        accept="image/png, image/jpeg">
                    </input> 
                    Charger
                </label>
            </div>
            <div className="new-image-content">
                {previewImg ? (
                    <React.Fragment>
                        <div className="image-container preview-image">
                            <img
                                src={""}
                                className="gallery-image"
                                id="preview-img"
                            />
                            <span className="image-description">
                                {desc}
                            </span>
                        </div>
                        <input
                            type="text"
                            name="name"
                            className="new-item-input large-input"
                            id="new-image-desc"
                            autoComplete="off"
                            onChange={() => {
                                const description = document.getElementById("new-image-desc").value;
                                setDesc(description);
                            }}
                            placeholder="Description de l'image"
                            required
                        />
                    </React.Fragment>
                ) : (
                    <div className="image-container preview-image preview-waiting">
                        <i className="fas fa-file-image gray"></i>
                    </div>
                )}
                <span
                className="filter-btn add-item-btn"
                onClick={() => {uploadFile("file-input")}}
                >
                Ajouter<i className="fas fa-plus filter-btn-icon"></i>
                </span>
                </div>
            </div>
          <div className="overlay"></div>
        </React.Fragment>
    );
}

export default NewImage;