// HeaderContext.js

import { createContext, useState } from "react";

// Crea el contexto HeaderContext con el estado isLoggedIn y userData
export const HeaderContext = createContext(
    {
        isLoggedIn: null,
        userData: null,
        updateHeader: () => { }
    }
);

// Crea el proveedor del contexto HeaderContext
export const HeaderContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [userData, setUserData] = useState({
        id: null,
        nombre: null,
        correo: null,
        clave: null,
        rol: null
    });

    const updateHeader = (isLoggedIn, userData) => {
        setIsLoggedIn(isLoggedIn);
        setUserData(userData);
    };

    return (
        <HeaderContext.Provider value={{ isLoggedIn, userData, updateHeader }}>
            {props.children}
        </HeaderContext.Provider>
    );
}