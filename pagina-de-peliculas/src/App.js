// App.js
import React from 'react';
import './App.css';
import Header from './components/header/header';
import { HeaderContextProvider } from './components/header/headerContext'; // Importa el proveedor del contexto
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
      <div className="app">
        <Header />
      </div>
  );
}

export default App;
