import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { HeaderContext } from '../header/headerContext';
import { useContext } from 'react';
import './mapaWeb.css'; // Importa el archivo CSS

function MapaWeb() {
  const { isLoggedIn, userData } = useContext(HeaderContext);

  return (
      <div className="mapa-web">
        <p className='breadcrumb'><span><Link className="link-breadcrumb" to="/">Inicio</Link></span><span className='separador-breadcrumb'>&gt;</span><span>Mapa Web</span></p>
        <ul className='ul-mapaWeb'>
          <li className='li-mapaWeb'>
            <Link to="/">Inicio</Link>
          </li>
          <li className='li-mapaWeb'>
            <Link to="/peliculas">Peliculas</Link>
          </li>
          {isLoggedIn && (
            <li className='li-mapaWeb'>
              <Link to={"/perfil/" + userData.nombre_usuario}>Perfil</Link>
            </li>
          )}
          {!isLoggedIn && (
            <>
              <li className='li-mapaWeb'>
                <Link to="/login">Iniciar Sesión</Link>
              </li>
              <li className='li-mapaWeb'>
                <Link to="/registrar">Registrarse</Link>
              </li>
            </>
          )}
          <li className='li-mapaWeb'>
            <Link to="/search">Buscador</Link>
          </li>
        </ul>
      </div>
  );
}

export default MapaWeb;
