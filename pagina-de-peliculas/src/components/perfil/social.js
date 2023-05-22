import React from "react";
import "./perfil.css";
import "./social.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Social() {
    const navigate = useNavigate();
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

    const verUsuario = (nombreUsuario) => {
        navigate(`/perfil/${nombreUsuario}`);
    }

    if (!usuario || !seguidores || !seguidos) {
        return <div></div>
    } else {
        if (seg == "seguidores") {
            return (
                <div className="social">
                    <h5>Seguidores</h5>
                    <hr></hr>
                    {seguidores.map((user) => (
                        <div onClick={() => verUsuario(user.nombre_usuario)} className="divUsuario" id={user.id_usuario_seguidor} key={user.id_usuario_seguidor}>
                            <div><strong>{user.nombre_usuario}</strong></div>
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <div className="social">
                    <h5>Siguiendo</h5>
                    <hr></hr>
                    {seguidos.map((user) => (
                        <div onClick={() => verUsuario(user.nombre_usuario)} className="divUsuario" id={user.id_usuario_seguido} key={user.id_usuario_seguido}>
                            <div><strong>{user.nombre_usuario}</strong></div>
                        </div>
                    ))}
                </div>
            );
        }
    }

}

export default Social;