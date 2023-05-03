import React from "react";
import "./perfil.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Pelicula({ id, val }) {
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
        return <div></div>
    }else{
        if(val == "lista"){
            return(
                <div className="divPeliLista" id={pelicula[0].id}>
                    <p><strong>{pelicula[0].title}</strong></p>
                    <p>{pelicula[0].release_date}</p>
                </div>
            );
        }else{
            return(
                <strong>{pelicula[0].title}</strong>
            );
        }
        
    }    
}

export default Pelicula;
