import "./header.css";
import { Link } from "react-router-dom";

import React from "react";

const irALogin = () => {
  window.location.href = "/login";
};

function Header() {
  return (
    <header>
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
     
    </header>
  );
}

export default Header;
