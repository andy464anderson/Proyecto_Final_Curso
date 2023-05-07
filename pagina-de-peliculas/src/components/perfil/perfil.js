import React from "react";
import "./perfil.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { HeaderContext } from "../header/headerContext";
import $ from 'jquery';

function Perfil() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [listas, setListas] = useState([]);
    const [seguidores, setSeguidores] = useState([]);
    const [seguidos, setSeguidos] = useState([]);
    const { movieData } = useContext(HeaderContext);
    const nombre_usuario = window.location.pathname.split("/")[2];

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

            // obtener las reseñas del usuario
            const responseReviews = await fetch(`http://localhost:8000/reviews/usuario/${dataUsuario.id}`);
            const dataReviews = await responseReviews.json();
            setReviews(dataReviews);

            // obtener las listas del usuario
            const responseListas = await fetch(`http://localhost:8000/listas/${dataUsuario.id}`);
            const dataListas = await responseListas.json();
            setListas(dataListas);

            // obtener las listas del usuario
            const responseSeguidores = await fetch(`http://localhost:8000/seguidores/${dataUsuario.id}`);
            const dataSeguidores = await responseSeguidores.json();
            setSeguidores(dataSeguidores);

            // obtener las listas del usuario
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
          return {...lista, peliculas: peliculasLista};
        });
      
        return listasConPeliculas;
    }   

    function verLista(lista){
        $("#infoListasNormales").show();
        $("#tituloDivListasNormales").html(`${lista.nombre_lista}`);
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
    if (!usuario || !reviews || !listas || !seguidores || !seguidos) {
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
                        <button>Editar perfil</button>
                    </div>
                    <div className="perfil-info">
                        <table className="seg">
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
                                {lista.peliculas.map(peli => {
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
{/*                                 {lista.peliculas.map(peli => {
                                    

                                })} */}
                                <div className="divPeliListaNormal" key={lista.peliculas[0].id} id={lista.peliculas[0].id}>
                                    <img src={lista.peliculas[0].poster} alt="poster"></img>
                                </div>
                                <div className="nombreListaNormal">
                                    <h5 onClick={() => verLista(lista)}>{lista.nombre_lista}</h5>
                                    <p>{lista.peliculas.length} películas</p>
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
                                <div id="cruzDivListasNormales" onClick={esconderLista}> x </div>
                            </div>
                            <div id="infoListasNormalesCuerpo">
                                pinta tú las pelis son las 2 de la mañana estoy cansado
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
        
    }

}
export default Perfil;