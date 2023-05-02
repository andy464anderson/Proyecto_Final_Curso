import React from "react";
import "./carta_pelicula.css";
import { Link, useNavigate } from "react-router-dom";

const CartaPelicula = ({ pelicula }) => {
    
  const navigate = useNavigate()


    const detallePelicula = (e) => {
      console.log(e.target.value);
       navigate(`/detalle/${e.target.value}`);
    }
    
    
  return (
    <div className="carta-pelicula" value={pelicula.id} onClick={detallePelicula}>
      <img src={pelicula.poster} alt={pelicula.title} className="imagen-pelicula" />
      <div className="info-pelicula">
        <p className="titulo-pelicula"><strong>{pelicula.title}</strong></p>
        <p className="anno-pelicula">{pelicula.release_date}</p>
        <div className="boton-pelicula">
          <button value={pelicula.id} onClick={detallePelicula}>Ver más detalles</button>
        </div>
      </div>
    </div>
  );
};

export default CartaPelicula;
