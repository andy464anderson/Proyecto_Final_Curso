import "./detalle_pelicula.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useAsyncError, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { HeaderContext } from "../header/headerContext";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { faXmark, faStar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import BotonLike from "../botonLike/botonLike";

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
        "color": "#40BCF4"
      })
    });
    noColor.forEach(estrella => {
      $("#" + estrella + "estrella").css({
        "color": "#48525e"
      })
    });
  }
  const BarChart = () => {
    var nota1 = reviews.filter(rev => rev.valoracion === 1)
    var nota2 = reviews.filter(rev => rev.valoracion === 2)
    var nota3 = reviews.filter(rev => rev.valoracion === 3)
    var nota4 = reviews.filter(rev => rev.valoracion === 4)
    var nota5 = reviews.filter(rev => rev.valoracion === 5)
    var reviewsSinNota = reviews.filter(rev => rev.valoracion !== -1)
    var notaMedia = ((1 * nota1.length) + (2 * nota2.length) + (3 * nota3.length) + (4 * nota4.length) + (5 * nota5.length)) / reviewsSinNota.length;
    const etiquetas = ['1', '2', '3', '4', '5'];
    const valores = [nota1.length, nota2.length, nota3.length, nota4.length, nota5.length];
    const data = {
      labels: etiquetas,
      datasets: [
        {
          label: 'Datos de ejemplo',
          data: valores,
          backgroundColor: '#40BCF4',
          borderWidth: 0,
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
            color: 'white',
          },
          ticks: {
            display: true,
            color: 'white',
          },
        },
        y: {
          display: false,
        },
      },
      animation: {
        duration: 0,
      },
      layout: {
        padding: {
          left: 0,
          right: 50,
        },
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem) {
            // Personaliza el contenido de las etiquetas aquí
            return 'a: ' + tooltipItem.yLabel;
          },
        },
      },
    };

    return (
      <div id="grafico-detalle-padre">
        <legend id="legend-detalle">Valoración de los usuarios</legend>
        <div id="grafico-detalle">
          <Bar data={data} options={options} width={50} height={20} />
          <div id="datos-puntuacion-grafico">
            <div id="puntuacion-general-detalle">
              <span id="span-nota-media">{notaMedia.toFixed(1)}</span>
              <span>/</span>
              <span>5</span>
            </div>
            <button id="boton-calificar" onClick={cancelarReview}>Calificar</button>
          </div>
        </div>
      </div>
    );
  };
  const toggleCastYReviews = (tipo) => {
    if (tipo === "cast") {
      $("#castDetalle").css({
        "display": "block"
      });
      $("#reviewsDetalle").css({
        "display": "none"
      });
      $("#boton-cast-detalle").css({
        "color": "#40BCF4",
        "background": "#1e2329"
      });
      $("#boton-reviews-detalle").css({
        "color": "#48525e",
        "background": "#191d22"
      });
    } else {
      $("#castDetalle").css({
        "display": "none"
      });
      $("#reviewsDetalle").css({
        "display": "block"
      });
      $("#boton-reviews-detalle").css({
        "color": "#40BCF4",
        "background": "#1e2329"
      });
      $("#boton-cast-detalle").css({
        "color": "#48525e",
        "background": "#191d22"
      });
    }
  }
  const cancelarReview = () => {
    $("#resena-form").toggle();
    calificar(-1);
    $("#comentario").val("");
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

        setCalificacion("");
        setContenido("");

        const responseReviews = await fetch(
          `http://localhost:8000/reviews/${pelicula.id}`
        );
        const dataReviews = await responseReviews.json();
        setReviews(dataReviews);
        const ultimaReview = dataReviews[0];
        listaReviewsFiltrada.unshift(ultimaReview);
        cancelarReview();
      }
    } else {
      alert("No puedes realizar esta acción si no has iniciado sesión");
    }
  };

  const [visibleReviews, setVisibleReviews] = useState(5); // Estado para realizar un seguimiento de las reseñas visibles

  const obtenerDiferenciaFechas = (fechaCreacion) => {
    const fechaActual = new Date();
    const fechaCreacionObj = new Date(fechaCreacion);
    const diferencia = fechaActual - fechaCreacionObj;
    const unDiaEnMilisegundos = 24 * 60 * 60 * 1000;

    const diasPasados = Math.floor(diferencia / unDiaEnMilisegundos);
    const mesesPasados = Math.floor(diasPasados / 30);
    const aniosPasados = Math.floor(mesesPasados / 12);

    if (aniosPasados >= 1) {
      return `hace ${aniosPasados} años`;
    } else if (mesesPasados >= 1) {
      return `hace ${mesesPasados} meses`;
    } else if (diasPasados >= 1) {
      return `hace ${diasPasados} días`;
    } else {
      return `hoy`
    }
  };

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
    setListaReviewsFiltrada(dataReviews);
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

  const volver = () => {
    window.history.back();
  }

  if (!pelicula || !reviews || !listaReviewsFiltrada) {
    return <div></div>
  }
  else {
    return (
      <div className="container">
        <div className="detalle-pelicula">
          <div className="boton-volver">
            <button onClick={volver}><FontAwesomeIcon icon={faArrowLeft} /></button>
          </div>
          <div className="poster-detalle">
            <img src={pelicula.poster} alt={pelicula.title} />
          </div>
          <div className="detalle-completo-pelicula">
            <h2>
              {pelicula.title} <BotonLike idPeli={pelicula.id} />
            </h2>

            <div>
              <p className="genere">
                {pelicula.release_date}
                <span className="separador">·</span>
                {pelicula.runtime} min
                <span className="separador">·</span>
                {parsedGenres.map((genre, index) => (
                  <span key={genre.id}>
                    {genre.name}
                    {index !== parsedGenres.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>

            <p id="sinopsis-detalle">{pelicula.overview}</p>
            <div>
              <div>
                <BarChart />
              </div>


            </div>


          </div>
        </div>
        <div id="resena-form">
          <div id="resena-form-hijo">
            <div>
              <img id="poster-comentario" src={pelicula.poster} alt={pelicula.title} />
            </div>
            <div>
              <h3>{pelicula.title}</h3>
              <div id="estrellas">
                <div>
                  <FontAwesomeIcon onClick={() => calificar(1)} className="iconoCalificacion" id="1estrella" icon={faStar} />
                  <FontAwesomeIcon onClick={() => calificar(2)} className="iconoCalificacion" id="2estrella" icon={faStar} />
                  <FontAwesomeIcon onClick={() => calificar(3)} className="iconoCalificacion" id="3estrella" icon={faStar} />
                  <FontAwesomeIcon onClick={() => calificar(4)} className="iconoCalificacion" id="4estrella" icon={faStar} />
                  <FontAwesomeIcon onClick={() => calificar(5)} className="iconoCalificacion" id="5estrella" icon={faStar} />
                </div>
                <FontAwesomeIcon onClick={() => calificar(-1)} className="iconoCalificacion cruzCalificacion" id="-1estrella" icon={faXmark} />
              </div>
              <div>
                <textarea placeholder="Escribe aquí tu comentario..." id="comentario" name="comentario" value={contenido} onChange={(e) => setContenido(e.target.value)} required></textarea>
                <div id="comentario-acciones">
                  <button type="submit" id="enviarReview" onClick={enviarReview}>Enviar reseña</button>
                  <button id="cancelarReview" onClick={cancelarReview}>Cancelar</button>
                </div>

              </div>
            </div>

          </div>

        </div>
        <div id="castYReviews">
          <div id="botonesCastYReviews">
            <button id="boton-cast-detalle" onClick={() => toggleCastYReviews("cast")}>Reparto</button>
            <button id="boton-reviews-detalle" onClick={() => toggleCastYReviews("reviews")}>Reseñas</button>
            <a target="_blank" href={`https://www.imdb.com/title/${pelicula.imdb_id}`}>
              <svg id="svgimdb" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM21.3 229.2H21c.1-.1.2-.3.3-.4zM97 319.8H64V192h33zm113.2 0h-28.7v-86.4l-11.6 86.4h-20.6l-12.2-84.5v84.5h-29V192h42.8c3.3 19.8 6 39.9 8.7 59.9l7.6-59.9h43zm11.4 0V192h24.6c17.6 0 44.7-1.6 49 20.9 1.7 7.6 1.4 16.3 1.4 24.4 0 88.5 11.1 82.6-75 82.5zm160.9-29.2c0 15.7-2.4 30.9-22.2 30.9-9 0-15.2-3-20.9-9.8l-1.9 8.1h-29.8V192h31.7v41.7c6-6.5 12-9.2 20.9-9.2 21.4 0 22.2 12.8 22.2 30.1zM265 229.9c0-9.7 1.6-16-10.3-16v83.7c12.2.3 10.3-8.7 10.3-18.4zm85.5 26.1c0-5.4 1.1-12.7-6.2-12.7-6 0-4.9 8.9-4.9 12.7 0 .6-1.1 39.6 1.1 44.7.8 1.6 2.2 2.4 3.8 2.4 7.8 0 6.2-9 6.2-14.4z" fill="#ffdd00"></path></svg>
            </a>
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
                {isLoggedIn && (
                  <>
                    <button onClick={() => seleccionarOpcionReview("amigos")}>Amigos</button>
                    <button onClick={() => seleccionarOpcionReview("tu")}>Tú</button>
                  </>
                )}
              </div>
              <div id="resenas">
                <div className="resena-list">
                  <h5 id="titulo-reviews-h3"><span id="numero-reviews">{listaReviewsFiltrada.length}</span> reseñas</h5>
                  {listaReviewsFiltrada.slice(0, visibleReviews).map((review) => (
                    <div className="divReview" key={review.id} id={review.id}>

                      <div>
                        <div
                          className="divUsuarioReview"
                          onClick={() => verUsuario(review.nombre_usuario)}
                        >
                          <strong className="nombre-usuario-review-detalle">{review.nombre_usuario}</strong>
                          <span className="fecha-review-detalle">{obtenerDiferenciaFechas(review.fecha)}</span>
                        </div>

                        <div className="contenido-review-detalle">{review.contenido}</div>
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

                        {isLoggedIn && review.id_usuario === userData.id && (
                          <button id="boton-eliminar-detalle" onClick={() => eliminarReview(review.id)}>
                            Eliminar reseña
                          </button>
                        )}
                      </div>

                      <hr />
                    </div>
                  ))}
                </div>
                {visibleReviews < listaReviewsFiltrada.length && (
                  <button id="boton-ver-mas" onClick={mostrarMasResenas}>Ver más reseñas</button>
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
