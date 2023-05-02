import React from "react";
import { useContext } from "react";
import "./perfil.css";
import { HeaderContext } from "../header/headerContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Perfil() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const user = window.location.pathname.split("/")[2];

    useEffect(() => {
        const obtenerUsuario = async () => {
          const data = await fetch(`http://localhost:8000/perfil/${user}`, {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          });
          var usuario = await data.json();
          setUsuario(usuario);
        };
        obtenerUsuario();
    }, [user]);
    
    if (!usuario) {
        return <div>Cargando...</div>;
    }
    return (
        <div className="perfil-container">
        <div className="perfil-header">
            <div className="perfil-avatar">
                <img width={200} height={200} src="sinFoto.png" alt={usuario.nombre_usuario} /> 
            </div>
            <div className="perfil-userinfo">
                <h1>{usuario.nombre_completo}</h1>
                <p>{usuario.correo}</p>
                <p>{usuario.rol}</p>
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
