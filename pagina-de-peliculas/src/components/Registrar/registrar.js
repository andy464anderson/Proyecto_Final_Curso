import React, { useState } from "react";
import './registrar.css';

const Registrar = () => {

 

    return (
        <div className='registro-form'>
            <h1>Regístrate</h1>

            <div className="form">
           <div className="form-group">
           <label htmlFor="name">Nombre</label>
            <input type="text" name="name" id="name" />
           </div>

           <div className="form-group">
           <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" />
           </div>

           
           <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password" id="password" />
            </div>
            <div className="form-group">
            <label htmlFor="confirm-password">Confirmar contraseña</label>
            <input type="password" name="confirm-password" id="confirm-password" /></div>


            <div className="form-group">
            <label htmlFor="gender">Género</label>
            <select name="gender" id="gender">
                <option value="">Selecciona una opción</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
                <option value="otro">Otro</option>
            </select></div>

            <button><i className="bi bi-person-plus-fill"></i>Registrar</button>

            <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
            </div>
           
        </div>
    )
}

export default Registrar;
