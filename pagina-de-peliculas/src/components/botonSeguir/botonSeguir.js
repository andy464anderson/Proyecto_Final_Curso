import "./botonSeguir.css";
import React from "react";
import { HeaderContext } from "../header/headerContext";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "react-tippy/dist/tippy.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BotonSeguir = ({ usuario, actualizarDatos }) => {
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [envioEditar, setEnvioEditar] = useState(false);
    const [verEditarPerfil, setVerEditarPerfil] = useState(false);
    const { isLoggedIn, userData, updateHeader } = useContext(HeaderContext);
    const [siguiendo, setSiguiendo] = useState(null);
    const [seguidores, setSeguidores] = useState([]);
    const [seguidos, setSeguidos] = useState([]);
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [nameError, setNameError] = useState("");
    const [nombreUsuarioError, setNombreUsuarioError] = useState("");
    const [emailError, setEmailError] = useState("");

    useEffect(() => {
        editarPerfil();
    }, [envioEditar]);

    useEffect(() => {
        const obtenerDatosUsuario = async () => {
            setNombreCompleto(usuario.nombre_completo);
            setNombreUsuario(usuario.nombre_usuario);
            setCorreo(usuario.correo);

            if (userData) {
                const responseSiguiendo = await fetch(`https://api-peliculas-pagina.onrender.com/seguidos/${userData.id}`);
                const dataSiguiendo = await responseSiguiendo.json();
                if (dataSiguiendo.find(user => user.id_usuario_seguido === usuario.id)) {
                    setSiguiendo(true);
                } else {
                    setSiguiendo(false);
                }
            }
        };

        obtenerDatosUsuario();
    }, [usuario.nombre_usuario]);

    const seguir = async (id_usuario_seguidor, id_usuario_seguido) => {
        const userSeguido = {
            id_usuario_seguidor,
            id_usuario_seguido
        };

        const response = await fetch("https://api-peliculas-pagina.onrender.com/seguidor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userSeguido),
        });


        const responseSeguidores = await fetch(`https://api-peliculas-pagina.onrender.com/seguidores/${usuario.id}`);
        const dataSeguidores = await responseSeguidores.json();
        setSeguidores(dataSeguidores);

        const responseSeguidos = await fetch(`https://api-peliculas-pagina.onrender.com/seguidos/${usuario.id}`);
        const dataSeguidos = await responseSeguidos.json();
        setSeguidos(dataSeguidos);
        if (typeof actualizarDatos === "function") {
            actualizarDatos(dataSeguidos, dataSeguidores, nombreUsuario, nombreCompleto);
        }
        setSiguiendo(true);
    }

    const dejarDeSeguir = async (id_usuario_seguidor, id_usuario_seguido) => {
        const dejarSeguir = await fetch(`https://api-peliculas-pagina.onrender.com/seguidor/${id_usuario_seguidor}/${id_usuario_seguido}`, {
            method: "DELETE"
        });

        const responseSeguidores = await fetch(`https://api-peliculas-pagina.onrender.com/seguidores/${usuario.id}`);
        const dataSeguidores = await responseSeguidores.json();
        setSeguidores(dataSeguidores);

        const responseSeguidos = await fetch(`https://api-peliculas-pagina.onrender.com/seguidos/${usuario.id}`);
        const dataSeguidos = await responseSeguidos.json();
        setSeguidos(dataSeguidos);
        if (typeof actualizarDatos === "function") {
            actualizarDatos(dataSeguidos, dataSeguidores, nombreUsuario, nombreCompleto);
        }
        setSiguiendo(false);
    }

    const editarPerfil = async () => {
        if (envioEditar) {
            if (error === false) {
                const Usuario = {
                    id: userData.id,
                    correo: correo,
                    clave: userData.clave,
                    rol: userData.rol,
                    nombre_usuario: nombreUsuario,
                    nombre_completo: nombreCompleto
                }

                const response = await fetch(`https://api-peliculas-pagina.onrender.com/usuario/${userData.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(Usuario),
                });
                const dataResponse = await response.json();
                setNombreUsuario(dataResponse.nombre_usuario);
                setNombreCompleto(dataResponse.nombre_completo);
                setCorreo(dataResponse.correo);
                updateHeader(true, dataResponse);
                if (typeof actualizarDatos === "function") {
                    toast.success("Perfil editado con éxito", { autoClose: 2500 });
                    actualizarDatos(seguidos, seguidores, dataResponse.nombre_usuario, dataResponse.nombre_completo);
                }
                navigate(`/perfil/${dataResponse.nombre_usuario}`);
                cerrar();
            }
        }
        setError(false);
        setEnvioEditar(false);
    }

    const comprobarEditarPerfil = async () => {
        if (correo !== userData.correo || nombreCompleto !== userData.nombre_completo || nombreUsuario !== userData.nombre_usuario) {
            setNameError("");
            setNombreUsuarioError("");
            setEmailError("");

            const responseUsuarios = await fetch(`https://api-peliculas-pagina.onrender.com/usuarios`);
            const dataUsuarios = await responseUsuarios.json();

            const listaExisteUsuario = dataUsuarios.filter(usuario => usuario.nombre_usuario === nombreUsuario && userData.nombre_usuario !== nombreUsuario);
            const listaExisteCorreo = dataUsuarios.filter(usuario => usuario.correo === correo && userData.correo !== correo);

            if (listaExisteUsuario.length > 0) {
                setNombreUsuarioError("El nombre de usuario ya existe");
                setError(true);
            }

            if (listaExisteCorreo.length > 0) {
                setEmailError("Ya existe una cuenta con ese correo electrónico");
                setError(true);
            }


            if (nombreCompleto.length < 3) {
                setNameError("El nombre debe tener al menos 3 caracteres");
                setError(true);
            }

            if (nombreUsuario.length < 3) {
                setNombreUsuarioError("El nombre de usuario debe tener al menos 3 caracteres");
                setError(true);
            }

            if (!correo.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
                setEmailError("El formato del correo no es válido");
                setError(true);
            }

            setEnvioEditar(true);
        } else {
            cerrar();
            toast.warning("No se ha modificado nada", { autoClose: 2500 });
        }
    }

    const cerrar = () => {
        setVerEditarPerfil(false);
        setNombreCompleto(userData.nombre_completo);
        setNombreUsuario(userData.nombre_usuario);
        setCorreo(userData.correo);
        setError(false);
        setEnvioEditar(false);
        setNameError("");
        setNombreUsuarioError("");
        setEmailError("");
    }

    return (
        <>
            {isLoggedIn && userData ? (
                <div className="botonUsuario">
                    {usuario.id === userData.id && (
                        <button onClick={() => setVerEditarPerfil(true)}>Editar perfil</button>
                    )}
                    {usuario.id !== userData.id && siguiendo === true && (
                        <button onClick={() => dejarDeSeguir(userData.id, usuario.id)}>Dejar de seguir</button>
                    )}
                    {usuario.id !== userData.id && siguiendo === false && (
                        <button onClick={() => seguir(userData.id, usuario.id)}>Seguir</button>
                    )}
                </div>
            ) : (
                <button className="deshabilitado" disabled={true}>Seguir</button>
            )}
            {verEditarPerfil && (
                <div className="modal">
                    <div className="modal-content">
                        <div id="caja-editar-perfil">

                            <div id="cruzDivListasNormales" onClick={cerrar}>
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                            <div>
                                <label htmlFor="nombreCompleto">Nombre completo: </label>
                                <input id="nombreCompleto" type="text" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
                                {nameError ? (<p style={{ color: "red" }}>{nameError}</p>) : (<><br /><br /></>)}
                                <label htmlFor="nombreUsuario">Nombre de usuario: </label>
                                <input id="nombreUsuario" type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
                                {nombreUsuarioError ? (<p style={{ color: "red" }}>{nombreUsuarioError}</p>) : (<><br /><br /></>)}
                                <label htmlFor="correo">Correo electrónico: </label>
                                <input id="correo" type="text" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                                {emailError ? (<p style={{ color: "red" }}>{emailError}</p>) : (<><br /><br /></>)}
                                <button type="submit" onClick={comprobarEditarPerfil}>Guardar cambios</button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );


};

export default BotonSeguir;
