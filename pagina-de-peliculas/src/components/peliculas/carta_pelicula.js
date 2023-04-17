import React from "react";
import "./carta_pelicula.css";

const CartaPelicula = ({ pelicula }) => {



    const detallePelicula = (e) => {
        console.log(e.target.value);
        window.location.href = `/detalle/${e.target.value}`;
    }
    
    
  return (
    <div className="carta-pelicula">
    <img src={pelicula.poster} alt={pelicula.title} className="imagen-pelicula" />
    <div className="info-pelicula">
      <h2 className="titulo-pelicula">{pelicula.title}</h2>
      <p className="anno-pelicula">{pelicula.release_date}</p>
      <div className="detalle-pelicula">
        <button value={pelicula.id} onClick={detallePelicula}>Ver más detalles</button>
      </div>
    </div>
  </div>
  );
};

export default CartaPelicula;
