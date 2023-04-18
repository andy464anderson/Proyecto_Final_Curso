import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { HeaderContext } from "./headerContext"; // Asegúrate de que la importación coincida con la ruta correcta
import "./header.css";

function Header() {
  const { isLoggedIn,userData, updateHeader } = useContext(HeaderContext);

  useEffect(() => {
    // Aquí puedes realizar cualquier acción que necesites después de que se actualice isLoggedIn en el contexto
    console.log("isLoggedIn actualizado:", isLoggedIn);
    console.log("userData actualizado:", userData);
    // También puedes hacer actualizaciones en el componente Header aquí si es necesario
  }, [isLoggedIn]);

  const handleLogout = () => {
    // Lógica para el cierre de sesión
    // Puedes implementar la lógica para cerrar sesión y actualizar el estado del contexto aquí
    // Por ejemplo, puedes llamar a updateHeader(false, null) para actualizar el estado de isLoggedIn a falso y borrar los datos de inicio de sesión
    // window.location.href = "/login"; // Puedes redirigir a la página de inicio de sesión después de cerrar sesión
    updateHeader(false, null);
  };

  return (
    <header>
      <div className="logo">
        <Link to="#">Peliculas.</Link>
      </div>

      <div className="nav">
        <Link to="/">HOME</Link>
        <Link to="/peliculas">PELICULAS</Link>
        <Link to="/">CONTACT</Link>
        <Link to="/">ABOUT</Link>
        {!isLoggedIn ? (
          // Mostrar enlaces de inicio de sesión y registro si no está autenticado
          <>
            <Link to="/login">LOGIN</Link>
            <Link to="/registrar">SIGNUP</Link>
          </>
        ) : (
          // Mostrar enlace de cierre de sesión si está autenticado
          <Link to="/" onClick={handleLogout}>
            LOGOUT
          </Link>
        )}
      </div>

      <div className="search">
        <input type="text" placeholder="Search" />
        <button>Search</button>
      </div>
    </header>
  );
}

export default Header;
