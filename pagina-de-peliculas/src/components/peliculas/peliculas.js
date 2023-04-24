import React,{useContext} from "react";
import './peliculas.css';
import { useEffect, useState } from "react";
import CartaPelicula from "./carta_pelicula";
import { HeaderContext } from "../header/headerContext";

const Peliculas = () => {

    const {updateMovieData} = useContext(HeaderContext)
    // creamos el estado de peliculas
    const [peliculas, setPeliculas] = useState([]);
    const estado = "Loading..."
    // hacemos fetch a la api de peliculas
    useEffect(() => {
        const obtenerPeliculas = async () => {
            const data = await fetch('http://localhost:8000/peliculas', {
                method: 'GET',
                headers: {
                  'accept': 'application/json'
                }
              })
            var peliculas = await data.json();
            peliculas = peliculas.sort((a, b) => a.id - b.id);
            setPeliculas(peliculas);
            updateMovieData(peliculas)
            console.log(peliculas);
          };
          obtenerPeliculas();

    }, []);

    return (
      <div className="container-peliculas">

<div className="filters peliculas">
      <select name="category">
        <option value="">Filtrar por categoría</option>
        <option value="accion">Acción</option>
        <option value="aventura">Aventura</option>
        <option value="drama">Drama</option>
        <option value="comedia">Comedia</option>
      </select>
      <select name="year">
        <option value="">Filtrar por año de lanzamiento</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
        <option value="2019">2019</option>
      </select>
      <select name="duration">
        <option value="">Filtrar por duración</option>
        <option value="90">Menos de 90 minutos</option>
        <option value="90-120">Entre 90 y 120 minutos</option>
        <option value="120">Más de 120 minutos</option>
      </select>
      <select name="sort">
        <option value="">Ordenar por título</option>
        <option value="asc">Ascendente</option>
        <option value="desc">Descendente</option>
      </select>
    </div>

        <div className="peliculas">
        {peliculas.map((pelicula) => (
          <React.Fragment key={pelicula.id}>
            {pelicula.poster && /^http/.test(pelicula.poster) && (
              <CartaPelicula pelicula={pelicula} />
            )}
          </React.Fragment>
        ))}
        {
          Peliculas.length == 0 && estado
        }
      </div>
      </div>
      
    );

}

export default Peliculas;