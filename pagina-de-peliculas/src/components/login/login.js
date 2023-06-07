import React, { useState, useContext, useEffect } from "react";
import './login.css';
import { HeaderContext } from "../header/headerContext"; // Asegúrate de que la importación coincida con la ruta correcta
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function Login() {
    const [error, setError] = useState(false);
    const { updateHeader, isLoggedIn } = useContext(HeaderContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
            toast.warning("No puedes acceder a esa página si ya has iniciado sesión", { autoClose: 2500 });
        }
    }, [isLoggedIn, navigate]);


    const handleLogin = async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`http://localhost:8000/usuario/correo/${email}/${password}`)
            const data = await response.json();

            if (!data.error) {
                setError(false);
                updateHeader(true, data);
                navigate('/')
            } else {
                setError(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="carta-login">
            <div className="tab-row">
                <div className={"tab-item selected"}>
                    Inicio de sesión
                </div>
                <div className={"tab-item"} onClick={() => navigate("/registrar")}>
                    Registro
                </div>
            </div>

            <label htmlFor="email">Correo electrónico: </label>
            <input type="email" onFocus={() => setError(false)} name="email" id="email" />

            <label htmlFor="password">Contraseña: </label>
            <input type="password" onFocus={() => setError(false)} name="password" id="password" />

            <button onClick={handleLogin}>
                <i className="bi bi-person-fill"></i> Iniciar sesión
            </button>

            {error && <p style={{ color: "red" }}>Su correo electrónico y su contraseña no coinciden. Por favor, inténtelo de nuevo.</p>}

            <p>
                No tienes una cuenta? <a className="link" onClick={() => navigate("/registrar")}>Registrarse</a>
            </p>
        </div>
    );
};

export default Login;
