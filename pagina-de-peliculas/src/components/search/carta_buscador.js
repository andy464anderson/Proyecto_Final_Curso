import React from "react";
import "./carta_buscador.css";
import { Link, useNavigate } from "react-router-dom";



const CartaBucador = ({ pelicula }) => {
    const navigate = useNavigate()


    const detallePelicula = (e) => {
        console.log(e.target.value);
       navigate(`/detalle/${e.target.value}`);
    }
    
    
  return (
    <div className="carta-pelicula-buscador">
      <div><img src={pelicula.poster} alt={pelicula.title} className="imagen-pelicula-buscador" /></div>
        <div className="info-pelicula-buscador">
            <p><strong className="titulo-carta-buscador">{pelicula.title}</strong><span className="year-carta-buscador">{pelicula.release_date.split("-")[0]}</span></p>
            <p className="sinopsis-carta-buscador">{pelicula.overview}</p>
            <div className="detalle-pelicula-buscador">
                <button className="boton-carta-buscador" value={pelicula.id} onClick={detallePelicula}>Ver más detalles</button>
            </div>
        </div>
    </div>
  );
};

export default CartaBucador;
