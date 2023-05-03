import React from "react";
import "./perfil.css";
import { useNavigate } from "react-router-dom";
import Pelicula from "./peliculaLista";
import { useEffect, useState } from "react";

function Perfil() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [listas, setListas] = useState([]);
    const [seguidores, setSeguidores] = useState([]);
    const [seguidos, setSeguidos] = useState([]);
    const nombre_usuario = window.location.pathname.split("/")[2];

    useEffect(() => {
        const obtenerDatosUsuario = async () => {
            const responseUsuario = await fetch(`http://localhost:8000/perfil/${nombre_usuario}`, {
                method: "GET",
                headers: {
                accept: "application/json",
                },
            });
            var dataUsuario = await responseUsuario.json();
            setUsuario(dataUsuario);

            // obtener las reseñas del usuario
            const responseReviews = await fetch(`http://localhost:8000/reviews/usuario/${dataUsuario.id}`);
            const dataReviews = await responseReviews.json();
            setReviews(dataReviews);

            // obtener las listas del usuario
            const responseListas = await fetch(`http://localhost:8000/listas/${dataUsuario.id}`);
            const dataListas = await responseListas.json();
            setListas(dataListas);

            // obtener las listas del usuario
            const responseSeguidores = await fetch(`http://localhost:8000/seguidores/${dataUsuario.id}`);
            const dataSeguidores = await responseSeguidores.json();
            setSeguidores(dataSeguidores);

            // obtener las listas del usuario
            const responseSeguidos = await fetch(`http://localhost:8000/seguidos/${dataUsuario.id}`);
            const dataSeguidos = await responseSeguidos.json();
            setSeguidos(dataSeguidos);
        };
        obtenerDatosUsuario();
    }, [nombre_usuario]);

    const pintarSeguidores = () => {
       navigate(`/perfil/${nombre_usuario}/seguidores`);
    }

    const pintarSeguidos = () => {
        navigate(`/perfil/${nombre_usuario}/seguidos`);
    }
    
    if (!usuario || !reviews || !listas) {
        return <div>Cargando...</div>;
    }else{    
        return (
            <div className="perfil-container">
                <div className="perfil-header">
                    <div className="perfil-avatar">
                        <img width={200} height={200} src="sinFoto.png" alt={usuario.nombre_usuario} /> 
                    </div>
                    <div className="perfil-info">
                        <h2>{usuario.nombre_usuario}</h2>
                        <div className="seg">
                            <div className="seguidores" onClick={pintarSeguidores}>
                                <div><u>Seguidores</u></div>
                                <div>{seguidores.length}</div>                                
                            </div>
                            |
                            <div className="seguidos" onClick={pintarSeguidos}>
                                <div><u>Seguidos</u></div>
                                <div>{seguidos.length}</div>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="perfil-body">
                    <div className="todas_listas">
                        <h2>Listas:</h2>
                        {listas.map((lista) => (
                            <div className="lista">
                                <div>
                                    <div><strong>{lista.nombre_lista}</strong></div> 
                                    <div>{lista.fecha}</div>
                                    <div>{lista.tipo}</div>
                                    {lista.peliculas.map(idPeli => {
                                        return <Pelicula key={idPeli} id={idPeli} val={"lista"} />
                                    })}
                                </div>
                            </div>
                        ))}
                        
                    </div>
                    <div className="bloqueReseñas">
                        <h2>Reseñas:</h2>
                        {reviews.map((review) => (
                        <div className="perfil-review">
                            <div>
                                <div className="divPeliReview"><Pelicula key={review.id_pelicula} id={review.id_pelicula} val={"review"} /> </div>                           
                                <div>{review.fecha}</div>
                                <div>{review.contenido}</div>
                                <div className="perfil-review-rating">{review.valoracion}/10</div>
                            </div>
                            
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Perfil;