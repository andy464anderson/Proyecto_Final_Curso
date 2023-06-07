import React, { useEffect, useState, useContext } from "react";
import "./registrar.css";
import $ from 'jquery';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { HeaderContext } from "../header/headerContext";

const Registrar = () => {

    const [name, setName] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(false);
    const [envioRegistro, setEnvioRegistro] = useState(false);
    const navigate = useNavigate();
    const [nameError, setNameError] = useState("");
    const [nombreUsuarioError, setNombreUsuarioError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const { isLoggedIn } = useContext(HeaderContext);
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
            toast.warning("No puedes acceder a esa página si ya has iniciado sesión", { autoClose: 2500 });
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        registrarUsuario();
    }, [envioRegistro]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setNameError("");
        setNombreUsuarioError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");

        $(".registro-form input").each(function () {
            $(this).css("border", "0");
        });


        const responseUsuarios = await fetch(`http://localhost:8000/usuarios`);
        const dataUsuarios = await responseUsuarios.json();

        const listaExisteUsuario = dataUsuarios.filter(usuario => usuario.nombre_usuario === nombreUsuario);
        const listaExisteCorreo = dataUsuarios.filter(usuario => usuario.correo === email);

        if (listaExisteUsuario.length > 0) {
            $("#nombreUsuario").css("border", "2px solid red");
            setNombreUsuarioError("El nombre de usuario ya existe");
            setError(true);
        }

        if (listaExisteCorreo.length > 0) {
            $("#email").css("border", "2px solid red");
            setEmailError("Ya existe una cuenta con ese correo electrónico");
            setError(true);
        }

        if (name.length < 3) {
            $("#name").css("border", "2px solid red");
            setNameError("El nombre debe tener al menos 3 caracteres");
            setError(true);
        }

        if (nombreUsuario.length < 3) {
            $("#nombreUsuario").css("border", "2px solid red");
            setNombreUsuarioError(`El nombre de usuario debe tener al menos 3 caracteres`);
            setError(true);
        }

        if (password.length < 6) {
            $("#password").css("border", "2px solid red");
            setPasswordError("La contraseña debe tener al menos 6 caracteres");
            setError(true);
        }

        if (password !== confirmPassword) {
            $("#confirm-password").css("border", "2px solid red");
            setConfirmPasswordError("Las contraseñas no coinciden");
            setError(true);
        }

        if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            $("#email").css("border", "2px solid red");
            setEmailError(`El formato del correo no es válido`);
            setError(true);
        }
        setEnvioRegistro(true);
    }

    const registrarUsuario = async () => {
        if (envioRegistro === true) {
            if (error === false) {
                const Usuario = {
                    id: 0,
                    correo: email,
                    clave: password,
                    rol: "user",
                    nombre_usuario: nombreUsuario,
                    nombre_completo: name
                }

                fetch("http://localhost:8000/usuario/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(Usuario)
                }).then(res => {
                    if (res.ok) {
                        toast.success("Registro completado correctamente", { autoClose: 2500 });
                        navigate("/login");
                        return res.json();
                    } else {
                        toast.warning("Error al crear el usuario", { autoClose: 2500 });
                    }
                }).catch(err => {
                    toast.warning(err, { autoClose: 2500 });
                });
            }

        }
        setError(false);
        setEnvioRegistro(false);
    }

    return (
        <div className="registro-form">
            <div className="tab-row">
                <div className={`tab-item`} onClick={() => navigate("/login")}>
                    Inicio de sesión
                </div>
                <div className={`tab-item selected`}>Registro</div>
            </div>

            <div className="form">
                <div className="form-group name">
                    <label htmlFor="name">Nombre completo: </label>
                    <input type="text" name="name" id="name" onChange={(e) => setName(e.target.value)} />
                    {nameError && <p style={{ color: "red" }}>{nameError}</p>}
                </div>

                <div className="form-group nombreUsuario">
                    <label htmlFor="nombreUsuario">Nombre de usuario: </label>
                    <input
                        type="text"
                        name="nombreUsuario"
                        id="nombreUsuario"
                        onChange={(e) => setNombreUsuario(e.target.value)}
                    />
                    {nombreUsuarioError && <p style={{ color: "red" }}>{nombreUsuarioError}</p>}
                </div>

                <div className="form-group email">
                    <label htmlFor="email">Correo electrónico: </label>
                    <input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)} />
                    {emailError && <p style={{ color: "red" }}>{emailError}</p>}
                </div>

                <div className="form-group password">
                    <label htmlFor="password">Contraseña: </label>
                    <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} />
                    {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
                </div>

                <div className="form-group confirm-password">
                    <label htmlFor="confirm-password">Confirmar contraseña: </label>
                    <input
                        type="password"
                        name="confirm-password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        id="confirm-password"
                    />
                    {confirmPasswordError && <p style={{ color: "red" }}>{confirmPasswordError}</p>}
                </div>

                <button type="submit" onClick={handleSubmit}>
                    <i className="bi bi-person-plus-fill"></i> Registrarse
                </button>

                <p>
                    ¿Ya tienes una cuenta? <a className="link" onClick={() => navigate("/login")}>Iniciar sesión</a>
                </p>
            </div>
        </div>
    );
}

export default Registrar;
