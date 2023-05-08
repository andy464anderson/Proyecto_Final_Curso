import './search.css';
import { useEffect, useState, useContext } from "react";
import React from 'react';
import { HeaderContext } from '../header/headerContext';
import CartaBucador from './carta_buscador';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const Search = () => {


    useEffect(() => {
        const obtenerDatosUsuario = async () => {
            const responseUsuario = await fetch(`http://localhost:8000/usuarios`, {
                method: "GET",
                headers: {
                accept: "application/json",
                },
            });
            var dataUsuario = await responseUsuario.json();
            
            return dataUsuario
        };
        var promesaUsuarios = obtenerDatosUsuario();
        promesaUsuarios.then((data) => {
            console.log(data);
        }).catch((error) => {
            console.error(error);
        });
    }
    ,[])
/*     promesaUsuarios.then(function(usuarios) {
        
        var arregloUsuarios = usuarios;
        
        for (var i = 0; i < arregloUsuarios.length; i++) {
          console.log(arregloUsuarios[i].nombre_usuario);
        }
    }); */
    const {movieData} = useContext(HeaderContext);

    const [pelisFiltradas, setPelisFiltradas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const buscarPeliculas = () => {
        var textoBuscador=document.getElementById("buscador").value.toLowerCase();
        var listaFiltrada = movieData.filter((peli)=>peli.title.toLowerCase().includes(textoBuscador));
        var listaFiltradaUsuarios;
        if(textoBuscador == ""){
            listaFiltrada=[];
        }
        listaFiltrada = listaFiltrada.sort((a, b)=>{
            if(a.title < b.title) return -1;
            else return 1;
        });
        setPelisFiltradas(listaFiltrada);
        setCurrentPage(1);
    }

    const pintarPeliculas = () => {
        const startIndex = (currentPage - 1) * 10;
        const endIndex = startIndex + 10;
        const pagePelis = pelisFiltradas.slice(startIndex, endIndex);

        return (
            <div className="peliculas-buscador">
                {pagePelis.map((pelicula) => (
                    <React.Fragment key={pelicula.id}>
                        {pelicula.poster && /^http/.test(pelicula.poster) && (
                            <CartaBucador pelicula={pelicula} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    const totalPages = Math.ceil(pelisFiltradas.length / 10);

    const handlePrevClick = () => {
        setCurrentPage(currentPage - 1);
    }

    const handleNextClick = () => {
        setCurrentPage(currentPage + 1);
    }

    return (
        <div>
            <div id='div-buscador'>
                <input onKeyUp={buscarPeliculas} id="buscador" placeholder="Busca peliculas..." autoFocus></input>
            </div>
            <div id='div-dentro'>
                {pintarPeliculas()}
            </div>
            {pelisFiltradas.length === 0 && 
                <div id='noPelis'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} id='lupa' />
                    <p>¿Qué peli estás buscando?</p>
                </div>
            }
            {pelisFiltradas.length > 10 && (
                <div className="pagination">
                    {currentPage > 1 && <button className="botonPaginacion" onClick={handlePrevClick}>Anterior</button>}
                    <span id='paginaActual'>{currentPage}</span>
                    {currentPage < totalPages && <button className="botonPaginacion" onClick={handleNextClick}>Siguiente</button>}
                </div>
            )}
        </div>
        
    )
    
}

export default Search;
