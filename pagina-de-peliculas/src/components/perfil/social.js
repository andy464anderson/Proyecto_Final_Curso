import React from "react";
import "./perfil.css";
import { useNavigate } from "react-router-dom";
import Pelicula from "./peliculaLista";
import { useEffect, useState } from "react";
import Usuario from "./usuario";

function Social() {
    const nombre_usuario = window.location.pathname.split("/")[2];
    const seg = window.location.pathname.split("/")[3];
    const [usuario, setUsuario] = useState(null);
    const [seguidores, setSeguidores] = useState([]);
    const [seguidos, setSeguidos] = useState([]);    

    useEffect(() => {
        const obtenerDatosUsuario = async () => {
            const responseUsuario = await fetch(`http://localhost:8000/perfil/${nombre_usuario}`, {
                method: "GET",
                headers: {
                accept: "application/json",
                },
            });
            var dataUsuario = await responseUsuario.json();
            setUsuario(dataUsuario);

            // obtener las listas del usuario
            const responseSeguidores = await fetch(`http://localhost:8000/seguidores/${dataUsuario.id}`);
            const dataSeguidores = await responseSeguidores.json();
            setSeguidores(dataSeguidores);

            // obtener las listas del usuario
            const responseSeguidos = await fetch(`http://localhost:8000/seguidos/${dataUsuario.id}`);
            const dataSeguidos = await responseSeguidos.json();
            setSeguidos(dataSeguidos);
        };
        obtenerDatosUsuario();
    }, [nombre_usuario]);
    
    if(!usuario || !seguidores || !seguidos){
        return <div></div>
    }else{ 
        if(seg == "seguidores"){
            return (
                <div className="social">
                    {seguidores.map((user) => (
                        <Usuario key={user.id_seguidor} id={user.id_usuario_seguidor} />
                    ))}
                </div>
            );
        }else {
            return (
                <div className="social">
                    {seguidos.map((user) => (
                        <Usuario key={user.id_seguidor} id={user.id_usuario_seguido} />
                    ))}
                </div>
            );
        }
    }
    
}

export default Social;