import React,{useContext} from "react";
import './peliculas.css';
import { useEffect, useState } from "react";
import CartaPelicula from "./carta_pelicula";
import { HeaderContext } from "../header/headerContext";

const Peliculas = () => {
    const {movieData} = useContext(HeaderContext);
    const {updateMovieData} = useContext(HeaderContext);
    const [peliculasFiltradas, setPeliculasFiltradas] = useState([]);
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
            setPeliculasFiltradas(peliculas);
            updateMovieData(peliculas)
            console.log(peliculas);
          };
          obtenerPeliculas();

    }, []);

    const filtrar = () => {
      var categoriaSeleccionada=document.getElementById("category").value;
      var duracionSeleccionada=document.getElementById("duration").value;
      var opcionOrdenarSeleccionada=document.getElementById("sort").value;

      if(categoriaSeleccionada != "" && duracionSeleccionada != ""){
        var listaFiltrada = [];
        if(duracionSeleccionada == "90"){
          listaFiltrada = movieData.filter(pelicula => parseInt(pelicula.runtime) < 90 && pelicula.genres.includes(categoriaSeleccionada));
        }else if(duracionSeleccionada == "90-120"){
          listaFiltrada = movieData.filter(pelicula => parseInt(pelicula.runtime) >= 90 && parseInt(pelicula.runtime) <= 120 && pelicula.genres.includes(categoriaSeleccionada));
        }else{
          listaFiltrada = movieData.filter(pelicula => parseInt(pelicula.runtime) > 120 && pelicula.genres.includes(categoriaSeleccionada));
        }
        setPeliculasFiltradas(listaFiltrada);
      }else if(categoriaSeleccionada == "" && duracionSeleccionada != ""){
        filtrarPorDuracion(duracionSeleccionada);
      }else if(categoriaSeleccionada != "" && duracionSeleccionada == ""){
        filtrarPorCategoria(categoriaSeleccionada);
      }else{
        setPeliculasFiltradas(movieData);
      }

      if(opcionOrdenarSeleccionada != ""){
        ordenarPeliculas(opcionOrdenarSeleccionada);
      }
    }

    const filtrarPorCategoria = (categoria) => {
      const listaFiltrada = movieData.filter(pelicula => pelicula.genres.includes(categoria));
      setPeliculasFiltradas(listaFiltrada);
    }

    const filtrarPorDuracion = (duracion) => {
      var listaFiltrada = [];
      if(duracion == "90"){
        listaFiltrada = movieData.filter(pelicula => parseInt(pelicula.runtime) < 90);
      }else if(duracion == "90-120"){
        listaFiltrada = movieData.filter(pelicula => parseInt(pelicula.runtime) >= 90 && parseInt(pelicula.runtime) <= 120);
      }else if(duracion == "120"){
        listaFiltrada = movieData.filter(pelicula => parseInt(pelicula.runtime) > 120);
      }else{
        listaFiltrada = movieData;
      }
      setPeliculasFiltradas(listaFiltrada);
      
    }

    const ordenarPeliculas = (valorOrdenar) => {
      var listaOrdenada=[];
      if(valorOrdenar == "asc"){
        listaOrdenada = peliculasFiltradas.sort((a, b) => {
          if(a.title < b.title) return -1;
          else return 1;
        });
      }else if(valorOrdenar == "desc"){
        listaOrdenada = peliculasFiltradas.sort((a, b) => {
          if(a.title > b.title) return -1;
          else return 1;
        });
      }else{
        listaOrdenada = peliculasFiltradas;
      }
      
      console.log(listaOrdenada);
      setPeliculasFiltradas(listaOrdenada);
    }

    const pintarPeliculasFiltradas = () => {
      return (
        <div className="peliculas">
          {peliculasFiltradas.map((pelicula) => (
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
      );
    }

    return (
      <div className="container-peliculas">
        <div className="filters peliculas">
          <select id="category" name="category" onChange={filtrar}>
            <option value="">Filtrar por categoría</option>
            <option value="Action">Acción</option>
            <option value="Adventure">Aventura</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedia</option>
          </select>
          <select id="year" name="year">
            <option value="">Filtrar por año de lanzamiento</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
          </select>
          <select id="duration" name="duration" onChange={filtrar}>
            <option value="">Filtrar por duración</option>
            <option value="90">Menos de 90 minutos</option>
            <option value="90-120">Entre 90 y 120 minutos</option>
            <option value="120">Más de 120 minutos</option>
          </select>
          <select id="sort" name="sort" onChange={filtrar}>
            <option value="">Ordenar por título</option>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>

        {pintarPeliculasFiltradas()}
        {peliculasFiltradas.length === 0 && 
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
        }
      </div>
      
    );

}

export default Peliculas;