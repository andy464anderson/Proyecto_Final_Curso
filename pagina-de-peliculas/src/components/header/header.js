import "./header.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { HeaderContext } from "./headerContext";
import React from "react";
import { useNavigate } from "react-router-dom";



function Header() {

  const { isLoggedIn, data, updateHeader }  = useContext(HeaderContext);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault()
    updateHeader(false, data);
    navigate('/login');
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
            <input type="text" placeholder="Buscar" />
        </div>
    </nav>

    /*<header>
        <div className="logo">
          <Link to="#">Peliculas.</Link>
        </div>

        <div className="nav">
          <Link to="">HOME</Link>
          <Link to="/peliculas">PELICULAS</Link>
          <Link to="">CONTACT</Link>
          <Link to="">ABOUT</Link>
          <Link to="/login" >LOGIN</Link>
          <Link to="/registrar">SIGNUP</Link>
        </div>

        <div className="search">
          <input type="text" placeholder="Search" />
          <button>Search</button>
        </div>
     
    </header>*/
  );
}

export default Header;
