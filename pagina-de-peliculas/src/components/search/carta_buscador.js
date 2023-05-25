import React from "react";
import "./carta_buscador.css";
import { Link, useNavigate } from "react-router-dom";
import BotonLike from "../botonLike/botonLike";



const CartaBucador = ({ pelicula }) => {
  const navigate = useNavigate();


  const detallePelicula = (idPeli) => {
    navigate(`/detalle/${idPeli}`);
  }


  return (
    <div className="carta-pelicula-buscador">
      <div><img onClick={() => detallePelicula(pelicula.id)} src={pelicula.poster} alt={pelicula.title} className="imagen-pelicula-buscador" /></div>
      <div className="info-pelicula-buscador">
        <p onClick={() => detallePelicula(pelicula.id)}><strong className="titulo-carta-buscador">{pelicula.title}</strong><span className="year-carta-buscador">{pelicula.release_date.split("-")[0]}</span></p>
        <p className="sinopsis-carta-buscador">{pelicula.overview}</p>
        <div className="detalle-pelicula-buscador">
          <button className="boton-carta-buscador" value={pelicula.id} onClick={() => detallePelicula(pelicula.id)}>Ver más detalles</button>
          <BotonLike idPeli={pelicula.id} />
        </div>
      </div>
    </div>
  );
};

export default CartaBucador;
