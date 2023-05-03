import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Peliculas from "./components/peliculas/peliculas";
import DetallePelicula from "./components/peliculas/detalle_pelicula";
import Login from "./components/login/login";
import Registrar from "./components/Registrar/registrar";
import Search from "./components/search/search";
import Perfil from "./components/perfil/perfil";
import { HeaderContextProvider } from "./components/header/headerContext";
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Social from "./components/perfil/social";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HeaderContextProvider>
  <React.StrictMode>
    <BrowserRouter>
        <App />
      <Routes>
        <Route path="/peliculas" element={<Peliculas />} />
        <Route path="/detalle/:id" element={<DetallePelicula />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/search" element={<Search />} />
        <Route path="/perfil/:nombre_usuario" element={<Perfil />} />
        <Route path="/perfil/:nombre_usuario/seguidores" element={<Social />} />
        <Route path="/perfil/:nombre_usuario/seguidos" element={<Social />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
  </HeaderContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
