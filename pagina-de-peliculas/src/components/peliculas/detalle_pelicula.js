import "./detalle_pelicula.css";

import React, { useEffect, useState } from "react";

const DetallePelicula = () => {
  //recuperamos el id de la pelicula que viene en la url
  const id = window.location.pathname.split("/")[2];
  console.log(id);

  //buscamos la pelicula por el id
  const [pelicula, setPelicula] = useState({});

  const [genres, setGenres] = useState(
    '[{"id": 28, "name": "Action"}, {"id": 12, "name": "Adventure"}, {"id": 35, "name": "Comedy"}, {"id": 53, "name": "Thriller"}]'
  );

  const [cast, setCast] = useState([{"id":"1"}]);

  const parsedGenres = JSON.parse(genres);

  useEffect(() => {
    const obtenerPelicula = async () => {
      const data = await fetch(`http://localhost:8000/peliculas/${id}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      var pelicula = await data.json();
      setPelicula(pelicula[0]);
      var genres = pelicula[0].genres;
      genres = genres.replace(/'/g, '"');

      var cast = pelicula[0].cast;
      cast = cast.replace(/'/g, '"');
      cast = JSON.parse(cast);
      console.log(cast);

      setGenres(genres);
      setCast(cast);
    };
    obtenerPelicula();
  }, []);

  return (
    <div className="container">
      <div className="detalle-pelicula">
        <div className="poster">
          <img src={pelicula.poster} alt={pelicula.title} />
        </div>
        <div className="detalle-completo-pelicula">
          <h2>
            {pelicula.title}({pelicula.release_date})
          </h2>
          <p className="genere">
            {parsedGenres.map((genre, index) => (
              <span key={genre.id}>
                {genre.name}
                {index !== parsedGenres.length - 1 && ","}
              </span>
            ))}
            <i className="bi bi-clock-fill"></i>
            {pelicula.runtime} min
          </p>
          <p>{pelicula.overview}</p>
          <a href={`https://www.imdb.com/title/${pelicula.imdb_id}`}>
            Enlace a IMBD
          </a>
        </div>
        <button className="descargar">
          Descargar <i className="bi bi-download"></i>
        </button>
      </div>

      <div className="cast detalle-pelicula">
        <h3>
          <i className="bi bi-people"></i>
          Casts
        </h3>
        <div className="cast-list">
          {cast.map((actor) => (
            <button key={actor.id}>{actor.name}</button>
          ))}
        </div>
      </div>

      <div className="recomendaciones detalle-pelicula">
        <h3>
          <i className="bi bi-people-fill"></i> Reseñas
        </h3>

        <div className="resenas">
          <div className="resena-form">
            <h4>Deja tu reseña para "{pelicula.title}"</h4>

            <label for="calificacion">Calificación</label>
            <select id="calificacion" name="calificacion" required>
              <option value="">Selecciona una opción</option>
              <option value="5">Excelente</option>
              <option value="4">Muy buena</option>
              <option value="3">Buena</option>
              <option value="2">Regular</option>
              <option value="1">Mala</option>
            </select>

            <label for="comentario">Comentario</label>
            <textarea id="comentario" name="comentario" required></textarea>

            <button type="submit">Enviar reseña</button>
          </div>

          <div className="resena-list">
            <h4>Reseñas (0)</h4>
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallePelicula;
