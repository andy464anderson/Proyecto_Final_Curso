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
    const [listaActual, setListaActual] = useState([]);
    const { movieData, userData } = useContext(HeaderContext);
    const nombre_usuario = window.location.pathname.split("/")[2];
    const [showSearch, setShowSearch] = useState(false);

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

            const responseSiguiendo = await fetch(`http://localhost:8000/seguidos/${userData.id}`);
            const dataSiguiendo = await responseSiguiendo.json();
            if(dataSiguiendo.find(user => user.id_usuario_seguido == dataUsuario.id)){
                setSiguiendo(true);
            }else{
                setSiguiendo(false);
            }
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
          return {...lista, peliculasLista: peliculasLista};
        });
      
        return listasConPeliculas;
    }   

    function verLista(lista){
        $("#infoListasNormales").show();
        $("#tituloDivListasNormales").html(`${lista.nombre_lista}`);
        $("#infoListasNormalesCuerpo").html(`        
        ${lista.peliculasLista.map(peli => {
            return `
                <div class="imagenLista">
                    <img src=${peli.poster}></img>
                </div>
            `
        })}
        `);
        var pelisEnLista = [];
        lista.peliculas.map(idPeli => {
            pelisEnLista.push(idPeli);
        });
        setListaPeliculas(pelisEnLista);
        setIdLista(lista.id);
        setListaActual(lista);
    }     

    function esconderLista(){
        $("#infoListasNormales").hide();
    }
    
    function mostrarLikes(){
        $(".listas-likes").show();
        $(".listas-normales").hide();
        $(".bloqueReseñas").hide();
        $("#botonLikes").css({
        "background-color": "#262d34",
        "border-top": "2px solid #262d34",
        "border-bottom": "2px solid #40BCF4",
        "color": "#40BCF4"});
        $("#botonListas").css({
        "background-color": "#14181C",
        "border-top": "2px solid #14181C",
        "border-bottom": "2px solid #14181C",
        "color": "#8595A3"});
        $("#botonReviews").css({
        "background-color": "#14181C",
        "border-top": "2px solid #14181C",
        "border-bottom": "2px solid #14181C",
        "color": "#8595A3"});

    }
    function mostrarListas(){
        $(".listas-likes").hide();
        $(".listas-normales").show();
        $(".bloqueReseñas").hide();
        $("#botonListas").css({
        "background-color": "#262d34",
        "border-top": "2px solid #262d34",
        "border-bottom": "2px solid #40BCF4",
        "color": "#40BCF4"});
        $("#botonLikes").css({
        "background-color": "#14181C",
        "border-top": "2px solid #14181C",
        "border-bottom": "2px solid #14181C",
        "color": "#8595A3"});
        $("#botonReviews").css({
        "background-color": "#14181C",
        "border-top": "2px solid #14181C",
        "border-bottom": "2px solid #14181C",
        "color": "#8595A3"});
    }
    function mostrarReviews(){
        $(".listas-likes").hide();
        $(".listas-normales").hide();
        $(".bloqueReseñas").show(); 
        $("#botonReviews").css({
        "background-color": "#262d34",
        "border-top": "2px solid #262d34",
        "border-bottom": "2px solid #40BCF4",
        "color": "#40BCF4"});     
        $("#botonListas").css({
        "background-color": "#14181C",
        "border-top": "2px solid #14181C",
        "border-bottom": "2px solid #14181C",
        "color": "#8595A3"});
        $("#botonLikes").css({
        "background-color": "#14181C",
        "border-top": "2px solid #14181C",
        "border-bottom": "2px solid #14181C",
        "color": "#8595A3"}); 
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

    const anadirPeliculasSeleccionadas = async (pelisSeleccionadas) => {
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
        if(listaPeliculas.length > 0){
            const nuevaListaHTML = listaActual.peliculasLista.map(peli => {
                return `
                  <div class="imagenLista">
                    <img src=${peli.poster}></img>
                  </div>
                `;
              }).join('');
              $("#infoListasNormalesCuerpo").html(nuevaListaHTML);
        }        
    }, [listaPeliculas]);

    const cerrarSearch = (cerrar) => {
        setShowSearch(cerrar);
    }

    if (!usuario || !reviews || !listas || !seguidores || siguiendo == null) {
        return <div></div>;
    }else{
        const listaReviews = obtenerReviewsUsuarioConPeliculas(movieData, reviews, usuario.id);
        const listaListas = obtenerTodasLasListasDeUsuario(movieData, listas, usuario.id);
        const listaNormal = listaListas.filter((lista) => lista.tipo === "normal");
        const listaLikes = listaListas.filter((lista) => lista.tipo === "likes");
        return (
            <div className="perfil-container">
                <div className="perfil-header">
                    <div className="perfil-avatar">
                        <img width={200} height={200} src="sinFoto.png" alt={usuario.nombre_usuario} /> 
                        <h2>{usuario.nombre_completo}</h2>
                        <h5>{usuario.nombre_usuario}</h5>
                        {usuario.id === userData.id &&
                            <button>Editar perfil</button>
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
                                    return(
                                        <div className="divPeliListaLike" key={peli.id} id={peli.id}>
                                            <img src={peli.poster} alt="poster"></img>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                    <div className="listas-normales">
                        {listaNormal.map((lista) => (
                            <div className="lista-normal" id={lista.id} key={lista.id}>
                                {lista.peliculasLista.map(peli => {
                                    

                                })}
                                {lista.peliculasLista.length > 0 && (
                                    <div className="divPeliListaNormal" key={lista.peliculasLista[0].id}>
                                        <img src={lista.peliculasLista[0].poster} alt="poster"></img>
                                    </div>
                                )}
                                
                                <div className="nombreListaNormal">
                                    <h5 onClick={() => verLista(lista)}>{lista.nombre_lista}</h5>
                                    <p>{lista.peliculasLista.length} películas</p>
                                </div>
                                

                            </div>
                        ))}
                    </div>
                    <div className="bloqueReseñas">
                        {listaReviews.map((review) => (
                            <div className="perfil-review" key={review.id} id={review.id}>
                                <img src={review.pelicula.poster} alt="poster"></img>
                                <div className="review-info">
                                    <h3>{review.pelicula.title}</h3>
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
                                <button onClick={() => setShowSearch(true)}>Agregar películas a la lista</button>
                                {showSearch && (
                                    <div className="modal">
                                        <div id="cruzDivListasNormales" onClick={() => setShowSearch(false)}> 
                                            <FontAwesomeIcon icon={faXmark} /> 
                                        </div>
                                        <div className="modal-content">
                                            <BuscadorPelisLista searchAbierto={cerrarSearch} idLista={idLista} anadirPeliculas={anadirPeliculasSeleccionadas} peliculasEnLista={listaPeliculas} className="buscador-pelis" />
                                        </div>
                                    </div>                                    
                                )}
                            </div>
                            <div id="infoListasNormalesCuerpo">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
        
    }

}
export default Perfil;