import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HeaderContext } from "./headerContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import "./header.css";

function Header({ children }) {
  const { isLoggedIn, data, updateHeader, userData } = useContext(HeaderContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [rutaActual, setRutaActual] = useState("");
  const [isMenuBurgerOpen, setMenuBurgerOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    setRutaActual(location.pathname);
  }, [location]);

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

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 767 && isMenuBurgerOpen) {
        setMenuBurgerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuBurgerOpen]);

  const handleLogout = (e) => {
    setShowDropdown(!showDropdown);
    e.preventDefault();
    updateHeader(false, data);
    if (rutaActual.includes("/perfil/")) {
      navigate("/");
    } else {
      navigate(rutaActual);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMenuBurger = () => {
    setMenuBurgerOpen(!isMenuBurgerOpen);
  };

  return (
    <div>
      <div>
        <nav>
          <div id="menu-burger" style={{ left: isMenuBurgerOpen ? "0px" : "-200px" }}>
            <ul>
              <li>
                <Link onClick={toggleMenuBurger} to="/">Inicio</Link>
              </li>
              <li>
                <Link onClick={toggleMenuBurger} to="/peliculas">Peliculas</Link>
              </li>
              <li>
                <Link onClick={toggleMenuBurger} to="/mapaWeb">Mapa Web</Link>
              </li>
              {!isLoggedIn && (
                <li>
                  <Link onClick={toggleMenuBurger} to="/login">Iniciar sesión</Link>
                </li>
              )}
              {!isLoggedIn && (
                <li>
                  <Link onClick={toggleMenuBurger} to="/registrar">Registrarse</Link>
                </li>
              )}
              {isLoggedIn && (
                <li>
                  <Link onClick={toggleMenuBurger} to={"/perfil/" + userData.nombre_usuario}>Ver perfil</Link>
                </li>
              )}
              {isLoggedIn && (
                <li>
                  <Link to="#" onClick={handleLogout}>Cerrar sesión</Link>
                </li>
              )}
              {location.pathname !== "/search" && (
                <li>
                  <Link onClick={toggleMenuBurger} to="/search">Buscador</Link>
                </li>
              )}
              <li>
                <button className="burger-icono-boton" onClick={toggleMenuBurger}>
                  <FontAwesomeIcon className="burger-icono" icon={isMenuBurgerOpen ? faArrowLeft : faBars} />
                </button>
              </li>
            </ul>
          </div>
          <div className="menu-left">
            <img style={{cursor: "pointer"}} onClick={() => navigate("/")} src="logo.svg" alt="Logo" />
          </div>
          <div className="menu-middle">
            {windowWidth > 767 && (
              <ul>
                <li>
                  <Link to="/">Inicio</Link>
                </li>
                <li>
                  <Link to="/peliculas">Peliculas</Link>
                </li>
                <li>
                  <Link to="/mapaWeb">Mapa Web</Link>
                </li>
                {!isLoggedIn && (
                  <li className="dropdown" onClick={toggleDropdown}>
                    <Link href="#">Sesión</Link>
                    <div
                      className="dropdown-content"
                      style={{ display: showDropdown ? "block" : "none" }}
                    >
                      <Link className="topDropdown" to="/login">Iniciar sesión</Link>
                      <Link className="bottomDropdown" to="/registrar">Registrarse</Link>
                    </div>
                  </li>
                )}
                {isLoggedIn && (
                  <li className="dropdown" onClick={toggleDropdown}>
                    <Link href="#">Perfil</Link>
                    <div
                      className="dropdown-content"
                      style={{ display: showDropdown ? "block" : "none" }}
                    >
                      <Link className="topDropdown" to={"/perfil/" + userData.nombre_usuario}>Ver perfil</Link>
                      <Link className="bottomDropdown" to="#" onClick={handleLogout}>
                        Cerrar sesión
                      </Link>
                    </div>
                  </li>
                )}
              </ul>
            )}
          </div>
          <div className="menu-right">
            {(windowWidth <= 767 || isMenuBurgerOpen) && (
              <button className="burger-icono-boton" onClick={toggleMenuBurger}>
                <FontAwesomeIcon className="burger-icono" icon={isMenuBurgerOpen ? faArrowLeft : faBars} />
              </button>
            )}
            {location.pathname !== "/search" && windowWidth > 767 && (
              <Link to="/search">
                <input type="text" placeholder="Buscar" />
              </Link>
            )}
          </div>
        </nav>
      </div>

      <div id="separador-header"></div>
      <main className="content">
        {children}
      </main>
    </div>
  );
}

export default Header;
