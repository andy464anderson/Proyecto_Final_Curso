import React from "react";
import { useContext } from "react";
<<<<<<< HEAD
import { HeaderContext } from "../header/headerContext";
import "./perfil.css";
=======
import "./perfil.css";
import { HeaderContext } from "../header/headerContext";
import { useNavigate } from "react-router-dom";
>>>>>>> search

function Perfil() {
    const {userData} = useContext(HeaderContext);
    const user = userData;
<<<<<<< HEAD

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
=======
    const navigate = useNavigate();

    if (!user.clave) {
        navigate("/peliculas");
    }

    return (
        <div className="perfil-container">
        <div className="perfil-header">
            <div className="perfil-avatar">
                <img width={200} height={200} src="sinFoto.png" alt={user.nombre} />
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
                <li key={2}>Titanic</li>
                <li key={3}>Toy Story</li>
                <li key={4}>Star Wars</li>
            </ul>
            <h2>Reseñas:</h2>
>>>>>>> search
            <div className="perfil-review" key={1}>
                <h3>The Godfather</h3>
                <p>Peliculón</p>
                <p className="perfil-review-rating">9,75/10</p>
            </div>
<<<<<<< HEAD
      </div>
    </div>
  );
=======
        </div>
        </div>
    );
>>>>>>> search
}

export default Perfil;
