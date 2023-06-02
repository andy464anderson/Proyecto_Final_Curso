import React from "react";
import "./perfil.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { HeaderContext } from "../header/headerContext";
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus, faPencil, faStar } from '@fortawesome/free-solid-svg-icons';
import BuscadorPelisLista from "./buscadorPelisLista";
import BotonSeguir from "../botonSeguir/botonSeguir";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Perfil() {
    const navigate = useNavigate();
    const [idLista, setIdLista] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [listas, setListas] = useState([]);
    const [seguidores, setSeguidores] = useState([]);
    const [seguidos, setSeguidos] = useState([]);
    const [listaPeliculas, setListaPeliculas] = useState([]);
    const [listaActual, setListaActual] = useState({});
    const { isLoggedIn, movieData, userData, updateHeader, updateMovieData } = useContext(HeaderContext);
    const nombre_usuario = window.location.pathname.split("/")[2];
    const [showSearch, setShowSearch] = useState(false);
    const [pelisSeleccionadas, setPelisSeleccionadas] = useState([]);
    const [verEditarLista, setVerEditarLista] = useState(false);
    const [verCrearLista, setVerCrearLista] = useState(false);
    const [nombreEditarLista, setNombreEditarLista] = useState("");
    const [nombreCrearLista, setNombreCrearLista] = useState("");
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [nombreListaError, setNombreListaError] = useState("");
    const [publica, setPublica] = useState(false);
    const [seleccionar, setSeleccionar] = useState(false);

    useEffect(() => {
        const obtenerPeliculas = async () => {
            const data = await fetch('http://localhost:8000/peliculas', {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                }
            })
            var peliculas = await data.json();
            var filtradorPelis = peliculas.filter(pelicula => pelicula.poster && /^http/.test(pelicula.poster) && pelicula.id != 11853);
            updateMovieData(filtradorPelis);
        };
        obtenerPeliculas();
    }, [updateMovieData]);

    useEffect(() => {
        const obtenerDatosUsuario = async () => {
            const responseUsuario = await fetch(`http://localhost:8000/perfil/${nombre_usuario}`, {
                method: "GET",
                headers: {
                    accept: "application/json",
                },
            });
            var dataUsuario = await responseUsuario.json();
            setUsuario(dataUsuario);

            setNombreCompleto(dataUsuario.nombre_completo);
            setNombreUsuario(dataUsuario.nombre_usuario);

            const responseReviews = await fetch(`http://localhost:8000/reviews/usuario/${dataUsuario.id}`);
            const dataReviews = await responseReviews.json();
            setReviews(dataReviews);

            const responseListas = await fetch(`http://localhost:8000/listas/${dataUsuario.id}`);
            const dataListas = await responseListas.json();
            setListas(dataListas);

            const responseSeguidores = await fetch(`http://localhost:8000/seguidores/${dataUsuario.id}`);
            const dataSeguidores = await responseSeguidores.json();
            setSeguidores(dataSeguidores);

            const responseSeguidos = await fetch(`http://localhost:8000/seguidos/${dataUsuario.id}`);
            const dataSeguidos = await responseSeguidos.json();
            setSeguidos(dataSeguidos);
        };
        obtenerDatosUsuario();
    }, [nombre_usuario]);

    const pintarSeguidores = () => {
        navigate(`/perfil/${nombre_usuario}/seguidores`);
    }

    const pintarSeguidos = () => {
        navigate(`/perfil/${nombre_usuario}/seguidos`);
    }

    function obtenerReviewsUsuarioConPeliculas(listaPeliculas, listaReviews, idUsuario) {
        const reviewsUsuario = listaReviews.filter(review => review.id_usuario === idUsuario);
        if (reviewsUsuario.length === 0) return [];

        const reviewsUsuarioConPeliculas = reviewsUsuario.map(review => {
            const peliculaEncontrada = listaPeliculas.find(pelicula => pelicula.id === review.id_pelicula);
            return {
                ...review,
                pelicula: peliculaEncontrada,
            };
        });
        return reviewsUsuarioConPeliculas;
    }

    function obtenerTodasLasListasDeUsuario(listaPeliculas, listaLista, idUsuario) {
        const listasUsuario = listaLista.filter(lista => lista.usuario_id === idUsuario);
        if (listasUsuario.length === 0) return [];

        const listasConPeliculas = listasUsuario.map(lista => {
            const peliculasLista = lista.peliculas.map(idPelicula => {
                return listaPeliculas.find(pelicula => pelicula.id === idPelicula);
            });
            return { ...lista, peliculasLista: peliculasLista };
        });

        return listasConPeliculas;
    }

    const seleccionarPeli = (idPelicula) => {
        const [idLista, peliculaId] = idPelicula.split('-');
        const divPeli = document.getElementById(idPelicula);
        if (divPeli.classList.contains('peliSeleccionada')) {
            divPeli.classList.remove('peliSeleccionada');
            setPelisSeleccionadas(prevState => prevState.filter(id => id !== peliculaId));
        } else {
            divPeli.classList.add('peliSeleccionada');
            setPelisSeleccionadas(prevState => [...prevState, peliculaId]);
        }

    }


    const eliminarPeliculasLista = async () => {
        if (pelisSeleccionadas.length > 0) {
            const pelisSeleccionadasNumeros = pelisSeleccionadas.map((id) => Number(id));
            const filtroPelis = listaActual.peliculas.filter((id) => !pelisSeleccionadasNumeros.includes(id));
            accionPeliculasSeleccionadas(filtroPelis);
        } else {
            alert("No ha seleccionado ninguna película para eliminar");
        }
        setSeleccionar(false);
    }

    function verLista(lista) {
        $("#infoListasNormales").show();
        $("#tituloDivListasNormales").html(`${lista.nombre_lista}`);
        $("#infoListasNormalesCuerpo").html(`        
            ${lista.peliculasLista.map(peli => {
            return `
                    <div class="imagenLista ${pelisSeleccionadas.includes(peli.id) ? 'peliSeleccionada' : ''}" id="${lista.id}-${peli.id}">
                        <img src=${peli.poster}></img>
                    </div>
                `
        }).join('')}
        `);
        $(".imagenLista").on("click", function () {
            const id = $(this).attr('id');
            var idPeli = id.split("-")[1];
            navigate(`/detalle/${idPeli}`);
        });

        var pelisEnLista = [];
        lista.peliculas.map(idPeli => {
            pelisEnLista.push(idPeli);
        });
        setPelisSeleccionadas([]);
        setListaPeliculas(pelisEnLista);
        setIdLista(lista.id);
        setListaActual(lista);
    }

    function esconderLista() {
        $(".peliSeleccionada").removeClass("peliSeleccionada");
        $("#infoListasNormales").hide();
    }

    function mostrarLikes() {
        $(".listas-likes").show();
        $(".listas-normales").hide();
        $(".bloqueReseñas").hide();
        $("#botonLikes").css({
            "background-color": "#262d34",
            "border-top": "2px solid #262d34",
            "border-bottom": "2px solid #40BCF4",
            "color": "#40BCF4"
        });
        $("#botonListas").css({
            "background-color": "#14181C",
            "border-top": "2px solid #14181C",
            "border-bottom": "2px solid #14181C",
            "color": "#8595A3"
        });
        $("#botonReviews").css({
            "background-color": "#14181C",
            "border-top": "2px solid #14181C",
            "border-bottom": "2px solid #14181C",
            "color": "#8595A3"
        });

    }
    function mostrarListas() {
        $(".listas-likes").hide();
        $(".listas-normales").show();
        $(".bloqueReseñas").hide();
        $("#botonListas").css({
            "background-color": "#262d34",
            "border-top": "2px solid #262d34",
            "border-bottom": "2px solid #40BCF4",
            "color": "#40BCF4"
        });
        $("#botonLikes").css({
            "background-color": "#14181C",
            "border-top": "2px solid #14181C",
            "border-bottom": "2px solid #14181C",
            "color": "#8595A3"
        });
        $("#botonReviews").css({
            "background-color": "#14181C",
            "border-top": "2px solid #14181C",
            "border-bottom": "2px solid #14181C",
            "color": "#8595A3"
        });
    }
    function mostrarReviews() {
        $(".listas-likes").hide();
        $(".listas-normales").hide();
        $(".bloqueReseñas").show();
        $("#botonReviews").css({
            "background-color": "#262d34",
            "border-top": "2px solid #262d34",
            "border-bottom": "2px solid #40BCF4",
            "color": "#40BCF4"
        });
        $("#botonListas").css({
            "background-color": "#14181C",
            "border-top": "2px solid #14181C",
            "border-bottom": "2px solid #14181C",
            "color": "#8595A3"
        });
        $("#botonLikes").css({
            "background-color": "#14181C",
            "border-top": "2px solid #14181C",
            "border-bottom": "2px solid #14181C",
            "color": "#8595A3"
        });
    }

    const accionPeliculasSeleccionadas = async (pelisSeleccionadas) => {
        const peliculas = pelisSeleccionadas;
        const id = idLista;
        const lista = {
            id,
            peliculas
        };
        const response = await fetch(`http://localhost:8000/peliculasLista/${idLista}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(lista),
        });
        const dataResponse = await response.json();
        const responseListas = await fetch(`http://localhost:8000/listas/${usuario.id}`);
        const dataListas = await responseListas.json();
        setListas(dataListas);
        setListaPeliculas(peliculas);

        const listaListas = obtenerTodasLasListasDeUsuario(movieData, dataListas, usuario.id);
        const listaActualizada = listaListas.find((lista) => lista.id === id);
        setListaActual(listaActualizada);
    };

    useEffect(() => {
        if (Object.keys(listaActual).length > 0 && $("#infoListasNormales").is(":visible")) {
            verLista(listaActual);
        }
    }, [listaActual]);

    const cerrarSearch = (cerrar) => {
        setShowSearch(cerrar);
    }

    const eliminarLista = async (id) => {
        const eliminar = await fetch(`http://localhost:8000/lista/${id}`, {
            method: "DELETE"
        });

        const responseListas = await fetch(`http://localhost:8000/listas/${usuario.id}`);
        const dataListas = await responseListas.json();
        setListas(dataListas);
    }

    const editarLista = async (lista) => {
        if (nombreEditarLista !== "") {
            if (lista.nombre_lista !== nombreEditarLista || lista.publica !== publica) {
                const editarLista = {
                    nombre_lista: nombreEditarLista,
                    publica: publica,
                };

                const response = await fetch(`http://localhost:8000/lista/${lista.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editarLista),
                });
                const dataResponse = await response.json();

                const responseListas = await fetch(`http://localhost:8000/listas/${usuario.id}`);
                const dataListas = await responseListas.json();
                setListas(dataListas);
                setNombreListaError("");
                setVerEditarLista(false);

                toast.success("Lista editada con éxito", { autoClose: 2500 });
            } else {
                toast.warning("No se ha modificado nada", { autoClose: 2500 });
                setNombreListaError("");
                setVerEditarLista(false);
            }
        } else {
            setNombreListaError("El nombre no puede estar vacío");
        }
    };

    const redireccionarPeli = (idPeli) => {
        navigate(`/detalle/${idPeli}`);
    }

    const crearLista = async () => {
        if (nombreCrearLista != "") {
            const lista = {
                id: 0,
                tipo: "normal",
                nombre_lista: nombreCrearLista,
                usuario_id: userData.id,
                publica: publica,
                peliculas: []
            }

            const response = await fetch(`http://localhost:8000/lista`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(lista),
            });
            const dataResponse = await response.json();

            const responseListas = await fetch(`http://localhost:8000/listas/${usuario.id}`);
            const dataListas = await responseListas.json();
            toast.success("Lista creada con éxito", { autoClose: 2500 });
            setListas(dataListas);
            setNombreCrearLista("");
            setNombreListaError("");
            setVerCrearLista(false);
        } else {
            setNombreListaError("El nombre no puede estar vacío");
        }
    }

    const seleccionarPelis = () => {
        if (seleccionar === true) {
            setSeleccionar(false);
            setPelisSeleccionadas([]);
            $("#infoListasNormalesCuerpo").find("div").removeClass("peliSeleccionada");
            $(".imagenLista").on("click", function () {
                const id = $(this).attr('id');
                var idPeli = id.split("-")[1];
                navigate(`/detalle/${idPeli}`);
            });
        } else {
            setSeleccionar(true);
            $(".imagenLista").off("click");
            if (usuario.id == userData.id) {
                $(".imagenLista").on("click", function () {
                    const id = $(this).attr('id');
                    seleccionarPeli(id);
                });
            }
        }
    }

    const actualizarDatos = (seguidos, seguidores, nombreUsuario, nombreCompleto) => {
        setSeguidos(seguidos);
        setSeguidores(seguidores);
        setNombreCompleto(nombreCompleto);
        setNombreUsuario(nombreUsuario);
    }


    if (!usuario || !reviews || !listas || !seguidores) {
        return <div></div>;
    } else {
        const listaReviews = obtenerReviewsUsuarioConPeliculas(movieData, reviews, usuario.id);
        const listaListas = obtenerTodasLasListasDeUsuario(movieData, listas, usuario.id);
        const listaNormalSinOrdenar = listaListas.filter((lista) => lista.tipo === "normal");
        const listaNormal = listaNormalSinOrdenar.sort((a, b) => {
            if (a.nombre_lista > b.nombre_lista) return 1;
            else return -1;
        });
        const listaLikes = listaListas.find((lista) => lista.tipo === "likes");
        return (
            <div className="perfil-container">
                <div className="perfil-header">
                    <div className="perfil-avatar">
                        <h2>{nombreCompleto}</h2>
                        <h5>{nombreUsuario}</h5>
                        <BotonSeguir usuario={usuario} actualizarDatos={actualizarDatos} />
                    </div>

                    <div className="perfil-info">
                        <table className="seg">
                            <tbody>
                                <tr className="seguidores" onClick={pintarSeguidores}>
                                    <td>
                                        Seguidores
                                    </td>
                                    <td>
                                        {seguidores.length}
                                    </td>
                                </tr>
                                <tr className="seguidos" onClick={pintarSeguidos}>
                                    <td>
                                        Seguidos
                                    </td>
                                    <td>
                                        {seguidos.length}
                                    </td>
                                </tr>
                                <tr className="seguidos">
                                    <td>
                                        Listas
                                    </td>
                                    <td>
                                        {listaNormal.length}
                                    </td>
                                </tr>
                                <tr className="seguidos">
                                    <td>
                                        Reseñas
                                    </td>
                                    <td>
                                        {reviews.length}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="perfil-body">
                    <div className="opciones-perfil">
                        <button id="botonLikes" onClick={mostrarLikes}>Likes</button>
                        <button id="botonListas" onClick={mostrarListas}>Listas</button>
                        <button id="botonReviews" onClick={mostrarReviews}>Reseñas</button>
                    </div>
                    <div className="listas-likes">
                        {listaLikes && listaLikes.peliculasLista.length > 0 ? (
                            <div className="lista-likes-hijo" id={listaLikes.id}>
                                {listaLikes.peliculasLista.map(peli => (
                                    <div className="divPeliListaLike" key={peli.id} id={peli.id}>
                                        <img onClick={() => redireccionarPeli(peli.id)} src={peli.poster} alt="poster" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div id='noPelis'>
                                {isLoggedIn && userData.id === usuario.id ? (
                                    <>
                                        <p>No has dado like a ninguna película</p>
                                        <button id="btnIrAPeliculas" onClick={() => navigate("/peliculas")}>Ir a películas</button>
                                    </>
                                ) : (
                                    <p>Este usuario no tiene likes</p>
                                )}

                            </div>
                        )}
                    </div>

                    <div className="listas-normales">
                        {isLoggedIn && usuario.id === userData.id && (
                            <button id="boton-crear-lista" type="button" onClick={() => { setVerCrearLista(true) }}>Crear nueva lista <FontAwesomeIcon icon={faPlus} /></button>
                        )}
                        {listaNormal && listaNormal.length > 0 ? (
                            listaNormal.map((lista) => (
                                (isLoggedIn && usuario.id === userData.id) ? (
                                    <div className="lista-normal" id={lista.id} key={lista.id}>
                                        {lista.peliculasLista.length > 0 && (
                                            <div className="divPeliListaNormal" key={lista.peliculasLista[0].id}>
                                                <img src={lista.peliculasLista[0].poster} alt="poster" />
                                            </div>
                                        )}
                                        <div className="nombreListaNormal">
                                            <span><h5 onClick={() => verLista(lista)}>{lista.nombre_lista}</h5></span>
                                            <p>{lista.peliculasLista.length} películas</p>
                                            <button className="eliminar-lista" type="button" onClick={() => eliminarLista(lista.id)}>Eliminar lista</button>
                                            <button className="editar-lista" type="button" onClick={() => { setListaActual(lista); setVerEditarLista(true); setNombreEditarLista(lista.nombre_lista) }}>Editar lista</button>
                                        </div>
                                    </div>
                                ) : (
                                    lista.publica && (
                                        <div className="lista-normal" id={lista.id} key={lista.id}>
                                            {lista.peliculasLista.length > 0 && (
                                                <div className="divPeliListaNormal" key={lista.peliculasLista[0].id}>
                                                    <img src={lista.peliculasLista[0].poster} alt="poster" />
                                                </div>
                                            )}
                                            <div className="nombreListaNormal">
                                                <h5 onClick={() => verLista(lista)}>{lista.nombre_lista}</h5>
                                                <p>{lista.peliculasLista.length} películas</p>
                                            </div>
                                        </div>
                                    )
                                )
                            ))
                        ) : (
                            <div id='noPelis'>
                                {isLoggedIn && userData.id === usuario.id ? (
                                    <p>No has creado ninguna lista</p>
                                ) : (
                                    <p>Este usuario no tiene listas públicas</p>
                                )}
                            </div>
                        )}
                    </div>


                    <div className="bloqueReseñas">
                        {listaReviews && listaReviews.length > 0 ? (
                            listaReviews.map((review) => (
                                <div className="perfil-review" key={review.id} id={review.id}>
                                    <img onClick={() => redireccionarPeli(review.id_pelicula)} src={review.pelicula.poster} alt="poster"></img>
                                    <div className="review-info">
                                        <h3 onClick={() => redireccionarPeli(review.id_pelicula)}>{review.pelicula.title}</h3>
                                        <p className="perfil-review-contenido">{review.contenido}</p>
                                        <p className="perfil-review-fecha">Vista en {review.fecha}</p>
                                        <div className="perfil-review-rating">
                                            <div>
                                                {review.valoracion === 1 ? (
                                                    <div className="nota-comentario-detalle"><FontAwesomeIcon icon={faStar} /></div>
                                                ) : null}
                                                {review.valoracion === 2 ? (
                                                    <div className="nota-comentario-detalle">
                                                        <FontAwesomeIcon icon={faStar} />
                                                        <FontAwesomeIcon icon={faStar} />
                                                    </div>
                                                ) : null}
                                                {review.valoracion === 3 ? (
                                                    <div className="nota-comentario-detalle">
                                                        <FontAwesomeIcon icon={faStar} />
                                                        <FontAwesomeIcon icon={faStar} />
                                                        <FontAwesomeIcon icon={faStar} />
                                                    </div>
                                                ) : null}
                                                {review.valoracion === 4 ? (
                                                    <div className="nota-comentario-detalle">
                                                        <FontAwesomeIcon icon={faStar} />
                                                        <FontAwesomeIcon icon={faStar} />
                                                        <FontAwesomeIcon icon={faStar} />
                                                        <FontAwesomeIcon icon={faStar} />
                                                    </div>
                                                ) : null}
                                                {review.valoracion === 5 ? (
                                                    <div className="nota-comentario-detalle">
                                                        <FontAwesomeIcon icon={faStar} />
                                                        <FontAwesomeIcon icon={faStar} />
                                                        <FontAwesomeIcon icon={faStar} />
                                                        <FontAwesomeIcon icon={faStar} />
                                                        <FontAwesomeIcon icon={faStar} />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div id='noPelis'>
                                {isLoggedIn && userData.id === usuario.id ? (
                                    <p>No has creado ninguna reseña</p>
                                ) : (
                                    <p>Este usuario no tiene reseñas</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div id="infoListasNormales">
                        <div id="infoListasNormalesHijo">
                            <div id="infoListasNormalesHeader">
                                <div id="tituloDivListasNormales">titulo</div>
                                <div id="cruzDivListasNormales" onClick={() => { esconderLista(); setSeleccionar(false) }}>
                                    <FontAwesomeIcon icon={faXmark} /> </div>
                                {isLoggedIn && usuario.id === userData.id &&
                                    <div id="divBotonesLista">
                                        <button id="btnSeleccionarPelis" className={seleccionar ? 'seleccionado' : ''} onClick={seleccionarPelis}><FontAwesomeIcon icon={faPencil} /></button>
                                        <button id="btnAgregarPelis" className={seleccionar ? 'btnDesactivado' : 'btnActivadoAgregar'} disabled={seleccionar} onClick={() => { setShowSearch(true); setSeleccionar(false) }}>Agregar</button>
                                        <button id="btnEliminarPelis" className={seleccionar ? 'btnActivadoEliminar' : 'btnDesactivado'} disabled={!seleccionar} onClick={eliminarPeliculasLista}>Eliminar</button>
                                    </div>
                                }
                                {showSearch && (
                                    <div className="modal">

                                        <div className="modal-content buscador-pelis-perfil">
                                            <div id="cruzDivListasNormales" onClick={() => setShowSearch(false)}>
                                                <FontAwesomeIcon icon={faXmark} />
                                            </div>
                                            <BuscadorPelisLista searchAbierto={cerrarSearch} idLista={idLista} anadirPeliculas={accionPeliculasSeleccionadas} peliculasEnLista={listaPeliculas} className="buscador-pelis" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div id="infoListasNormalesCuerpo">

                            </div>
                        </div>
                    </div>
                    {verCrearLista && (
                        <div className="modal">
                            <div className="modal-content">
                                <div id="cruzDivListasNormales" onClick={() => { setVerCrearLista(false); setNombreListaError(""); setNombreCrearLista(""); }}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                                <label htmlFor="nombreLista">Nombre de la lista: </label>
                                <input type="text" value={nombreCrearLista} onChange={(e) => setNombreCrearLista(e.target.value)} />
                                {nombreListaError && <p style={{ color: "red" }}>{nombreListaError}</p>}
                                <br /><br />
                                <label htmlFor="privacidad">Privacidad de la lista</label>
                                <select id="privacidad" name="privacidad" onChange={(e) => setPublica(e.target.value === 'publica')}>
                                    <option value="publica">Pública</option>
                                    <option value="privada">Privada</option>
                                </select>
                                <button type="submit" onClick={() => crearLista()}>Crear lista</button>
                            </div>
                        </div>
                    )}
                    {verEditarLista && (
                        <div className="modal">
                            <div className="modal-content">
                                <div id="cruzDivListasNormales" onClick={() => { setVerEditarLista(false); setNombreListaError(""); }}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                                <label htmlFor="nombreLista">Nombre de la lista: </label>
                                <input type="text" value={nombreEditarLista} onChange={(e) => setNombreEditarLista(e.target.value)} />
                                {nombreListaError && <p style={{ color: "red" }}>{nombreListaError}</p>}
                                <br /><br />
                                <label htmlFor="privacidad">Privacidad de la lista</label>
                                <select id="privacidad" name="privacidad" onChange={(e) => setPublica(e.target.value === 'publica')} defaultValue={listaActual.publica ? "publica" : "privada"}>
                                    <option value="publica">Pública</option>
                                    <option value="privada">Privada</option>
                                </select>
                                <button type="submit" onClick={() => editarLista(listaActual)}>Actualizar lista</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );

    }

}
export default Perfil;