// App.js
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import { HeaderContextProvider } from './components/header/headerContext'; // Importa el proveedor del contexto
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Search from './components/search/search';
import DetallePelicula from './components/peliculas/detalle_pelicula';
import Peliculas from './components/peliculas/peliculas';
import Perfil from './components/perfil/perfil';
import Login from './components/login/login';
import Registrar from './components/Registrar/registrar';
import Social from './components/perfil/social';

function App() {
  const location = useLocation();
  const showFooter = ['/peliculas', '/detalle/:id', '/search', '/perfil/:nombre_usuario'].includes(location.pathname);

  return (
    <div className="app">
      <HeaderContextProvider>
        <Header />
        <div className="content">
          <Routes>
            {/* <Route path="/" element={<Inicio />} /> */}
            <Route path="/peliculas" element={<Peliculas />} />
            <Route path="/detalle/:id" element={<DetallePelicula />} />
            <Route path="/search" element={<Search />} />
            <Route path="/perfil/:nombre_usuario/*" element={<Perfil />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Registrar />} />
            <Route path="/perfil/:nombre_usuario/seguidores" element={<Social />} />
            <Route path="/perfil/:nombre_usuario/seguidos" element={<Social />} />
          </Routes>
        </div>
        {showFooter && <Footer />}
      </HeaderContextProvider>
    </div>
  );
}


export default App;
