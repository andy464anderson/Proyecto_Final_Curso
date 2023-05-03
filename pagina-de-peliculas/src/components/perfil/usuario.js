import React from "react";
import "./perfil.css";
import { useEffect, useState } from "react";

function Usuario({ id }) {
    const [usuario, setUsuario] = useState(null);
  
    useEffect(() => {
        const obtenerUsuario = async () => {
            const response = await fetch(`http://localhost:8000/usuario/${id}`);
            const usuario = await response.json();
            setUsuario(usuario);
        };
  
        obtenerUsuario();
    }, [id]);
    
    if(!usuario){
        return <div></div>
    }else{
        return(
            <div className="divUsuario" id={usuario.id}>
                <div><strong>{usuario.nombre_usuario}</strong></div>
            </div>
        );
    }    
}

export default Usuario;
