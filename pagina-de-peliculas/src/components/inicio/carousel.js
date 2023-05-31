import React, { useState, useEffect } from 'react';
import './carousel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

const Carousel = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex(prevIndex => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex(prevIndex => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

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
            <div>
              <h5 className='carousel-titulo'>{item.titulo}</h5>
              <p className='carousel-contenido'>{item.contenido}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
