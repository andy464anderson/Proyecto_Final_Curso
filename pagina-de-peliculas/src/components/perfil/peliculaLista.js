import React from "react";
import "./perfil.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Pelicula({ id }) {
    const [pelicula, setPelicula] = useState(null);
  
    useEffect(() => {
        const obtenerPelicula = async () => {
            const response = await fetch(`http://localhost:8000/peliculas/${id}`);
            const pelicula = await response.json();
            setPelicula(pelicula);
        };
  
        obtenerPelicula();
    }, [id]);
    
    if(!pelicula){
        return <div>Cargando...</div>
    }else{
        return(
            <div className="divPeli" id={pelicula[0].id}>
                <p><strong>{pelicula[0].title}</strong></p>
                <p>{pelicula[0].release_date}</p>
            </div>
        );
    }    
}

export default Pelicula;
