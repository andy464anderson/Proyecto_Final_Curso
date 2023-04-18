import React, { useState } from "react";
import './registrar.css';

const Registrar = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const recibirNombre = (e) => {
        setName(e.target.value);
    }

    const recibirCorreo = (e) => {
        setEmail(e.target.value);
    }

    const recibirClave = (e) => {
        setPassword(e.target.value);
    }

    const recibirClave2 = (e) => {
        setConfirmPassword(e.target.value);
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        // mirar que el nombre tenga al menos 3 caracteres
        if(name.length < 3) {
            alert('El nombre debe tener al menos 3 caracteres');
            return;
        }


        // mirar que la contraseña tenga al menos 6 caracteres
        if(password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if(password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // mirar el formato de correo utilizando una expresión regular
        if(!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            alert('El formato del correo no es válido');
            return;
        }

        //crear objeto usuario
        const usuario = {
            id : 0,
            nombre: name,
            correo: email,
            clave: password,
            rol: 'user'
        }
        console.log(usuario);

        // enviar los datos al servidor
        console.log('Enviando datos al servidor');
        fetch('http://localhost:8000/usuario/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        }).then(res => {
            if (res.ok) {
                alert('Usuario creado correctamente');
                return res.json(); // Devuelve la promesa que se resuelve con los datos analizados como JSON
            } else {
                throw new Error('Error al crear el usuario');
            }
        }).catch(err => {
            alert(err);
        });
        

        
        

    }
    

    return (
        <div className='registro-form'>
            <h1>Regístrate</h1>

            <div className="form">
           <div className="form-group">
           <label htmlFor="name" >Nombre</label>
            <input type="text" name="name" id="name" onChange={recibirNombre}/>
           </div>

           <div className="form-group">
           <label htmlFor="email" >Email</label>
            <input type="email" name="email" id="email" onChange={recibirCorreo} />
           </div>

           
           <div className="form-group">
            <label htmlFor="password" >Contraseña</label>
            <input type="password" name="password" id="password" onChange={recibirClave} />
            </div>
            <div className="form-group">
            <label htmlFor="confirm-password" >Confirmar contraseña</label>
            <input type="password" name="confirm-password"onChange={recibirClave2} id="confirm-password" /></div>

            <button type="submit" onClick={handleSubmit}><i className="bi bi-person-plus-fill"></i>Registrar</button>

            <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
            </div>
           
        </div>
    )
}

export default Registrar;
