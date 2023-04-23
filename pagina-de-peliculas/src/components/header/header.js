import "./header.css";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { HeaderContext } from "./headerContext";
import React from "react";
import { useNavigate } from "react-router-dom";



function Header() {

  const { isLoggedIn, data, updateHeader }  = useContext(HeaderContext);
  const navigate = useNavigate();
  const location=useLocation();

  const handleLogout = (e) => {
    e.preventDefault()
    updateHeader(false, data);
    navigate('/peliculas');
  }

  return (
    <nav>
        <div className="menu-left">
            <img src="logo.png" alt="Logo" />
        </div>
        <div className="menu-middle">
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/peliculas">Peliculas</Link></li>
                <li><Link to="/">Contacto</Link></li>
                {! isLoggedIn && <li><Link to="/login">Iniciar sesión</Link></li>}
                {! isLoggedIn && <li><Link to="/registrar">Registrarse</Link></li>}
                { isLoggedIn && <li><Link  onClick={handleLogout} >Logout</Link></li>}
                { isLoggedIn && <li><Link to="/perfil">Perfil</Link></li>}

            </ul>
        </div>
        <div className="menu-right">
        {location.pathname !== '/search' && (
            <Link to="/search"><input type="text" placeholder="Buscar" /></Link>
        )}
        </div>

    </nav>
  );
}

export default Header;