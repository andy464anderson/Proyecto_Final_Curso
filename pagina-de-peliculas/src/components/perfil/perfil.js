import React from "react";
import "./perfil.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { HeaderContext } from "../header/headerContext";

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
      
    
    if (!usuario || !reviews || !listas || !seguidores || !seguidos) {
        return <div></div>;
    }else{    
        const listaReviews = obtenerReviewsUsuarioConPeliculas(movieData, reviews, usuario.id);
        const listaListas = obtenerTodasLasListasDeUsuario(movieData, listas, usuario.id);
        
        return (
            <div className="perfil-container">
                <div className="perfil-header">
                    <div className="perfil-avatar">
                        <img width={200} height={200} src="sinFoto.png" alt={usuario.nombre_usuario} /> 
                    </div>
                    <div className="perfil-info">
                        <h2>{usuario.nombre_usuario}</h2>
                        <div className="seg">
                            <div className="seguidores" onClick={pintarSeguidores}>
                                <div><u>Seguidores</u></div>
                                <div>{seguidores.length}</div>                                
                            </div>
                            |
                            <div className="seguidos" onClick={pintarSeguidos}>
                                <div><u>Seguidos</u></div>
                                <div>{seguidos.length}</div>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="perfil-body">
                    <div className="todas_listas">
                        <h2>Listas:</h2>
                        {listaListas.map((lista) => (
                            <div className="lista" id={lista.id} key={lista.id}>
                                <div><strong><u>{lista.nombre_lista}</u></strong></div>
                                <div>{lista.tipo}</div>
                                {lista.peliculas.map(peli => {
                                    return(
                                        <div className="divPeliLista" key={peli.id} id={peli.id}>
                                            <div><strong>{peli.title}</strong></div>
                                            <div>{peli.release_date}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                        
                    </div>
                    <div className="bloqueReseñas">
                        <h2>Reseñas:</h2>
                        {listaReviews.map((review) => (
                            <div className="perfil-review" key={review.id} id={review.id}>
                                <div>
                                    <div className="divPeliReview"><strong><u>{review.pelicula.title}</u></strong></div>                           
                                    <div>{review.fecha}</div>
                                    <div>{review.contenido}</div>
                                    <div className="perfil-review-rating">{review.valoracion}/10</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Perfil;