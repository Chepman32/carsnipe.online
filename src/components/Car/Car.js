import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import CarWheel from "../CarWheel/CarWheel";
import "./car.css";
import CarImg from "../../assets/icons/car.png";

const Car = ({ speed, accelerate }) => {
  const [position, setPosition] = useState(0);
  const requestIdRef = useRef(null);
  const carRef = useRef(null);

  const moveCar = useCallback(() => {
    setPosition((prevPosition) => {
      if (prevPosition >= window.innerWidth / 4) {
        return window.innerWidth / 4;
      }
      return prevPosition + speed;
    });

    requestIdRef.current = requestAnimationFrame(moveCar);
  }, [speed]);

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      const intervalId = setInterval(accelerate, 100);
      moveCar();

      return () => {
        cancelAnimationFrame(requestIdRef.current);
        clearInterval(intervalId);
      };
    });

    return () => clearTimeout(initialDelay);
  }, [accelerate, moveCar]);

  useEffect(() => {
    gsap.to(carRef.current, { x: position, duration: 3, ease: "power1.inOut" });
  }, [position]);

  return (
    <>
      <div className="car" ref={carRef}>
        <h3 style={{ color: "#fff" }}>{speed} </h3>
        <div className="rareWheel">
          <CarWheel speed={speed * 2} />
        </div>
        <div className="frontWheel">
          <CarWheel speed={speed * 2} />
        </div>
      </div>
    </>
  );
};

export default Car;
