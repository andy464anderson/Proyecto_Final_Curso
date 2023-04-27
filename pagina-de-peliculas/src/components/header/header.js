import "./header.css";
import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, React } from "react";
import { HeaderContext } from "./headerContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { isLoggedIn, data, updateHeader } = useContext(HeaderContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    navigate("/peliculas");
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
                <Link className="topDropdown" to="/perfil">Ver perfil</Link>
                <Link className="bottomDropdown" to="/" onClick={handleLogout}>
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
  );
}

export default Header;
