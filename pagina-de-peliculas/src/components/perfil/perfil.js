import React from "react";
import "./perfil.css";
import { useNavigate } from "react-router-dom";
import Pelicula from "./peliculaLista";
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
            const responseReviews = await fetch(`http://localhost:8000/reviews/usuario/${dataUsuario.id}`);
            const dataReviews = await responseReviews.json();
            setReviews(dataReviews);

            // obtener las listas del usuario
            const responseListas = await fetch(`http://localhost:8000/listas/${dataUsuario.id}`);
            const dataListas = await responseListas.json();
            setListas(dataListas);
        };
        obtenerDatosUsuario();
    }, [nombre_usuario]);
    
    const pintarReviews = () => {
        return (
          <div>
            <h2>Reseñas:</h2>
            {reviews.map((review) => (
              <div className="perfil-review" key={review.id}>
                <h3>{review.id_pelicula}</h3>
                <p>{review.fecha}</p>
                <p>{review.contenido}</p>
                <p className="perfil-review-rating">{review.valoracion}/10</p>
              </div>
            ))}
          </div>
        );
    };
    
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
                    <div className="todas_listas">
                        <h2>Listas:</h2>
                        <div className="lista">
                            {listas.map((lista) => (
                            <li key={lista.id}>
                                <div><strong>{lista.nombre_lista}</strong></div> 
                                <ul>{lista.fecha}</ul>
                                <ul>{lista.tipo}</ul>
                                {lista.peliculas.map(idPeli => {
                                    return <Pelicula key={idPeli} id={idPeli} />
                                })}
                            </li>
                            ))}
                        </div>
                    </div>
                    {pintarReviews()}
                </div>
            </div>
        );
    }
}

export default Perfil;