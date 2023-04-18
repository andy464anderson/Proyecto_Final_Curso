import "./header.css";
import { Link } from "react-router-dom";

import React from "react";

const irALogin = () => {
  window.location.href = "/login";
};

function Header() {
  return (
    <nav>
        <div className="menu-left">
            <img src="logo.png" alt="Logo" />
        </div>
        <div className="menu-middle">
            <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/peliculas">Peliculas</a></li>
                <li><a href="/">Contacto</a></li>
                <li><a href="/login">Iniciar sesión</a></li>
                <li><a href="/registrar">Registrarse</a></li>
                <li><a href="/">Perfil</a></li>
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
