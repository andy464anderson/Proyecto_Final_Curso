import React from "react";
import { useContext } from "react";
import { HeaderContext } from "../header/headerContext";
import "./perfil.css";

function Perfil() {
    const {userData} = useContext(HeaderContext);
    const user = userData;

  if (!user.clave) {
    return <div>No se encontró el usuario</div>;
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="perfil-avatar">
          <img width={200} height={200} src="/sinFoto.png" alt={user.nombre} />
        </div>
        <div className="perfil-userinfo">
          <h1>{user.nombre}</h1>
          <p>{user.correo}</p>
          <p>{user.rol}</p>
        </div>
      </div>
      <div className="perfil-body">
        <h2>Películas favoritas:</h2>
        <ul>
            <li key={1}>The Godfather</li>
        </ul>
        <h2>Reseñas:</h2>
            <div className="perfil-review" key={1}>
                <h3>The Godfather</h3>
                <p>Peliculón</p>
                <p className="perfil-review-rating">9,75/10</p>
            </div>
      </div>
    </div>
  );
}

export default Perfil;
