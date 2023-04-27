import "./header.css";
import { Link, useLocation } from "react-router-dom";
<<<<<<< HEAD
import { useContext, useState, useEffect } from "react";
=======
import { useContext, useState, useEffect, React } from "react";
>>>>>>> search
import { HeaderContext } from "./headerContext";
import { useNavigate } from "react-router-dom";

<<<<<<< HEAD


function Header() {  
  const { isLoggedIn, data, updateHeader }  = useContext(HeaderContext);
  const navigate = useNavigate();
  const location=useLocation();  
  const [showDropdown, setShowDropdown] = useState(false);
=======
function Header() {
  const { isLoggedIn, data, updateHeader } = useContext(HeaderContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
>>>>>>> search

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".dropdown") === null) {
        setShowDropdown(false);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
  
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);
<<<<<<< HEAD

=======
>>>>>>> search

  const handleLogout = (e) => {
    setShowDropdown(!showDropdown);
    e.preventDefault();
    updateHeader(false, data);
    navigate("/peliculas");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav>
      <div className="menu-left">
        <img src="logo.png" alt="Logo" />
      </div>
      <div className="menu-middle">
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/peliculas">Peliculas</Link>
          </li>
          <li>
            <Link to="/">Contacto</Link>
          </li>
          {!isLoggedIn && (
            <li className="dropdown" onClick={toggleDropdown}>
<<<<<<< HEAD
              <a href="#">Perfil</a>
=======
              <Link href="#">Sesión</Link>
>>>>>>> search
              <div
                className="dropdown-content"
                style={{ display: showDropdown ? "block" : "none" }}
              >
<<<<<<< HEAD
              <Link className="topDropdown" to="/login">Iniciar sesión</Link>
              <Link className="bottomDropdown" to="/registrar">Registrarse</Link>
              </div>
=======
                  <Link className="topDropdown" to="/login">Iniciar sesión</Link>
                  <Link className="bottomDropdown" to="/registrar">Registrarse</Link>
              </div> 
>>>>>>> search
            </li>
          )}
          {isLoggedIn && (
            <li className="dropdown" onClick={toggleDropdown}>
<<<<<<< HEAD
              <a href="#">Perfil</a>
=======
              <Link href="#">Perfil</Link>
>>>>>>> search
              <div
                className="dropdown-content"
                style={{ display: showDropdown ? "block" : "none" }}
              >
<<<<<<< HEAD
              <Link className="topDropdown" to="/perfil">Ver perfil</Link>
              <Link className="bottomDropdown" href="/" onClick={handleLogout}>
                Cerrar sesión
              </Link>
=======
                <Link className="topDropdown" to="/perfil">Ver perfil</Link>
                <Link className="bottomDropdown" to="/" onClick={handleLogout}>
                  Cerrar sesión
                </Link>
>>>>>>> search
              </div>
            </li>
          )}
        </ul>
      </div>
      <div className="menu-right">
        {location.pathname !== "/search" && (
          <Link to="/search">
            <input type="text" placeholder="Buscar" />
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Header;
