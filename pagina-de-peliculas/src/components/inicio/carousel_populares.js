import React, { useState } from 'react';
import './carousel_populares.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

const CarouselPoulares = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex(prevIndex => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex(prevIndex => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };
  console.log(items);

  return (
    <div className="carousel">
      <div className="carousel-inner">
        {items.map((item, index) => (
          <div
            key={index}
            className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
          >
            <div className="carousel-central">
              <button className="carousel-button" onClick={handlePrev}>
                <FontAwesomeIcon icon={faAnglesLeft} />
              </button>
              <img className='imagenesCarousel' src={item.imageUrl} alt={item.titulo} />
              <button className="carousel-button" onClick={handleNext}>
                <FontAwesomeIcon icon={faAnglesRight} />
              </button>
            </div>
            <h2>{item.usuario}</h2>
            {item.listaReviews.map((review, index) => {
              return (
                <p key={index}>{review.contenido}</p>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselPoulares;
