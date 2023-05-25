// HeaderContext.js

import { createContext, useState, useEffect } from "react";

// Crea el contexto HeaderContext con el estado isLoggedIn y userData
export const HeaderContext = createContext(
    {
        isLoggedIn: null,
        userData: null,
        updateHeader: () => { },
        movieData: null,
        updateMovieData: () => { }
    }
);

// Crea el proveedor del contexto HeaderContext
export const HeaderContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [movieData, setMoiveData] = useState(null)
    const [userData, setUserData] = useState({
        id: null,
        correo: null,
        clave: null,
        rol: null,
        nombre_usuario: null,
        nombre_completo: null
    });

    useEffect(() => {
        const storedData = sessionStorage.getItem("sessionData");
        if (storedData) {
            const { isLoggedIn, userData } = JSON.parse(storedData);
            setIsLoggedIn(isLoggedIn);
            setUserData(userData);
        }
    }, []);

    const updateHeader = (isLoggedIn, userData) => {
        setIsLoggedIn(isLoggedIn);
        setUserData(userData);

        const sessionData = JSON.stringify({ isLoggedIn, userData });
        sessionStorage.setItem("sessionData", sessionData);
    };

    const updateMovieData = (data) => {
        setMoiveData(data)
    }

    return (
        <HeaderContext.Provider value={{ isLoggedIn, userData, updateHeader, movieData, updateMovieData }}>
            {props.children}
        </HeaderContext.Provider>
    );
}