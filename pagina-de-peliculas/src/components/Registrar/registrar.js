import React, { useEffect, useState } from "react";
import './registrar.css';
import { data } from "jquery";
import { useNavigate } from "react-router-dom";

const Registrar = () => {

    const [name, setName] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(false);
    const [envioRegistro, setEnvioRegistro] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        registrarUsuario();
    }, [envioRegistro]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const responseUsuarios = await fetch(`http://localhost:8000/usuarios`);
        const dataUsuarios = await responseUsuarios.json();

        const listaExisteUsuario = dataUsuarios.filter(usuario => usuario.nombre_usuario == nombreUsuario);
        const listaExisteCorreo = dataUsuarios.filter(usuario => usuario.correo == email);

        if (listaExisteUsuario.length > 0) {
            alert('El nombre de usuario ya existe');
            setError(true);
        }

        if (listaExisteCorreo.length > 0) {
            alert('Ya existe una cuenta con ese correo electrónico');
            setError(true);
        }

        if (name.length < 3) {
            alert('El nombre debe tener al menos 3 caracteres');
            setError(true);
        }

        if (nombreUsuario.length < 3) {
            alert('El nombre de usuario debe tener al menos 3 caracteres');
            setError(true);
        }

        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            setError(true);
        }

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            setError(true);
        }

        if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            alert('El formato del correo no es válido');
            setError(true);
        }
        setEnvioRegistro(true);
    }

    const registrarUsuario = async () => {
        console.log("envio registro " + envioRegistro);
        if (envioRegistro == true) {
            console.log("error " + error);
            if (error == false) {
                const Usuario = {
                    id: 0,
                    correo: email,
                    clave: password,
                    rol: 'user',
                    nombre_usuario: nombreUsuario,
                    nombre_completo: name
                }
                console.log(Usuario);

                fetch('http://localhost:8000/usuario/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Usuario)
                }).then(res => {
                    if (res.ok) {
                        alert('Usuario creado correctamente');
                        navigate("/login");
                        return res.json();
                    } else {
                        throw new Error('Error al crear el usuario');
                    }
                }).catch(err => {
                    alert(err);
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
                <div className={`tab-item selected`}>
                    Registro
                </div>
            </div>

            <div className="form">
                <div className="form-group">
                    <label htmlFor="name">Nombre completo: </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="nombreUsuario">Nombre de usuario: </label>
                    <input
                        type="text"
                        name="nombreUsuario"
                        id="nombreUsuario"
                        onChange={(e) => setNombreUsuario(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Correo electrónico: </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña: </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirm-password">Confirmar contraseña: </label>
                    <input
                        type="password"
                        name="confirm-password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        id="confirm-password"
                    />
                </div>

                <button type="submit" onClick={handleSubmit}><i className="bi bi-person-plus-fill"></i> Registrarse</button>

                <p>¿Ya tienes una cuenta? <a href="/login">Iniciar sesión</a></p>
            </div>
        </div>
    );
}

export default Registrar;
