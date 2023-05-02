import React from "react";
import { useContext } from "react";
import "./perfil.css";
import { HeaderContext } from "../header/headerContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Perfil() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [listas, setListas] = useState([]);
    const nombre_usuario = window.location.pathname.split("/")[2];

    useEffect(() => {
        const obtenerDatosUsuario = async () => {
            const responseUsuario = await fetch(`http://localhost:8000/perfil/${nombre_usuario}`, {
                method: "GET",
                headers: {
                accept: "application/json",
                },
            });
            var dataUsuario = await responseUsuario.json();
            setUsuario(dataUsuario);

            // obtener las reseñas del usuario
            const responseReviews = await fetch(`http://localhost:8000/review/usuario/${dataUsuario.id}`);
            const dataReviews = await responseReviews.json();
            setReviews(dataReviews);

            // obtener las listas del usuario
            const responseListas = await fetch(`http://localhost:8000/lista/${dataUsuario.id}`);
            const dataListas = await responseListas.json();
            setListas(dataListas);
        };
        obtenerDatosUsuario();
    }, [nombre_usuario]);

    console.log(reviews);
    console.log(listas);
    
    if (!usuario || !reviews || !listas) {
        return <div>Cargando...</div>;
    }else{    
        return (
            <div className="perfil-container">
            <div className="perfil-header">
                <div className="perfil-avatar">
                    <img width={200} height={200} src="sinFoto.png" alt={usuario.nombre_usuario} /> 
                </div>
                <div className="perfil-nombre_usuarioinfo">
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
}

export default Perfil;
