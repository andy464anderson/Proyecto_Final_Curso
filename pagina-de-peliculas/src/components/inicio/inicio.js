import React, { useEffect, useState, useContext } from 'react';
import './inicio.css';
import { HeaderContext } from "../header/headerContext";
import Carousel from './carousel';
import CarouselPoulares from './carousel_populares';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Inicio = () => {
  const navigate = useNavigate();
  const [usuariosPopulares, setUsuariosPopulares] = useState([]);
  const [ultimasReviews, setReviews] = useState([]);
  const [topLikes, setTopLikes] = useState([]);
  const [topValoracion, setTopValoracion] = useState([]);
  const [personasCercanas, setPersonasCercanas] = useState([]);
  const [actividadSeguidos, setActividadSeguidos] = useState([]);
  const [listaUsuarios, setUsuarios] = useState([]);
  const [seguidos, setSeguidos] = useState([]);
  const { reviewData, updateReviewData, userData, isLoggedIn, updateMovieData, movieData, dataUsuarios, popularesUsuarios, updatePopularesUsuarios, topLikesPeliculas, updateTopLikesPeliculas, mejorValoradas, updateMejorValoradas } = useContext(HeaderContext);

  useEffect(() => {
    const obtenerPeliculas = async () => {
      const data = await fetch('https://13.48.181.115/peliculas', {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      })
      var peliculas = await data.json();
      updateMovieData(peliculas);
    };

    if (movieData === null) {
      obtenerPeliculas();
    }

  }, []);

  useEffect(() => {
    
    if(dataUsuarios !== null && dataUsuarios.length > 0)
    setUsuarios(dataUsuarios);


    const obtenerDatosSeguidos = async () => {
      const responseSiguiendo = await fetch(`https://13.48.181.115/seguidos/${userData.id}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      const dataSeguidos = await responseSiguiendo.json();
      setSeguidos(dataSeguidos);

    };

    if (isLoggedIn) {
      obtenerDatosSeguidos();
    }

    const obtenerDatosActividad = async () => {
      const responseActividad = await fetch(`https://13.48.181.115/actividad/${userData.id}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      const dataActividad = await responseActividad.json();
      setActividadSeguidos(dataActividad);

    };

    if (isLoggedIn) {
      obtenerDatosActividad();
    } else if (!actividadSeguidos && !isLoggedIn) {
      setActividadSeguidos([]);
    }

    const obtenerUsuariosPopulares = async () => {
      if ((!usuariosPopulares || usuariosPopulares.length === 0) && popularesUsuarios == null) {
        const usuariosPopulares = await fetch(`https://13.48.181.115/populares`);
        const dataUsuariosPopulares = await usuariosPopulares.json();
        updatePopularesUsuarios(dataUsuariosPopulares);
        setUsuariosPopulares(dataUsuariosPopulares);
      }else{
        setUsuariosPopulares(popularesUsuarios);
      }

      if ((!topLikes || topLikes.length===0) && topLikesPeliculas == null) {
        const topLikes = await fetch(`https://13.48.181.115/toplikes`);
        const dataTopLikes = await topLikes.json();
        updateTopLikesPeliculas(dataTopLikes);
        setTopLikes(dataTopLikes);
      }else{
        setTopLikes(topLikesPeliculas);
      }

      if ((!topValoracion || topValoracion.length === 0) && mejorValoradas == null) {
        const topValoracion = await fetch(`https://13.48.181.115/topvaloracion`);
        const datatopValoracion = await topValoracion.json();
        updateMejorValoradas(datatopValoracion);
        setTopValoracion(datatopValoracion);
      }else{
        setTopValoracion(mejorValoradas);
      }


      if ((!ultimasReviews || ultimasReviews.length === 0) && !reviewData) {
        const ultimasReviews = await fetch(`https://13.48.181.115/reviews`);
        const dataUltimasReviews = await ultimasReviews.json();
        setReviews(dataUltimasReviews);
        updateReviewData(reviewData)
      }else{
        setReviews(reviewData)
      }


      if ((!personasCercanas || personasCercanas.length === 0)  && isLoggedIn) {
        const personasCercanas = await fetch(`https://13.48.181.115/cercanas/${userData.id}`);
        const dataPersonasCercanas = await personasCercanas.json();
        var dataFiltrado = dataPersonasCercanas.filter((data) => data.id_usuario !== userData.id);
        setPersonasCercanas(dataFiltrado);
      } else if (!personasCercanas && !isLoggedIn) {
        setPersonasCercanas([]);
      }
    };

    obtenerUsuariosPopulares();
  }, []);

  const items = [
    {
      imageUrl: 'cannes.jpg',
      titulo: 'Todo sobre el festival de Cannes',
      contenido: 'Sumérgete en el prestigioso festival de Cannes y conoce las últimas noticias'
    },
    {
      imageUrl: '100-Greatest-Movies-Variety.jpg',
      titulo: 'Top 50 películas de la historia',
      contenido: 'Explora una selección de las películas más aclamadas y memorables en la historia del cine'
    },
    {
      imageUrl: 'estrenos.jpeg',
      titulo: 'Próximos estrenos de 2023',
      contenido: 'Echa un vistazo a los próximos estrenos cinematográficos de este año'
    },
  ];


  const groupedReviews = {};

  // Agrupar las reviews por usuario
  usuariosPopulares.forEach((usuario) => {
    if (groupedReviews.hasOwnProperty(usuario.nombre_usuario)) {
      groupedReviews[usuario.nombre_usuario].push(usuario);
    } else {
      groupedReviews[usuario.nombre_usuario] = [usuario];
    }
  });

  const cargarReviewsPopulares = () => {
    var lista = [];
    Object.keys(groupedReviews).map((username) => {
      var objetoUsuarioPopular = {};
      objetoUsuarioPopular.usuario = username;
      var listaReviews = [];

      groupedReviews[username].map((review, i) => {
        var objetoReview = {};
        objetoReview.contenido = review.review_contenido;
        objetoReview.valoracion = review.review_valoracion;
        objetoReview.idPeli = review.id_pelicula;
        objetoReview.num_seguidores = review.num_seguidores;
        objetoReview.nombre_completo = review.nombre_completo;
        listaReviews.push(objetoReview);
      });
      objetoUsuarioPopular.listaReviews = listaReviews;
      lista.push(objetoUsuarioPopular);
    });
    return lista;
  }


    return (
      <div>
        <div id='central-inicio'>
          <p className='breadcrumb'><span>Inicio</span></p>
          <h1 id='titulo-inicio'>Movie Social Media</h1>
          {isLoggedIn && (
            <h4 id='subtitulo-inicio'>Bienvenido {userData.nombre_usuario}</h4>
          )}

          <div>
            <Carousel items={items} />
          </div>
          {movieData && isLoggedIn && actividadSeguidos && actividadSeguidos.length > 0 && seguidos && seguidos.length > 0 && (
            <div>
              <p className='titular-inicio'>Actividad de tus amigos</p>
              <div id="actividadSeguidores">
                {actividadSeguidos.map((review, i) => {
                  const pelicula = movieData.find(p => p.id === review.id_pelicula);
                  if (pelicula) {
                    return (
                      <div key={review.id} className='actividad-seguidores-hijo'>
                        <img onClick={() => navigate(`/detalle/${review.id_pelicula}`)} style={{ cursor: "pointer" }} className='actividad-seguidores-foto' src={pelicula.poster} alt={pelicula.title}></img>
                        <p onClick={() => navigate(`/perfil/${review.nombre_usuario}`)} className='nombrePersonaActividad'>{review.nombre_usuario}</p>
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

                      </div>)
                  }

                })

                }


              </div>
            </div>
          )}

          <div id='titulares-coincidentes'>
            <p className='titular-inicio titular-populares'>Usuarios populares</p>
            {isLoggedIn && personasCercanas.length > 0 && (
              <p className='titular-inicio titular-cercanas'>Personas que quizás conozcas</p>
            )}
          </div>
          <div>
            {movieData && cargarReviewsPopulares().length > 0 && (
              <CarouselPoulares items={cargarReviewsPopulares()} />
            )}
          </div>

          <div>
            <p className='titular-inicio'>Las favoritas de los usuarios</p>
            <div id="divTopLikes">
              {movieData && topLikes && topLikes.length > 0 && (
                topLikes.map((peli, i) => {
                  const pelicula = movieData.find(p => p.id === peli.pelicula_id);
                  if (pelicula) {
                    return (
                      <div key={pelicula.id} className='cuerpo-top-likes' >
                        <div className='padre-foto-tops'>
                          <img className='imagen-top' src={pelicula.poster} alt={pelicula.title}></img>
                          <span className='puntuacion-general'>{peli.total_likes} likes</span>
                        </div>
                        <span className='posicion-top'>{i + 1}</span>
                        <span onClick={() => navigate(`/detalle/${pelicula.id}`)} className='top-titulo'>{pelicula.title}</span>
                      </div>)
                  }
                })
              )}
            </div>

            <p className='titular-inicio'>Las mejor valoradas por los usuarios</p>
            <div id="divTopValoracion">
              {movieData && topValoracion && topValoracion.length > 0 && (
                topValoracion.map((peli, i) => {
                  const pelicula = movieData.find(p => p.id === peli.pelicula_id);
                  if (pelicula) {
                    const valoracion = peli.valoracion_media % 1 === 0 ? peli.valoracion_media.toFixed(0) : peli.valoracion_media.toFixed(2);
                    return (
                      <div key={pelicula.id} className='cuerpo-top-valoracion'>
                        <div className='padre-foto-tops'>
                          <img className='imagen-top' src={pelicula.poster} alt={pelicula.title}></img>
                          <span className='puntuacion-general'>{valoracion}/5</span>
                        </div>
                        <span className='posicion-top'>{i + 1}</span>
                        <span onClick={() => navigate(`/detalle/${pelicula.id}`)} className='top-titulo'>{pelicula.title}</span>
                      </div>
                    );
                  }
                  return null;
                })
              )}
            </div>
          </div>

        </div>

      </div>
    );
  
};

export default Inicio;
