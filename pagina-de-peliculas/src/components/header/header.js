import "./header.css";
import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, React } from "react";
import { HeaderContext } from "./headerContext";
import { useNavigate } from "react-router-dom";
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';


function Header({ children }) {
  const { isLoggedIn, data, updateHeader, userData } = useContext(HeaderContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [rutaActual, setRutaActual] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Estado para almacenar el ancho de la ventana

  useEffect(() => {
    setRutaActual(location.pathname);
  }, [location]);

  var nombre_usuario = "";
  if (userData !== undefined) {
    nombre_usuario = "/perfil/" + userData.nombre_usuario;
  }

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
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // El segundo argumento del useEffect está vacío para que solo se ejecute una vez al montar el componente

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
    var top = $("#menu-burger").css("left");
    if (top === "0px") {
      $("#menu-burger").css({
        "left": "-200px"
      });
    } else {
      $("#menu-burger").css({
        "left": "0px"
      });
    }
  };

  return (
    <div>

      <div>

        <nav>
          <div id="menu-burger">
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
            </ul>
          </div>
          <div className="menu-left">
            <img src="logo.svg" alt="Logo" />
          </div>
          <div className="menu-middle">
            {window.innerWidth > 767 && (
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
            {(windowWidth <= 767 || abierto) && (
              <button onClick={toggleMenuBurger}>
                <FontAwesomeIcon id="burger-icono" icon={faBars} />
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



      <div id="separador-header">
      </div>
      <main className="content">
        {children}
      </main>
    </div>
  );
}

export default Header;
