import "./buscadorPelisLista.css"
import { useEffect, useState, useContext } from "react";
import React from 'react';
import { HeaderContext } from '../header/headerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const BuscadorPelisLista = ({ peliculasEnLista, anadirPeliculas, idLista, searchAbierto }) => {
    const {movieData} = useContext(HeaderContext);
    const [pelisFiltradas, setPelisFiltradas] = useState([]);
    const [pelisSeleccionadas, setPelisSeleccionadas] = useState([]);

    const buscarPeliculas = () => {
        var textoBuscador=document.getElementById("buscador").value.toLowerCase();
        var listaFiltrada = movieData.filter((peli)=>peli.title.toLowerCase().includes(textoBuscador));
        if(textoBuscador == ""){
            listaFiltrada = movieData;
        }
        listaFiltrada = listaFiltrada.sort((a, b)=>{
            if(a.title < b.title) return -1;
            else return 1;
        });
        setPelisFiltradas(listaFiltrada);
    }

    const seleccionarPeli = (idPelicula) => {
        let pelisSeleccionadas = JSON.parse(sessionStorage.getItem(idLista+'pelisSeleccionadas')) || [];
        
        if (pelisSeleccionadas.includes(idPelicula)) {
          pelisSeleccionadas = pelisSeleccionadas.filter(id => id !== idPelicula);
        } else {
          pelisSeleccionadas.push(idPelicula);
        }
        
        sessionStorage.setItem(idLista+'pelisSeleccionadas', JSON.stringify(pelisSeleccionadas));
        
        const divPeli = document.getElementById(idPelicula);
        if (divPeli.classList.contains('peliSeleccionada')) {
          divPeli.classList.remove('peliSeleccionada');
        } else {
          divPeli.classList.add('peliSeleccionada');
        }
    };
      
      
    useEffect(() => {
        setPelisFiltradas(movieData);
        let pelisSeleccionadas = [];
        peliculasEnLista.forEach(idPelicula => {
            if(document.getElementById(idPelicula)){
                const divPeli = document.getElementById(idPelicula);
                divPeli.classList.add('peliSeleccionada');
                pelisSeleccionadas.push(idPelicula);
            }            
        });
        setPelisSeleccionadas(peliculasEnLista);
        sessionStorage.setItem(idLista+'pelisSeleccionadas', JSON.stringify(pelisSeleccionadas));
    }, [peliculasEnLista]);
      

    const anadirPeliculasSeleccionadas = () => {
        let pelisSeleccionadas = JSON.parse(sessionStorage.getItem(idLista+'pelisSeleccionadas')) || [];
    
        console.log('Películas seleccionadas:', pelisSeleccionadas);

        anadirPeliculas(pelisSeleccionadas);
        searchAbierto(false);
    }
    
      

    const pintarPeliculas = () => {

        return (
            <div className="peliculas-resultado">
                {pelisFiltradas.map((pelicula) => (
                    <React.Fragment key={pelicula.id}>
                        {pelicula.poster && /^http/.test(pelicula.poster) && (
                            <div id={pelicula.id} onClick={() => seleccionarPeli(pelicula.id)} className={`imagenLista ${pelisSeleccionadas.includes(pelicula.id) ? 'peliSeleccionada' : ''}`}>
                                <img src={pelicula.poster} alt={pelicula.title}></img>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    return (
        <div className="buscador-pelis-lista">
            <div id='buscador-div'>
                <input onKeyUp={buscarPeliculas} id="buscador" placeholder="Busca peliculas..." autoFocus></input>
            </div>
            <div id="divAnadir">
                <button type="button" onClick={anadirPeliculasSeleccionadas}>Añadir películas seleccionadas</button>
            </div>
            <div id='div-resultado'>
                {pintarPeliculas()}
            </div>
            {pelisFiltradas.length === 0 && 
                <div id='sinPelis'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} id='lupa' />
                    <p>¿Qué peli estás buscando?</p>
                </div>
            }
        </div>        
    )
    
}

export default BuscadorPelisLista;