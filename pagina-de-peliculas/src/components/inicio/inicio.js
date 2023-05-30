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
        objetoReview.idPeli = review.id_pelicula;
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
        <h1 id='titulo-inicio'>Movie Social Media</h1>
        {isLoggedIn && (
          <h4>Bienvenido {userData.nombre_usuario}</h4>
        )}

        <div>
          <Carousel items={items} />
        </div>
        <p className='titular-inicio'>Personas que quizás conozcas</p>
        <div id="divPersonasCercanas">
          {personasCercanas.length > 0 && (
            personasCercanas.map((usuario) => {
              var usuarios = listaUsuarios.find(user => user.nombre_usuario === usuario.nombre_usuario);
              return (
                <div key={usuarios.id} className='usuarios-conocidos-inicio'>
                  <span>{usuario.nombre_usuario}</span><br />
                  <span>{usuario.nombre_completo}</span><br />
                  <BotonSeguir usuario={usuarios} actualizarDatos={undefined} />
                </div>)

            }


            )
          )}
        </div>
        <p className='titular-inicio'>Reseñas de usuarios populares</p>
        <div id="divUsuariosPopulares">
          {Object.keys(groupedReviews).map((username) => {
            return (
              <div key={username}>
                <h3>Usuario: {username}</h3>
                {groupedReviews[username].map((review) => {
                  const pelicula = movieData.find(p => p.id === review.id_pelicula);
                  return (
                    <div key={review.review_id}>
                      <h5>{pelicula.title}</h5>
                      <p>{review.review_contenido}</p>
                      <p>{review.id_pelicula}</p>
                    </div>
                  )
                })}

              </div>
            )
          })}
        </div>
        <div>
          <CarouselPoulares items={cargarReviewsPopulares()} />
        </div>
        <div>
        </div>
        <br />
        <div id="divUltimasReviews">
          {ultimasReviews.map((review) => (
            <div key={review.id}>{review.contenido}</div>
          ))}
        </div>
        <br />
        <div id="divTopLikes">
          {topLikes.map((peli) => {
            const pelicula = movieData.find(p => p.id === peli.pelicula_id);
            if (pelicula) {
              return (<div key={pelicula.id}>{pelicula.title}</div>)
            }
          }
          )}
        </div>
        <br />
        <div id="divTopValoracion">
          {topValoracion.map((peli) => {
            const pelicula = movieData.find(p => p.id === peli.pelicula_id);
            if (pelicula) {
              return (<div key={pelicula.id}>{pelicula.title}</div>)
            }
          }
          )}
        </div>
      </div>

    </div>
  );
};

export default Inicio;
