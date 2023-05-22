import React from "react";
import "./carta_pelicula.css";
import { Link, useNavigate } from "react-router-dom";

const CartaPelicula = ({ pelicula }) => {

  const navigate = useNavigate()


  const detallePelicula = (idPeli) => {
    navigate(`/detalle/${idPeli}`);
  }


  return (
    <div className="carta-pelicula" value={pelicula.id}>
      <img onClick={() => detallePelicula(pelicula.id)} src={pelicula.poster} alt={pelicula.title} className="imagen-pelicula" />
      <div className="info-pelicula">
        <p className="titulo-pelicula"><strong>{pelicula.title}</strong></p>
        <p className="anno-pelicula">{pelicula.release_date}</p>
        <div className="boton-pelicula">
          <button value={pelicula.id} onClick={() => detallePelicula(pelicula.id)}>Ver más detalles</button>
        </div>
      </div>
    </div>
  );
};

export default CartaPelicula;
