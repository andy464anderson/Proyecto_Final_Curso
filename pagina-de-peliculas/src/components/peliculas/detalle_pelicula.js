import "./detalle_pelicula.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { HeaderContext } from "../header/headerContext";

const DetallePelicula = () => {
  const navigate = useNavigate();
  const id = window.location.pathname.split("/")[2];  
  const [pelicula, setPelicula] = useState({});
  const [genres, setGenres] = useState(
    '[{"id": 28, "name": "Action"}, {"id": 12, "name": "Adventure"}, {"id": 35, "name": "Comedy"}, {"id": 53, "name": "Thriller"}]'
  );
  const [cast, setCast] = useState([{"id":"1"}]);
  const parsedGenres = JSON.parse(genres);  
  const [reviews, setReviews] = useState([]);
  const [calificacion, setCalificacion] = useState("");
  const [contenido, setContenido] = useState("");
  const { isLoggedIn, userData } = useContext(HeaderContext);

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
      cast = cast.replace(/None/g, '""');
      cast = JSON.parse(cast);

      setGenres(genres);
      setCast(cast);

      const responseReviews = await fetch(`http://localhost:8000/reviews/${id}`);
      const dataReviews = await responseReviews.json();
      setReviews(dataReviews);
    };
    obtenerPelicula();
  }, []);

  const verUsuario = (nombreUsuario) => {
    navigate(`/perfil/${nombreUsuario}`);
  }

  const enviarReview = async () => {
    if (isLoggedIn) {
      
      if ((calificacion == "-1" || calificacion == "") && contenido == "") {
        alert("Tienes que rellenar al menos un campo de la reseña");

      } else {
        console.log(calificacion);
      console.log(contenido);
        const fechaActual = new Date();
        const anio = fechaActual.getFullYear();
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
        const dia = fechaActual.getDate().toString().padStart(2, "0");
        const fecha = `${anio}-${mes}-${dia}`;
        var valoracion = parseInt(calificacion);
        if(calificacion == ""){
          valoracion = -1;
        }
  
        const id_usuario = userData.id;
        const id_pelicula = pelicula.id;
        const reviewPeli = {
          id_usuario,
          id_pelicula,
          contenido,
          valoracion,
          fecha,
        };

        const response = await fetch("http://localhost:8000/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewPeli),
        });
        const dataResponse = await response.json();
        console.log(dataResponse)

        setCalificacion("");
        setContenido("");

        const responseReviews = await fetch(
          `http://localhost:8000/reviews/${pelicula.id}`
        );
        const dataReviews = await responseReviews.json();
        setReviews(dataReviews);
      }
    } else {
      alert("No puedes realizar esta acción si no has iniciado sesión");
    }
  };

  const eliminarReview = async (reviewId) => {
    const eliminar = await fetch(`http://localhost:8000/review/${reviewId}`, {
      method: "DELETE"
    });

    const responseReviews = await fetch(
      `http://localhost:8000/reviews/${pelicula.id}`
    );
    const dataReviews = await responseReviews.json();
    setReviews(dataReviews);
  };
  
  

  if(!pelicula || !reviews){
    return <div></div>
  } 
  else{
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
            <a target="_blank" href={`https://www.imdb.com/title/${pelicula.imdb_id}`}>
              Enlace a IMBD <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{color: "#1b2d4b",}} />
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

              <label htmlFor="calificacion">Calificación</label>
              <select id="calificacion" name="calificacion" value={calificacion} onChange={(e) => setCalificacion(e.target.value)} required>
                <option value="-1">Selecciona una opción</option>
                <option value="5">Excelente</option>
                <option value="4">Muy buena</option>
                <option value="3">Buena</option>
                <option value="2">Regular</option>
                <option value="1">Mala</option>
              </select>

              <label htmlFor="comentario">Comentario</label>
              <textarea id="comentario" name="comentario" value={contenido} onChange={(e) => setContenido(e.target.value)} required></textarea>

              <button type="submit" id="enviarReview" onClick={enviarReview}>Enviar reseña</button>
            </div>

            <div className="resena-list">
              <h4>Reseñas ({reviews.length})</h4>
              <hr />
              {reviews.map((review) => (
                <div className="divReview" key={review.id} id={review.id}>
                    <div className="divUsuarioReview" onClick={()=>verUsuario(review.nombre_usuario)}><strong>{review.nombre_usuario}</strong></div>
                    <div>{review.fecha}</div>
                    <div>{review.contenido}</div>
                    {review.valoracion !== -1 ? (
                      <div>Valoración: {review.valoracion}/10</div>
                    ) : null}
                    {review.id_usuario === userData.id && (
                      <button onClick={() => eliminarReview(review.id)}>Eliminar reseña</button>
                    )}                  
                    <hr />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );  
  }
};

export default DetallePelicula;
