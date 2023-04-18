import React, { useState, useContext, useEffect } from "react";
import './login.css';
import {HeaderContext}  from "../header/headerContext"; // Asegúrate de que la importación coincida con la ruta correcta
import { useNavigate } from "react-router-dom";


function Login() {
    const [error, setError] = useState(false);
    const { updateHeader } = useContext(HeaderContext);
    const navigate = useNavigate();


    const handleLogin = async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`http://localhost:8000/usuario/correo/${email}/${password}`)
            const data = await response.json();

            if (!data.error) {
                // Si la respuesta es exitosa, se muestra el alert y se reinicia el formulario
                alert("¡Has iniciado sesión!");
                setError(false);
                updateHeader(true, data);
                navigate('/peliculas')
            } else {
                // Si la respuesta no es exitosa, se muestra el error y se aplica la clase de error
                setError(true);
                alert(data.error);
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="carta-login">
            <h1>Peliculas.</h1>

            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" className={error ? "error" : ""} />

            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" className={error ? "error" : ""} />

            <button onClick={handleLogin}>
                <i className="bi bi-person-fill"></i> Log in
            </button>

            <p>
                No tienes una cuenta? <a href="/registrar">Registrar</a>
            </p>

        </div>
    );
};

export default Login;
