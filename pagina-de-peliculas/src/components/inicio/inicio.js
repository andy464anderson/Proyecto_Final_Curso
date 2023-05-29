import React, { useEffect, useState, useContext } from 'react';
import './inicio.css';
import { HeaderContext } from "../header/headerContext";
import Carousel from './carousel';

const Inicio = () => {
  const [usuariosPopulares, setUsuariosPopulares] = useState([]);
  const [listaReviews, setListaReviews] = useState([]);
  const [ultimasReviews, setReviews] = useState([]);
  const [topLikes, setTopLikes] = useState([]);
  const [topValoracion, setTopValoracion] = useState([]);
  const [personasCercanas, setPersonasCercanas] = useState([]);
  const {userData, isLoggedIn, updateMovieData, movieData} = useContext(HeaderContext);
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

      if(isLoggedIn){
        const personasCercanas = await fetch(`http://localhost:8000/cercanas/${userData.id}`);
        const dataPersonasCercanas = await personasCercanas.json();
        var dataFiltrado = dataPersonasCercanas.filter(data => data.id_usuario !== userData.id);
        setPersonasCercanas(dataFiltrado);
      }else{
        setPersonasCercanas([]);
      }


      
    };
    obtenerUsuariosPopulares();
  }, []);

  const items = [
    {
      imageUrl: 'bergman.jpg',
      title: 'Elemento 1',
      description: 'Descripción del elemento 1'
    },
    {
      imageUrl: 'cannes.jpg',
      title: 'Elemento 2',
      description: 'Descripción del elemento 2'
    },
    {
      imageUrl: 'estrenos.jpeg',
      title: 'Elemento 2',
      description: 'Descripción del elemento 2'
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

  return (
    <div>
      <div id='central-inicio'>
        <h1>Movie Social Media</h1>
        {isLoggedIn && (
          <h4>Bienvenido {userData.nombre_usuario}</h4>
        )}
        
        <div>
          <Carousel items={items} />
        </div>
        <div id="divPersonasCercanas">
            {personasCercanas.length > 0 && (
              personasCercanas.map((usuario) => (
                <div>{usuario.nombre_usuario}</div>
              ))
            )}
        </div>
        <div id="divUsuariosPopulares">
            {Object.keys(groupedReviews).map((username) => (
              <div key={username}>
                <h3>Usuario: {username}</h3>
                {groupedReviews[username].map((review) => {
                  const pelicula = movieData.find(p => p.id === review.id_pelicula);
                  return(
                    <div key={review.review_id}>
                      <h5>{pelicula.title}</h5>
                      <p>{review.review_contenido}</p>
                      <p>{review.id_pelicula}</p>
                    </div>
                  )
                })}
              </div>
            ))}
        </div>
        <br />
        <div id="divUltimasReviews">
        {ultimasReviews.map((review) => (
          <div>{review.contenido}</div>
        ))}
        </div>
        <br />
        <div id="divTopLikes">
        {topLikes.map((peli) => {
          const pelicula = movieData.find(p => p.id === peli.pelicula_id);
          if (pelicula){
            return (<div>{pelicula.title}</div>)
          }
        }
        )}
        </div>
        <br />
        <div id="divTopValoracion">
        {topValoracion.map((peli) => {
          const pelicula = movieData.find(p => p.id === peli.pelicula_id);
          if (pelicula){
            return (<div>{pelicula.title}</div>)
          }
        }
        )}
        </div>
      </div>

    </div>
  );
};

export default Inicio;
