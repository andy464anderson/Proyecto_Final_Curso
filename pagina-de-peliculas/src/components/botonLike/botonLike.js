import React from 'react';
import { HeaderContext } from "../header/headerContext";
import { useEffect, useState, useContext } from "react";

const BotonLike = ({ idPeli }) => {
    const { userData, isLoggedIn } = useContext(HeaderContext);
    const [tieneLike, setTieneLike] = useState(false);

    useEffect(() => {
        const verificarLike = async () => {
            if (!isLoggedIn) return;
            const verListas = await fetch(`http://localhost:8000/listas/${userData.id}`);
            const dataVerListas = await verListas.json();
            const listaFiltrada = dataVerListas.find((lista) => lista.tipo.toLowerCase() === "likes");
            if (listaFiltrada && listaFiltrada.peliculas.includes(idPeli)) {
                setTieneLike(true);
            }
        };

        verificarLike();
    }, [isLoggedIn, idPeli]);

    const darLike = async () => {
        const verListas = await fetch(`http://localhost:8000/listas/${userData.id}`);
        const dataVerListas = await verListas.json();
        const listaFiltrada = dataVerListas.filter((lista) => lista.tipo.toLowerCase() == "likes");

        if (listaFiltrada.length == 0) {
            const lista = {
                id: 0,
                tipo: "likes",
                nombre_lista: "Favoritas",
                usuario_id: userData.id,
                publica: true,
                peliculas: []
            }

            const response = await fetch(`http://localhost:8000/lista`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(lista),
            });
            const dataResponse = await response.json();
        }

        const verListasActualizadas = await fetch(`http://localhost:8000/listas/${userData.id}`);
        const dataVerListasActualizadas = await verListasActualizadas.json();
        const listaFiltradaAct = dataVerListasActualizadas.filter((lista) => lista.tipo.toLowerCase() == "likes");
        var pelis = listaFiltradaAct[0].peliculas;
        pelis.push(idPeli);
        const lista = {
            id: listaFiltradaAct[0].id,
            peliculas: pelis
        };
        const response = await fetch(`http://localhost:8000/peliculasLista/${listaFiltradaAct[0].id}`, {
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
        const verListasActualizadas = await fetch(`http://localhost:8000/listas/${userData.id}`);
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

                const response = await fetch(`http://localhost:8000/peliculasLista/${listaFiltradaAct[0].id}`, {
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
                <button onClick={quitarLike}>Quitar like</button>
            ) : (
                <button onClick={darLike}>Dar like</button>
            )}
        </>
    );


};

export default BotonLike;
