import "./botonEliminarUsuario.css";
import React from "react";
import "react-tippy/dist/tippy.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BotonEliminarUsuario = ({ usuario, actualizar }) => {

    const eliminarUsuario = async () => {
        if (usuario.rol !== "admin") {
            if (typeof actualizar === "function") {
                actualizar(usuario);
            }

            const eliminarListas = await fetch(`http://localhost:8000/listasUsuario/${usuario.id}`, {
                method: "DELETE"
            });

            const eliminarReviews = await fetch(`http://localhost:8000/reviewsUsuario/${usuario.id}`, {
                method: "DELETE"
            });

            const eliminarSeguidores = await fetch(`http://localhost:8000/seguidoresUsuario/${usuario.id}`, {
                method: "DELETE"
            });

            const eliminarSeguidos = await fetch(`http://localhost:8000/seguidosUsuario/${usuario.id}`, {
                method: "DELETE"
            });

            const eliminar = await fetch(`http://localhost:8000/usuario/${usuario.id}`, {
                method: "DELETE"
            });
            const dataEliminar = await eliminar.json();

            const responseUsuarios = await fetch(`http://localhost:8000/usuarios`);
            const dataUsuarios = await responseUsuarios.json();
            
            toast.success("Usuario eliminado correctamente", { autoClose: 2500 });
        } else {
            toast.warning("No puedes eliminar a otro usuario administrador", { autoClose: 2500 });
        }

    }

    return (
        <div className="boton-eliminar-usuario">
            <button onClick={() => eliminarUsuario()}>
                Eliminar usuario
            </button>
        </div>
    );


};

export default BotonEliminarUsuario;
