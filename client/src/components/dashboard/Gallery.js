import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

const Gallery = props => {
    const context = useContext(AuthContext);
    function uploadFile(id) {
        const input = document.getElementById(id);
        const file = input.files[0];
        context.uploadFile(file);
    }


    return(
        <React.Fragment>
            <section className="shop-section">
                <input type="file" id="file-input" onChange={() => (uploadFile("file-input"))} accept="image/png, image/jpeg"></input>  
            </section>
        </React.Fragment>
    );
}

export default Gallery;