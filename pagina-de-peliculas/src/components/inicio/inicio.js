import React, { useEffect, useState, useContext } from 'react';
import './inicio.css';
import { HeaderContext } from "../header/headerContext";
import Carousel from './carousel';
import CarouselPoulares from './carousel_populares';
import BotonSeguir from "../botonSeguir/botonSeguir";

const Inicio = () => {
  const [usuariosPopulares, setUsuariosPopulares] = useState([]);
  const [listaReviews, setListaReviews] = useState([]);
  const [ultimasReviews, setReviews] = useState([]);
  const [topLikes, setTopLikes] = useState([]);
  const [topValoracion, setTopValoracion] = useState([]);
  const [personasCercanas, setPersonasCercanas] = useState([]);
  const [listaUsuarios, setUsuarios] = useState([]);
  const { userData, isLoggedIn, updateMovieData, movieData } = useContext(HeaderContext);
  const [listaObjetosPopular, setListaObjetosPopular] = useState([]);

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

  }, []);
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
    const obtenerUsuariosPopulares = async () => {


      const usuariosPopulares = await fetch(`http://localhost:8000/populares`);
      const dataUsuariosPopulares = await usuariosPopulares.json();
      setUsuariosPopulares(dataUsuariosPopulares);

      const ultimasReviews = await fetch(`http://localhost:8000/reviews`);
      const dataUltimasReviews = await ultimasReviews.json();
      setReviews(dataUltimasReviews);

      const topLikes = await fetch(`http://localhost:8000/toplikes`);
      const dataTopLikes = await topLikes.json();
      setTopLikes(dataTopLikes);

      const topValoracion = await fetch(`http://localhost:8000/topvaloracion`);
      const datatopValoracion = await topValoracion.json();
      setTopValoracion(datatopValoracion);
      if (isLoggedIn) {
        const personasCercanas = await fetch(`http://localhost:8000/cercanas/${userData.id}`);
        const dataPersonasCercanas = await personasCercanas.json();
        var dataFiltrado = dataPersonasCercanas.filter(data => data.id_usuario !== userData.id);
        setPersonasCercanas(dataFiltrado);
      } else {
        setPersonasCercanas([]);
      }
    };
    obtenerUsuariosPopulares();
  }, [isLoggedIn]);
  const items = [
    {
      imageUrl: 'bergman.jpg',
      titulo: 'Top 50 películas de la historia',
      contenido: 'Explora una selección de las películas más aclamadas y memorables en la historia del cine'
    },
    {
      imageUrl: 'cannes.jpg',
      titulo: 'Todo sobre el festival de Cannes',
      contenido: 'Sumérgete en el prestigioso festival de Cannes y conoce las últimas noticias'
    },
    {
      imageUrl: 'estrenos.jpeg',
      titulo: 'Próximos estrenos de 2023',
      contenido: 'Echa un vistazo a los próximos estrenos cinematográficos de este año'
    },
    // Agrega más elementos aquí
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

  if (movieData) {
    return (
      <div>
        <div id='central-inicio'>
          <h1 id='titulo-inicio'>Movie Social Media</h1>
          {isLoggedIn && (
            <h4 id='subtitulo-inicio'>Bienvenido {userData.nombre_usuario}</h4>
          )}

          <div>
            <Carousel items={items} />
          </div>
          <div id='titulares-coincidentes'>
            <p className='titular-inicio titular-populares'>Usuarios populares</p>
            <p className='titular-inicio titular-cercanas'>Personas que quizás conozcas</p>
          </div>

          <div>
            <CarouselPoulares items={cargarReviewsPopulares()} />
          </div>

          <div>
            <p className='titular-inicio'>Las favoritas de los usuarios</p>
            <div id="divTopLikes">
              {topLikes.map((peli, i) => {
                const pelicula = movieData.find(p => p.id === peli.pelicula_id);
                if (pelicula) {
                  return (
                    <div key={pelicula.id} className='cuerpo-top-likes' >
                      <div className='padre-foto-tops'>
                        <img className='imagen-top' src={pelicula.poster} alt={pelicula.title}></img>
                        <span className='puntuacion-general'>{peli.total_likes} likes</span>
                      </div>
                      <span className='posicion-top'>{i + 1}</span>
                      <span>{pelicula.title}</span>
                    </div>)
                }
              }
              )}
            </div>

            <p className='titular-inicio'>Las mejor valoradas por los usuarios</p>
            <div id="divTopValoracion">
              {topValoracion.map((peli, i) => {
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
                      <span>{pelicula.title}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

        </div>

      </div>
    );
  }
};

export default Inicio;
