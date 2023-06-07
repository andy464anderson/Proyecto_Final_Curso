import './search.css';
import { useEffect, useState, useContext } from "react";
import React from 'react';
import { HeaderContext } from '../header/headerContext';
import CartaBucador from './carta_buscador';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import { useNavigate } from "react-router-dom";
import BotonSeguir from '../botonSeguir/botonSeguir';
import BotonEliminarUsuario from '../botonEliminarUsuario/botonEliminarUsuario';


const Search = () => {
    const navigate = useNavigate();
    const { movieData, updateMovieData, userData, isLoggedIn } = useContext(HeaderContext);

    const [pelisFiltradas, setPelisFiltradas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [listaUsuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const obtenerPeliculas = async () => {
            const data = await fetch('http://localhost:8000/peliculas', {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                }
            })
            var peliculas = await data.json();
            var filtradorPelis = peliculas.filter(pelicula => pelicula.poster && /^http/.test(pelicula.poster) && pelicula.id !== 11853);
            updateMovieData(filtradorPelis);
        };
        obtenerPeliculas();

    }, []);

    function cambiarResultados(tipo) {
        $("#select-tipo-buscador").val(tipo);
        var botones = ["todo", "pelis", "users"];
        botones.forEach(boton => {
            $("#boton-" + boton + "-search").css({
                "background": "#14181C",
                "color": "#8595A3",
                "border": "1px solid #14181C"
            })
        });
        $("#boton-" + tipo + "-search").css({
            "color": "#40BCF4",
            "border": "1px solid #40BCF4"
        })
        buscarPeliculas();
    }

    function navegarPerfil(usuario) {
        navigate(`/perfil/${usuario}`);
    }

    const buscarPeliculas = () => {
        var textoBuscador = document.getElementById("buscador").value.toLowerCase();
        if (textoBuscador !== "") {
            var pelisFiltradas1 = movieData.filter((peli) => peli.title.toLowerCase().includes(textoBuscador));
            var usuariosFiltrados = [];
            if (isLoggedIn) {
                usuariosFiltrados = listaUsuarios.filter((user) => user.nombre_usuario.toLowerCase().includes(textoBuscador) && user.id !== userData.id);
            } else {
                usuariosFiltrados = listaUsuarios.filter((user) => user.nombre_usuario.toLowerCase().includes(textoBuscador));
            }
            var listaFiltrada = [...usuariosFiltrados, ...pelisFiltradas1];

            listaFiltrada.sort((a, b) => {
                if ('title' in a && 'title' in b) {
                    return a.title.localeCompare(b.title);
                } else if ('nombre_usuario' in a && 'nombre_usuario' in b) {
                    return a.nombre_usuario.localeCompare(b.nombre_usuario);
                }
            });
            var valorSelect = $("#select-tipo-buscador").val();
            if (valorSelect === "pelis") {
                listaFiltrada = listaFiltrada.filter(lista => 'title' in lista);
            }
            if (valorSelect === "users") {
                listaFiltrada = listaFiltrada.filter(lista => 'nombre_usuario' in lista);
            }
            setPelisFiltradas(listaFiltrada);
            setCurrentPage(1);
        } else {
            setPelisFiltradas([]);
            setCurrentPage(1);
        }

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
    }, []);

    const actualizar = (usuario) => {
        var filtro = pelisFiltradas.filter(user => user.id !== usuario.id);
        setPelisFiltradas(filtro);
    }


    const pintarPeliculas = () => {
        const startIndex = (currentPage - 1) * 6;
        const endIndex = startIndex + 6;
        const pagePelis = pelisFiltradas.slice(startIndex, endIndex);
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
                            var usuario = listaUsuarios.find(user => user.nombre_usuario === pelicula.nombre_usuario);
                            return (
                                <div key={pelicula.nombre_usuario} className="carta-usuario-buscador">
                                    <div><img src="sinFoto.png" alt="fotousuario" className="imagen-pelicula-buscador imagen-usuario-buscador" /></div>
                                    <div className="info-usuario-buscador">
                                        <p><strong className="titulo-carta-buscador nombre-carta-buscador" onClick={() => navegarPerfil(pelicula.nombre_usuario)}>{pelicula.nombre_usuario}</strong></p>
                                        <p className="sinopsis-carta-buscador">{pelicula.nombre_completo}</p>
                                        {isLoggedIn && (
                                            <>
                                                <BotonSeguir usuario={usuario} actualizarDatos={undefined} />
                                                {userData.rol === "admin" && (
                                                    <BotonEliminarUsuario usuario={usuario} actualizar={actualizar} />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
                <div id="divBotonesSearch">
                    <button onClick={() => cambiarResultados("todo")} id='boton-todo-search'>Todo</button>
                    <button onClick={() => cambiarResultados("pelis")} id='boton-pelis-search'>Películas</button>
                    <button onClick={() => cambiarResultados("users")} id='boton-users-search'>Usuarios</button>
                    <select id='select-tipo-buscador' onChange={buscarPeliculas}>
                        <option value={"value"}>todo</option>
                        <option value={"pelis"}>pelis</option>
                        <option value={"users"}>users</option>
                    </select>
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
                <input onKeyUp={buscarPeliculas} id="buscador" placeholder="Busca peliculas o usuarios..." autoFocus></input>
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
