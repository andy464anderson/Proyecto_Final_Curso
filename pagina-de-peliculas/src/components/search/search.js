import './search.css';
import { useEffect, useState,useContext } from "react";
import React from 'react';
import CartaPelicula from '../peliculas/carta_pelicula';
import { HeaderContext } from '../header/headerContext';


const Search = () => {
    const {movieData} = useContext(HeaderContext);
    
    const [pelisFiltradas, setPelisFiltradas] = useState("");
    var listaFiltrada=[];
    const htmlPeliculas=``;
    const buscarPeliculas = () => {
        var textoBuscador=document.getElementById("buscador").value.toLowerCase();
        listaFiltrada=movieData.filter((peli)=>peli.title.toLowerCase().includes(textoBuscador));
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
