import "./detalle_pelicula.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useAsyncError, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { HeaderContext } from "../header/headerContext";
import { faCircleXmark, faStar } from '@fortawesome/free-solid-svg-icons';
import BotonLike from "../botonLike/botonLike";
import $ from 'jquery';

const DetallePelicula = () => {
  const navigate = useNavigate();
  const id = window.location.pathname.split("/")[2];
  const [pelicula, setPelicula] = useState({});
  const [genres, setGenres] = useState(
    '[{"id": 28, "name": "Action"}, {"id": 12, "name": "Adventure"}, {"id": 35, "name": "Comedy"}, {"id": 53, "name": "Thriller"}]'
  );
  const [cast, setCast] = useState([{ "id": "1" }]);
  const parsedGenres = JSON.parse(genres);
  const [reviews, setReviews] = useState([]);
  const [listaReviewsFiltrada, setListaReviewsFiltrada] = useState([]);
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
      setListaReviewsFiltrada(dataReviews);
    };
    obtenerPelicula();
  }, []);

  const verUsuario = (nombreUsuario) => {
    navigate(`/perfil/${nombreUsuario}`);
  }

  const calificar = (nota) => {
    setCalificacion(nota.toString());
    $("#calificacion").val(nota);
    var notas = [1, 2, 3, 4, 5];
    var color = [];
    var noColor = [];
    notas.forEach(numero => {
      if (numero > nota) {
        noColor.push(numero);
      } else {
        color.push(numero);
      }
    });
    color.forEach(estrella => {
      $("#" + estrella + "estrella").css({
        "color": "blue"
      })
    });
    noColor.forEach(estrella => {
      $("#" + estrella + "estrella").css({
        "color": "black"
      })
    });
  }
  const toggleCastYReviews = (tipo) => {
    if (tipo === "cast") {
      $("#castDetalle").css({
        "display": "block"
      });
      $("#reviewsDetalle").css({
        "display": "none"
      });
    } else {
      $("#castDetalle").css({
        "display": "none"
      });
      $("#reviewsDetalle").css({
        "display": "block"
      });
    }
  }
  const enviarReview = async () => {
    if (isLoggedIn) {

      if ((calificacion == "-1" || calificacion == "") && contenido == "") {
        alert("Tienes que rellenar al menos un campo de la reseña");

      } else {
        const fechaActual = new Date();
        const anio = fechaActual.getFullYear();
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
        const dia = fechaActual.getDate().toString().padStart(2, "0");
        const fecha = `${anio}-${mes}-${dia}`;
        var valoracion = parseInt(calificacion);
        if (calificacion == "") {
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
        console.log(dataResponse);

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

  const [visibleReviews, setVisibleReviews] = useState(5); // Estado para realizar un seguimiento de las reseñas visibles

  const mostrarMasResenas = () => {
    setVisibleReviews((prevVisibleReviews) => prevVisibleReviews + 5);
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

  const seleccionarOpcionReview = async (opcion) => {
    var listaFiltrada = [];
    if (opcion == "general") {
      setListaReviewsFiltrada(reviews);

    } else if (opcion == "amigos") {
      const responseSeguidos = await fetch(`http://localhost:8000/seguidos/${userData.id}`);
      const dataSeguidos = await responseSeguidos.json();
      listaFiltrada = reviews.filter(review => {
        return dataSeguidos.some(seguido => seguido.id_usuario_seguido === review.id_usuario);
      });
      setListaReviewsFiltrada(listaFiltrada);

    } else {
      listaFiltrada = reviews.filter(review => review.id_usuario == userData.id);
      setListaReviewsFiltrada(listaFiltrada);
    }
  }



  if (!pelicula || !reviews || !listaReviewsFiltrada) {
    return <div></div>
  }
  else {
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
              Enlace a IMBD <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ color: "#1b2d4b", }} />
            </a>
            {isLoggedIn && (
              <BotonLike idPeli={pelicula.id} />
            )}
          </div>
        </div>
        <div className="resena-form">
          <h4>Deja tu reseña para "{pelicula.title}"</h4>

          <label>Calificación</label>
          <div id="estrellas">
            <FontAwesomeIcon onClick={() => calificar(1)} className="iconoCalificacion" id="1estrella" icon={faStar} />
            <FontAwesomeIcon onClick={() => calificar(2)} className="iconoCalificacion" id="2estrella" icon={faStar} />
            <FontAwesomeIcon onClick={() => calificar(3)} className="iconoCalificacion" id="3estrella" icon={faStar} />
            <FontAwesomeIcon onClick={() => calificar(4)} className="iconoCalificacion" id="4estrella" icon={faStar} />
            <FontAwesomeIcon onClick={() => calificar(5)} className="iconoCalificacion" id="5estrella" icon={faStar} />
            <FontAwesomeIcon onClick={() => calificar(-1)} className="iconoCalificacion" id="-1estrella" icon={faCircleXmark} />
          </div>
          <label htmlFor="comentario">Comentario</label>
          <textarea id="comentario" name="comentario" value={contenido} onChange={(e) => setContenido(e.target.value)} required></textarea>

          <button type="submit" id="enviarReview" onClick={enviarReview}>Enviar reseña</button>
        </div>
        <div id="castYReviews">
          <div id="botonesCastYReviews">
            <button onClick={() => toggleCastYReviews("cast")}>Reparto</button>
            <button onClick={() => toggleCastYReviews("reviews")}>Reseñas</button>
          </div>
          <div id="castDetalle">
            <div className="cast-list">
              <table>
                <tbody>
                  <tr>
                    <th>
                      Actor
                    </th>
                    <th>
                      Personaje
                    </th>
                  </tr>
                  {cast.map((actor) => (
                    <tr key={actor.id}>
                      <td>{actor.name}</td>
                      <td>{actor.character}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>

          <div id="reviewsDetalle">
            <div id="subReviewsDetalle">
              <div id="opcionesReviews">
                <p>¿De quién quieres ver las reseñas?</p>
                <button onClick={() => seleccionarOpcionReview("general")}>General</button>
                <button onClick={() => seleccionarOpcionReview("amigos")}>Amigos</button>
                <button onClick={() => seleccionarOpcionReview("tu")}>Tú</button>
              </div>
              <div id="resenas">
                <div className="resena-list">
                  <h4>Reseñas ({listaReviewsFiltrada.length})</h4>
                  <hr />
                  {listaReviewsFiltrada.slice(0, visibleReviews).map((review) => (
                    <div className="divReview" key={review.id} id={review.id}>
                      <div
                        className="divUsuarioReview"
                        onClick={() => verUsuario(review.nombre_usuario)}
                      >
                        <strong>{review.nombre_usuario}</strong>
                      </div>
                      <div>{review.fecha}</div>
                      <div>{review.contenido}</div>
                      {review.valoracion !== -1 ? (
                        <div>Valoración: {review.valoracion}/10</div>
                      ) : null}
                      {isLoggedIn && review.id_usuario === userData.id && (
                        <button onClick={() => eliminarReview(review.id)}>
                          Eliminar reseña
                        </button>
                      )}

                      <hr />
                    </div>
                  ))}
                </div>
                {visibleReviews < reviews.length && (
                  <button onClick={mostrarMasResenas}>Ver más reseñas</button>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }
};

export default DetallePelicula;
