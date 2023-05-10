import "./buscadorPelisLista.css"
import { useEffect, useState, useContext } from "react";
import React from 'react';
import { HeaderContext } from '../header/headerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const BuscadorPelisLista = ({ peliculasEnLista, anadirPeliculas, idLista, searchAbierto }) => {
    const {movieData} = useContext(HeaderContext);
    const peliculasFiltradas = movieData.filter(pelicula => !peliculasEnLista.includes(pelicula.id));
    const [pelisFiltradas, setPelisFiltradas] = useState(peliculasFiltradas);

    const [pelisSeleccionadas, setPelisSeleccionadas] = useState([]);
    

    const buscarPeliculas = () => {
        var textoBuscador=document.getElementById("buscador").value.toLowerCase();
        var listaFiltrada = peliculasFiltradas.filter((peli)=>peli.title.toLowerCase().includes(textoBuscador));
        if(textoBuscador == ""){
            listaFiltrada = peliculasFiltradas;
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

        setPelisSeleccionadas(pelisSeleccionadas);
        
        sessionStorage.setItem(idLista+'pelisSeleccionadas', JSON.stringify(pelisSeleccionadas));
        
        const divPeli = document.getElementById(idPelicula);
        if (divPeli.classList.contains('peliSeleccionada')) {
          divPeli.classList.remove('peliSeleccionada');
        } else {
          divPeli.classList.add('peliSeleccionada');
        }
    };
      
      
    useEffect(() => {
        let pelisSeleccionadas = [];
        peliculasEnLista.forEach(idPelicula => {
            pelisSeleccionadas.push(idPelicula);
        });
        setPelisSeleccionadas(peliculasEnLista);
        sessionStorage.setItem(idLista+'pelisSeleccionadas', JSON.stringify(pelisSeleccionadas));
    }, [peliculasEnLista]);
      

    const anadirPeliculasSeleccionadas = () => {
        if(pelisSeleccionadas.length > 0){
            let pelisSeleccionadas = JSON.parse(sessionStorage.getItem(idLista+'pelisSeleccionadas')) || [];

            anadirPeliculas(pelisSeleccionadas);
        }else{
            alert("No se ha actualizado la lista");
        }        
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