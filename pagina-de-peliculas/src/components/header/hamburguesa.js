import React from 'react';
import { slide as Menu } from 'react-burger-menu';

function Hamburguesa() {
  return (
    <Menu>
      <a className="menu-item" href="/">
        Inicio
      </a>
      <a className="menu-item" href="/about">
        Acerca de
      </a>
      <a className="menu-item" href="/contact">
        Contacto
      </a>
    </Menu>
  );
};

export default Hamburguesa;
