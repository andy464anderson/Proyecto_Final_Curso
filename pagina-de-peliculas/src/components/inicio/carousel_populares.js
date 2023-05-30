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

  return (
    <div className="carousel">
      <div className="carousel-inner">
        {items.map((item, index) => (
          <div
            key={index}
            className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
          >
            <h2>{item.usuario}</h2>
            <p>{item.review1}</p>
            <p>{item.review2}</p>
            <p>{item.review3}</p>
            <p>{item.review4}</p>
          </div>
        ))}
      </div>


    </div>
  );
};

export default CarouselPoulares;
