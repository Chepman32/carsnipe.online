import React, { useEffect, useRef } from 'react';
import './carWheel.css';

const CarWheel = ({ speed }) => {
  const wheelRef = useRef(null);

  useEffect(() => {
    const rotationSpeed = `rotate ${100 / speed}s linear infinite`;
    if (wheelRef.current) {
      wheelRef.current.style.animation = 'none';
      setTimeout(() => {
        wheelRef.current.style.animation = rotationSpeed;
      }, 0);
    }
  }, [speed]);

  return (
    <div className="car-wheel" ref={wheelRef}>
    </div>
  );
};

export default CarWheel;
