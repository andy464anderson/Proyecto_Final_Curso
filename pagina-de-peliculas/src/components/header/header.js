import "./header.css";
import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, React } from "react";
import { HeaderContext } from "./headerContext";
import { useNavigate } from "react-router-dom";
import Hamburguesa from './hamburguesa'; // Ruta al archivo del componente Hamburguesa


function Header({ children }) {
  const { isLoggedIn, data, updateHeader, userData } = useContext(HeaderContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [rutaActual, setRutaActual] = useState("");
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    setRutaActual(location.pathname);
  }, [location]);

  var nombre_usuario = "";
  if (userData != undefined) {
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

  const toggleAbierto = () => {
    setAbierto(!abierto);
  };

  return (
    <div>
      {window.innerWidth <= 767 ? (
        <div>
          {/* <Hamburguesa /> */}
        </div>
      ) : (
        <nav>
        <div className="menu-left">
          <img src="logo.svg" alt="Logo" />
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
                  <Link className="topDropdown" to={nombre_usuario}>Ver perfil</Link>
                  <Link className="bottomDropdown" to="#" onClick={handleLogout}>
                    Cerrar sesión
                  </Link>
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
      )}
      
      <div id="separador-header">
      </div>
      <main className="content">
        {children}
      </main>
    </div>
  );
}

export default Header;
