import './search.css';
import { useEffect, useState } from "react";
import React from 'react';
import CartaPelicula from '../peliculas/carta_pelicula';
import Peliculas from '../peliculas/peliculas';

const Search = () => {
    const [peliculas, setPeliculas] = useState([]);
    const [pelisFiltradas, setPelisFiltradas] = useState("");
    var listaFiltrada=[];
    const htmlPeliculas=``;
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
          };
          obtenerPeliculas();

    }, []);
    const buscarPeliculas = () => {
        var textoBuscador=document.getElementById("buscador").value.toLowerCase();
        listaFiltrada=peliculas.filter((peli)=>peli.title.toLowerCase().includes(textoBuscador));
        console.log(listaFiltrada);
        pintarPeliculas(listaFiltrada);
    }
    const pintarPeliculas = (pelis) => {
        setPelisFiltradas(
        <div className="peliculas">
        {pelis.map((pelicula) => (
        <React.Fragment key={pelicula.id}>
            {pelicula.poster && /^http/.test(pelicula.poster) && (
            <CartaPelicula pelicula={pelicula} />
            )}
        </React.Fragment>
        ))}
        </div>);
    }
    
    return (
        <div>
            <div id='div-buscador'>
                <input onKeyUp={buscarPeliculas} id="buscador" placeholder="Busca peliculas..."></input>
            </div>
           {pelisFiltradas};
        </div>
        
    )
    
}

export default Search;
