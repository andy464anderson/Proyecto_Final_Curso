import React from "react";
import "./perfil.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { HeaderContext } from "../header/headerContext";
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import BuscadorPelisLista from "./buscadorPelisLista";

function Perfil() {
    const navigate = useNavigate();
    const [siguiendo, setSiguiendo] = useState(null);
    const [idLista, setIdLista] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [listas, setListas] = useState([]);
    const [seguidores, setSeguidores] = useState([]);
    const [seguidos, setSeguidos] = useState([]);
    const [listaPeliculas, setListaPeliculas] = useState([]);
    const [listaActual, setListaActual] = useState({});
    const { movieData, userData, updateHeader, updateMovieData } = useContext(HeaderContext);
    const nombre_usuario = window.location.pathname.split("/")[2];
    const [showSearch, setShowSearch] = useState(false);
    const [pelisSeleccionadas, setPelisSeleccionadas] = useState([]);
    const [verEditarLista, setVerEditarLista] = useState(false);
    const [verCrearLista, setVerCrearLista] = useState(false);
    const [verEditarPerfil, setVerEditarPerfil] = useState(false);
    const [nombreEditarLista, setNombreEditarLista] = useState("");
    const [nombreCrearLista, setNombreCrearLista] = useState("");
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [publica, setPublica] = useState(false);
    const [error, setError] = useState(false);
    const [envioEditar, setEnvioEditar] = useState(false);

    useEffect(() => {
        const obtenerPeliculas = async () => {
            const data = await fetch('http://localhost:8000/peliculas', {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                }
            })
            var peliculas = await data.json();
            updateMovieData(peliculas)
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
            setCorreo(dataUsuario.correo);

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

            if (userData) {
                const responseSiguiendo = await fetch(`http://localhost:8000/seguidos/${userData.id}`);
                const dataSiguiendo = await responseSiguiendo.json();
                if (dataSiguiendo.find(user => user.id_usuario_seguido == dataUsuario.id)) {
                    setSiguiendo(true);
                } else {
                    setSiguiendo(false);
                }
            }
        };
        obtenerDatosUsuario();
    }, [nombre_usuario, userData.id]);

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

        if (usuario.id == userData.id) {
            $(".imagenLista").on("click", function () {
                const id = $(this).attr('id');
                seleccionarPeli(id);
            });
        }

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

    const dejarDeSeguir = async (id_usuario_seguidor, id_usuario_seguido) => {
        const dejarSeguir = await fetch(`http://localhost:8000/seguidor/${id_usuario_seguidor}/${id_usuario_seguido}`, {
            method: "DELETE"
        });

        const responseSeguidores = await fetch(`http://localhost:8000/seguidores/${usuario.id}`);
        const dataSeguidores = await responseSeguidores.json();
        setSeguidores(dataSeguidores);

        const responseSeguidos = await fetch(`http://localhost:8000/seguidos/${usuario.id}`);
        const dataSeguidos = await responseSeguidos.json();
        setSeguidos(dataSeguidos);
        setSiguiendo(false);
    }


    const seguir = async (id_usuario_seguidor, id_usuario_seguido) => {
        const userSeguido = {
            id_usuario_seguidor,
            id_usuario_seguido
        };

        const response = await fetch("http://localhost:8000/seguidor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userSeguido),
        });


        const responseSeguidores = await fetch(`http://localhost:8000/seguidores/${usuario.id}`);
        const dataSeguidores = await responseSeguidores.json();
        setSeguidores(dataSeguidores);

        const responseSeguidos = await fetch(`http://localhost:8000/seguidos/${usuario.id}`);
        const dataSeguidos = await responseSeguidos.json();
        setSeguidos(dataSeguidos);
        setSiguiendo(true);
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
        console.log(dataResponse);

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
        if (lista.nombre_lista != nombreEditarLista || lista.publica != publica) {
            const editarLista = {
                nombre_lista: nombreEditarLista,
                publica: publica
            }

            const response = await fetch(`http://localhost:8000/lista/${lista.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editarLista),
            });
            const dataResponse = await response.json();
            console.log(dataResponse);

            const responseListas = await fetch(`http://localhost:8000/listas/${usuario.id}`);
            const dataListas = await responseListas.json();
            setListas(dataListas);
            setVerEditarLista(false);
        } else {
            alert("No ha modificado nada");
            setVerEditarLista(false);
        }
    }

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
            console.log(dataResponse);

            const responseListas = await fetch(`http://localhost:8000/listas/${usuario.id}`);
            const dataListas = await responseListas.json();
            setListas(dataListas);
            setVerCrearLista(false);
        } else {
            alert("El nombre no puede estar vacío");
        }
    }

    const comprobarEditarPerfil = async () => {
        if (correo != userData.correo || nombreCompleto != userData.nombre_completo || nombreUsuario != userData.nombre_usuario) {
            const responseUsuarios = await fetch(`http://localhost:8000/usuarios`);
            const dataUsuarios = await responseUsuarios.json();

            const listaExisteUsuario = dataUsuarios.filter(usuario => usuario.nombre_usuario == nombreUsuario && userData.nombre_usuario != nombreUsuario);
            const listaExisteCorreo = dataUsuarios.filter(usuario => usuario.correo == correo && userData.correo != correo);

            if (listaExisteUsuario.length > 0) {
                alert('El nombre de usuario ya existe');
                setError(true);
            }

            if (listaExisteCorreo.length > 0) {
                alert('Ya existe una cuenta con ese correo electrónico');
                setError(true);
            }


            if (nombreCompleto.length < 3) {
                alert('El nombre debe tener al menos 3 caracteres');
                setError(true);
            }

            if (nombreUsuario.length < 3) {
                alert('El nombre de usuario debe tener al menos 3 caracteres');
                setError(true);
            }

            if (!correo.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
                alert('El formato del correo no es válido');
                setError(true);
            }

            setEnvioEditar(true);
        } else {
            alert("No se ha modificado nada");
        }        
    }

    const editarPerfil = async () => {
        if (envioEditar) {
            if (error == false) {
                const Usuario = {
                    id: userData.id,
                    correo: correo,
                    clave: userData.clave,
                    rol: userData.rol,
                    nombre_usuario: nombreUsuario,
                    nombre_completo: nombreCompleto
                }

                const response = await fetch(`http://localhost:8000/usuario/${userData.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(Usuario),
                });
                const dataResponse = await response.json();
                setNombreUsuario(dataResponse.nombre_usuario);
                setNombreCompleto(dataResponse.nombre_completo);
                setCorreo(dataResponse.correo);
                updateHeader(true, dataResponse);
                navigate(`/perfil/${dataResponse.nombre_usuario}`);
                setVerEditarPerfil(false);
            }
        }
        setError(false);
        setEnvioEditar(false);
    }

    useEffect(()=>{
        editarPerfil();
    }, [envioEditar]);

    if (!usuario || !reviews || !listas || !seguidores || siguiendo == null) {
        return <div></div>;
    } else {
        const listaReviews = obtenerReviewsUsuarioConPeliculas(movieData, reviews, usuario.id);
        const listaListas = obtenerTodasLasListasDeUsuario(movieData, listas, usuario.id);
        const listaNormalSinOrdenar = listaListas.filter((lista) => lista.tipo === "normal");
        const listaNormal = listaNormalSinOrdenar.sort((a, b) => {
            if (a.nombre_lista > b.nombre_lista) return 1;
            else return -1;
        });
        const listaLikes = listaListas.filter((lista) => lista.tipo === "likes");
        return (
            <div className="perfil-container">
                <div className="perfil-header">
                    <div className="perfil-avatar">
                        <img width={200} height={200} src="sinFoto.png" alt={usuario.nombre_usuario} />
                        <h2>{nombreCompleto}</h2>
                        <h5>{nombreUsuario}</h5>
                        {usuario.id === userData.id &&
                            <button onClick={() => setVerEditarPerfil(true)}>Editar perfil</button>
                        }
                        {usuario.id !== userData.id && siguiendo === true &&
                            <button onClick={() => dejarDeSeguir(userData.id, usuario.id)}>Dejar de seguir</button>
                        }
                        {usuario.id !== userData.id && siguiendo === false &&
                            <button onClick={() => seguir(userData.id, usuario.id)}>Seguir</button>
                        }
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
                        {listaLikes.map((lista) => (
                            <div className="lista-likes-hijo" id={lista.id} key={lista.id}>
                                {lista.peliculasLista.map(peli => {
                                    return (
                                        <div className="divPeliListaLike" key={peli.id} id={peli.id}>
                                            <img onClick={() => redireccionarPeli(peli.id)} src={peli.poster} alt="poster"></img>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                    <div className="listas-normales">
                        {usuario.id === userData.id && (
                            <button type="button" onClick={() => { setVerCrearLista(true) }}>Crear nueva lista</button>
                        )}
                        {listaNormal.map((lista) => (
                            (usuario.id === userData.id) ? (
                                <div className="lista-normal" id={lista.id} key={lista.id}>
                                    {lista.peliculasLista.length > 0 && (
                                        <div className="divPeliListaNormal" key={lista.peliculasLista[0].id}>
                                            <img src={lista.peliculasLista[0].poster} alt="poster" />
                                        </div>
                                    )}
                                    <div className="nombreListaNormal">
                                        <h5 onClick={() => verLista(lista)}>{lista.nombre_lista}</h5>
                                        <p>{lista.peliculasLista.length} películas</p>
                                        <button type="button" onClick={() => eliminarLista(lista.id)}>Eliminar lista</button>
                                        <button type="button" onClick={() => { setListaActual(lista); setVerEditarLista(true); setNombreEditarLista(lista.nombre_lista) }}>Editar lista</button>
                                    </div>
                                </div>
                            ) :
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
                        ))}
                    </div>
                    <div className="bloqueReseñas">
                        {listaReviews.map((review) => (
                            <div className="perfil-review" key={review.id} id={review.id}>
                                <img onClick={() => redireccionarPeli(review.id_pelicula)} src={review.pelicula.poster} alt="poster"></img>
                                <div className="review-info">
                                    <h3 onClick={() => redireccionarPeli(review.id_pelicula)}>{review.pelicula.title}</h3>
                                    <p className="perfil-review-contenido">{review.contenido}</p>
                                    <p className="perfil-review-fecha">Vista en {review.fecha}</p>
                                    <p className="perfil-review-rating">{review.valoracion}/10</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div id="infoListasNormales">
                        <div id="infoListasNormalesHijo">
                            <div id="infoListasNormalesHeader">
                                <div id="tituloDivListasNormales">titulo</div>
                                <div id="cruzDivListasNormales" onClick={esconderLista}>
                                    <FontAwesomeIcon icon={faXmark} /> </div>
                                {usuario.id === userData.id &&
                                    <div id="divBotonesLista">
                                        <button onClick={() => setShowSearch(true)}>Agregar películas a la lista</button>
                                        <button onClick={eliminarPeliculasLista}>Eliminar las películas seleccionadas</button>
                                    </div>
                                }
                                {showSearch && (
                                    <div className="modal">
                                        <div id="cruzDivListasNormales" onClick={() => setShowSearch(false)}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </div>
                                        <div className="modal-content">
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
                            <div id="cruzDivListasNormales" onClick={() => setVerCrearLista(false)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                            <div className="modal-content">
                                <label htmlFor="nombreLista">Nombre de la lista: </label>
                                <input type="text" value={nombreCrearLista} onChange={(e) => setNombreCrearLista(e.target.value)} />
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
                            <div id="cruzDivListasNormales" onClick={() => setVerEditarLista(false)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                            <div className="modal-content">
                                <label htmlFor="nombreLista">Nombre de la lista: </label>
                                <input type="text" value={nombreEditarLista} onChange={(e) => setNombreEditarLista(e.target.value)} />
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
                    {verEditarPerfil && (
                        <div className="modal">
                            <div className="modal-content">
                                <div id="cruzDivListasNormales" onClick={() => {
                                    setVerEditarPerfil(false); setNombreCompleto(userData.nombre_completo); setNombreUsuario(userData.nombre_usuario); setCorreo(userData.correo); setError(false); setEnvioEditar(false);
                                }}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                                <label htmlFor="nombreCompleto">Nombre completo: </label>
                                <input id="nombreCompleto" type="text" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
                                <br /><br />
                                <label htmlFor="nombreUsuario">Nombre de usuario: </label>
                                <input id="nombreUsuario" type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
                                <br /><br />
                                <label htmlFor="correo">Correo electrónico: </label>
                                <input id="correo" type="text" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                                <br /><br />
                                <button type="submit" onClick={comprobarEditarPerfil}>Editar perfil</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        );

    }

}
export default Perfil;