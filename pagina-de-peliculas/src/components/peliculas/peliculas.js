import React,{useContext} from "react";
import './peliculas.css';
import { useEffect, useState } from "react";
import CartaPelicula from "./carta_pelicula";
import { HeaderContext } from "../header/headerContext";
import { SlSpinner } from 'https://cdn.skypack.dev/@shoelace-style/shoelace@2.4.0/dist/react/';
import { faL } from "@fortawesome/free-solid-svg-icons";






const Peliculas = () => {
    const {updateMovieData} = useContext(HeaderContext);
    const [peliculasFiltradas, setPeliculasFiltradas] = useState(["Filtro"]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [durationFilter, setDurationFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    // creamos el estado de peliculas
    const [peliculas, setPeliculas] = useState([]);
    const [mostrarSpinner, setMostrarSpinner] = useState(true);
    useEffect(() => {
      const timer = setTimeout(() => {
        setMostrarSpinner(false);
      }, 1500)
    
      return () => clearTimeout(timer);
    }, []);


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
            setPeliculas(peliculas);
            updateMovieData(peliculas)
          };
          obtenerPeliculas();

    }, []);

    useEffect(() => {
      const filtrarPeliculas = () => {
        let peliculasFiltradas = peliculas;
        if (categoryFilter !== '') {
          peliculasFiltradas = peliculasFiltradas.filter(pelicula => pelicula.genres.includes(categoryFilter));
        }
        if (yearFilter !== '') {
          peliculasFiltradas = peliculasFiltradas.filter((pelicula) => {
            const year = pelicula.release_date.slice(0, 4);
            switch (yearFilter) {
              case '2020s':
                return year >= 2020 && year <= 2029;
              case '2010s':
                return year >= 2010 && year <= 2019;
              case '2000s':
                return year >= 2000 && year <= 2009;
              case '1990s':
                return year >= 1990 && year <= 1999;
              case '1980s':
                return year >= 1980 && year <= 1989;
              case 'pre-1980s':
                return year < 1980;
              default:
                return true;
            }
          });
        }
        if (durationFilter !== '') {
          if (durationFilter === '90') {
            peliculasFiltradas = peliculasFiltradas.filter(pelicula => parseInt(pelicula.runtime) < 90);
          } else if (durationFilter === '90-120') {
            peliculasFiltradas = peliculasFiltradas.filter(pelicula => parseInt(pelicula.runtime) >= 90 && parseInt(pelicula.runtime) <= 120);
          } else if (durationFilter === '120') {
            peliculasFiltradas = peliculasFiltradas.filter(pelicula => parseInt(pelicula.runtime) > 120);
          }
        }
        if (sortOrder !== '') {
          if (sortOrder === 'asc') {
            peliculasFiltradas = peliculasFiltradas.sort((a, b) =>{
              if(a.title < b.title) return -1;
              else return 1;
            });
          } else if (sortOrder === 'desc') {
            peliculasFiltradas = peliculasFiltradas.sort((a, b) => {
              if(a.title > b.title) return -1;
              else return 1;
            });
          }
        }
        setPeliculasFiltradas(peliculasFiltradas);
      };
    
    filtrarPeliculas();
    }, [categoryFilter, yearFilter, durationFilter, sortOrder, peliculas]);
    
    return (
      <div className="container-peliculas">
        <div className="spinner">
        {
            peliculas.length === 0 || mostrarSpinner &&  <SlSpinner
            style={{
              fontSize: '15rem',
              '--indicator-color': 'darkblue',
              '--track-color': 'lightblue'
            }}
          />
          }
        </div>
        <div className="peliculas">
          {mostrarSpinner === false &&  peliculasFiltradas.map((pelicula) => (
            <React.Fragment key={pelicula.id}>
              {pelicula.poster && /^http/.test(pelicula.poster) && (
                <CartaPelicula pelicula={pelicula} />
              )}
            </React.Fragment>
          ))}
        </div>
        {peliculasFiltradas.length === 0 && 
          <div id='noPelis'>
              <p>No se encuentran películas con los filtros especficados</p>
          </div>
        }
        <div className="filters">
          <div className="select-filtro">
            <select id="category" name="category" onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">Filtrar por categoría</option>
              <option value="Action">Acción</option>
              <option value="Adventure">Aventura</option>
              <option value="Drama">Drama</option>
              <option value="Comedy">Comedia</option>
              <option value="Thriller">Thriller</option>
              <option value="Western">Wéstern</option>
              <option value="Romance">Romance</option>
              <option value="Fantasy">Fantasía</option>
              <option value="Horror">Horror</option>
              <option value="Crime">Crimen</option>
              <option value="Mystery">Misterio</option>
            </select>
          </div> 
          <div className="select-filtro">   
            <select id="year" name="year" onChange={(e) => setYearFilter(e.target.value)}>
              <option value="">Filtrar por año de lanzamiento</option>
              <option value="2020s">2020s</option>
              <option value="2010s">2010s</option>
              <option value="2000s">2000s</option>
              <option value="1990s">1990s</option>
              <option value="1980s">1980s</option>
              <option value="pre-1980s">pre-1980s</option>
            </select>
          </div> 
          <div className="select-filtro">            
            <select id="duration" name="duration" onChange={(e) => setDurationFilter(e.target.value)}>
              <option value="">Filtrar por duración</option>
              <option value="90">Menos de 90 minutos</option>
              <option value="90-120">Entre 90 y 120 minutos</option>
              <option value="120">Más de 120 minutos</option>
            </select>
          </div> 
          <div className="select-filtro" id="ultimo-select">
            <select id="sort" name="sort" onChange={(e) => setSortOrder(e.target.value)}>
              <option value="">Ordenar por título</option>
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>
        </div> 
      </div>      
    );

}

export default Peliculas;