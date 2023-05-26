import React from 'react';
import { FaInstagram, FaTwitter, FaTiktok, FaGithub } from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-row">
          <div className="footer-column">
            <h3>Sobre nosotros</h3>
            <p>¡Bienvenido a nuestra red social de películas! Explora y descubre nuevas películas, crea listas personalizadas y comparte tus favoritas con otros usuarios.</p>
          </div>
          <div className="footer-column">
            <h3>Contacto</h3>
            <p>Email: MovieSocialMedia@gmail.com</p>
            <p>Teléfono: +34 689235489</p>
          </div>
          <div className="footer-column">
            <h3>Redes sociales</h3>
            <div className="social-media-icons">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="social-icon" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="social-icon" />
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                <FaTiktok className="social-icon" />
              </a>
              <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">
                <FaGithub className="social-icon" />
              </a>
            </div>
          </div>
        </div>
        <p className="footer-text">© {new Date().getFullYear()} Movie Social Media</p>
      </div>
    </footer>
  );
};

export default Footer;
