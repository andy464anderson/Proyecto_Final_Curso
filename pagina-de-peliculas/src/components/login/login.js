import './login.css';
import React, { useState } from "react";

const Login = () => {

    

    return (
        <div className='carta-login'>
            <h1>Peliculas.</h1>

            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" />

            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" />

            <button><i className="bi bi-person-fill"></i>
Log in</button>

            <p>No tienes una cuenta? <a  href='/registrar'>Registrar</a></p>
        </div>
    )
}

export default Login