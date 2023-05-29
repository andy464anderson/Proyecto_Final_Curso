import React, { useState } from 'react';

const Carousel = ({ items }) => {
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
            <img className='imagenesCarousel' src={item.imageUrl} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      <button className="carousel-prev" onClick={handlePrev}>
        Prev
      </button>
      <button className="carousel-next" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default Carousel;
