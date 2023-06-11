import "./botonLike.css";
import React from 'react';
import { HeaderContext } from "../header/headerContext";
import { useEffect, useState, useContext } from "react";
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const BotonLike = ({ idPeli }) => {
    const { userData, isLoggedIn, datosLikePeliculas } = useContext(HeaderContext);
    const [tieneLike, setTieneLike] = useState(false);

    useEffect(() => {
        const verificarLike = async () => {
            if (!isLoggedIn) return;
            if (datosLikePeliculas && datosLikePeliculas.peliculas.includes(idPeli)) {
                setTieneLike(true);
            }
        };

        verificarLike();
    }, [idPeli, isLoggedIn]);

    const darLike = async () => {
        const verListas = await fetch(`https://api-peliculas-pagina.onrender.com/listas/${userData.id}`);
        const dataVerListas = await verListas.json();
        const listaFiltrada = dataVerListas.filter((lista) => lista.tipo.toLowerCase() === "likes");

        if (listaFiltrada.length === 0) {
            const lista = {
                id: 0,
                tipo: "likes",
                nombre_lista: "Favoritas",
                usuario_id: userData.id,
                publica: true,
                peliculas: []
            }

            const response = await fetch(`https://api-peliculas-pagina.onrender.com/lista`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(lista),
            });
            const dataResponse = await response.json();
        }

        const verListasActualizadas = await fetch(`https://api-peliculas-pagina.onrender.com/listas/${userData.id}`);
        const dataVerListasActualizadas = await verListasActualizadas.json();
        const listaFiltradaAct = dataVerListasActualizadas.filter((lista) => lista.tipo.toLowerCase() === "likes");
        var pelis = listaFiltradaAct[0].peliculas;
        pelis.push(idPeli);
        const lista = {
            id: listaFiltradaAct[0].id,
            peliculas: pelis
        };
        const response = await fetch(`https://api-peliculas-pagina.onrender.com/peliculasLista/${listaFiltradaAct[0].id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(lista),
        });
        const dataResponse = await response.json();
        setTieneLike(true);
    };

    const quitarLike = async () => {
        const verListasActualizadas = await fetch(`https://api-peliculas-pagina.onrender.com/listas/${userData.id}`);
        const dataVerListasActualizadas = await verListasActualizadas.json();
        const listaFiltradaAct = dataVerListasActualizadas.filter((lista) => lista.tipo.toLowerCase() === "likes");

        if (listaFiltradaAct.length > 0) {
            const peliculas = listaFiltradaAct[0].peliculas;
            const indicePelicula = peliculas.indexOf(idPeli);

            if (indicePelicula !== -1) {
                peliculas.splice(indicePelicula, 1);

                const lista = {
                    id: listaFiltradaAct[0].id,
                    peliculas: peliculas
                };

                const response = await fetch(`https://api-peliculas-pagina.onrender.com/peliculasLista/${listaFiltradaAct[0].id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(lista),
                });

                const dataResponse = await response.json();
            }
        }
        setTieneLike(false);
    };


    if (!isLoggedIn) return null;

    return (
        <>
            {tieneLike ? (
                <Tooltip
                    title="Quitar like"
                    position="bottom"
                    arrow="true"
                    animation="fade"
                    theme="custom-theme"
                    className="custom-tooltip"
                >
                    <FontAwesomeIcon className="corazon-icono-like" onClick={quitarLike} icon={faHeart} style={{color: 'rgb(255, 94, 0)'}} />

                </Tooltip>
                
            ) : (
                <Tooltip
                title="Dar like"
                position="bottom"
                arrow="true"
                animation="fade"
                theme="custom-theme"
                className="custom-tooltip"
            >
                <FontAwesomeIcon className="corazon-icono-like" onClick={darLike} icon={faHeart} style={{color: 'aliceblue'}} />

            </Tooltip>
            )}
        </>
    );


};

export default BotonLike;
