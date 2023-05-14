import './search.css';
import { useEffect, useState, useContext } from "react";
import React from 'react';
import { HeaderContext } from '../header/headerContext';
import CartaBucador from './carta_buscador';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const Search = () => {


    
/*     promesaUsuarios.then(function(usuarios) {
        
        var arregloUsuarios = usuarios;
        
        for (var i = 0; i < arregloUsuarios.length; i++) {
          console.log(arregloUsuarios[i].nombre_usuario);
        }
    }); */
    const {movieData} = useContext(HeaderContext);

    const [pelisFiltradas, setPelisFiltradas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [listaUsuarios, setUsuarios] = useState([]);
    function mostrarTodo(){
        alert("todo3");
    }
    function mostrarPelis(){
        alert("pelis2");
    }
    function mostrarUsers(){
        alert("users1");
    }
    const buscarPeliculas = () => {
        

        
     
        var textoBuscador=document.getElementById("buscador").value.toLowerCase();
        var pelisFiltradas1 = movieData.filter((peli)=>peli.title.toLowerCase().includes(textoBuscador));
        var usuariosFiltrados = listaUsuarios.filter((user)=>user.nombre_usuario.toLowerCase().includes(textoBuscador));
/*         console.log(pelisFiltradas1);
        console.log(usuariosFiltrados); */
        var listaFiltrada = [...usuariosFiltrados, ...pelisFiltradas1];
        if(textoBuscador == ""){
            listaFiltrada=[];
        }
        listaFiltrada.sort((a, b) => {
            if ('title' in a && 'title' in b) {
              return a.title.localeCompare(b.title);
            } else if ('nombre_usuario' in a && 'nombre_usuario' in b) {
              return a.nombre_usuario.localeCompare(b.nombre_usuario);
            }
          });
        /* listaFiltrada = listaFiltrada.sort((a, b)=>{
            if(a.title < b.title) return -1;
            else return 1;
        }); */
        console.log(listaFiltrada);
        setPelisFiltradas(listaFiltrada);
        setCurrentPage(1);
    }
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
            setUsuarios(data);
            
        }).catch((error) => {
            console.error(error);
        });
    }
    ,[]);
    const pintarPeliculas = () => {
        const startIndex = (currentPage - 1) * 6;
        const endIndex = startIndex + 6;
        const pagePelis = pelisFiltradas.slice(startIndex, endIndex);   
        console.log(pagePelis);
        return (
            <div id="divCentralSearch">
                <div className="peliculas-buscador">
                    {pagePelis.map((pelicula) => {
                        if ('title' in pelicula && pelicula.poster && /^http/.test(pelicula.poster)) {
                            return (
                            <React.Fragment key={pelicula.id}>
                                <CartaBucador pelicula={pelicula} />
                            </React.Fragment>
                            );
                        } if ('nombre_usuario' in pelicula) {
                            return (
                                <div className="carta-usuario-buscador">
                                    <div><img src="sinFoto.png" alt="fotousuario" className="imagen-pelicula-buscador imagen-usuario-buscador" /></div>
                                    <div className="info-usuario-buscador">
                                        <p><strong className="titulo-carta-buscador nombre-carta-buscador">{pelicula.nombre_usuario}</strong></p>
                                        <p className="sinopsis-carta-buscador">{pelicula.nombre_completo}</p>
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
                <div id="divBotonesSearch">
                    <button onClick={mostrarTodo} id='boton-todo-search'>Todo</button>
                    <button onClick={mostrarPelis} id='boton-pelis-search'>Películas</button>
                    <button onClick={mostrarUsers} id='boton-users-search'>Usuarios</button>
                </div>
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
