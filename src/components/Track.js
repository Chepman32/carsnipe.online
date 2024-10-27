import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import Car from "./Car/Car";
import Desert from "../night-desert-oasis-under-full-260nw-2054184080.png";
import Grass from "../green-grass-ground.png";
import Gauge from "./Gauge";

const gears = [
  { default: 0, max: 60, minRPM: 900, maxRPM: 2000 },
  { default: 40, max: 90, minRPM: 2000, maxRPM: 3500 },
  { default: 70, max: 130, minRPM: 3500, maxRPM: 5000 },
  { default: 110, max: 220, minRPM: 5000, maxRPM: 6000 },
  { default: 150, max: 300, minRPM: 6000, maxRPM: 7000 },
];

const Track = () => {
  const [speed, setSpeed] = useState(0);
  const [currentGear, setCurrentGear] = useState(0);
  const [currentRPM, setCurrentRPM] = useState(0);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const handleKeyDown = useCallback((event) => {
    if (event.key === " " && isSpacePressed) {
      setCurrentGear((prevGear) => (prevGear < gears.length - 1 ? prevGear + 1 : prevGear));
    } else if (event.key === " ") {
      setIsSpacePressed(true);
    }
  }, [isSpacePressed])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, isSpacePressed]);

  useEffect(() => {
    if (isSpacePressed) {
      const maxRPM = gears[currentGear]?.maxRPM;
      const minRPM = gears[currentGear]?.minRPM;
      const rpm = minRPM + ((speed / gears[currentGear].max) * (maxRPM - minRPM));
      setCurrentRPM(rpm);
    }
  }, [speed, currentGear, isSpacePressed]);

  const accelerate = () => {
    if (isSpacePressed) {
      const maxSpeed = gears[currentGear]?.max;
      let acceleration = 0.1; // Base acceleration factor (5 times slower)
      if (currentGear === 0) {
        acceleration = 0.02; // Make acceleration very slow for the first gear
      }
      if (currentRPM < 700 && currentRPM < gears[currentGear].maxRPM) {
        acceleration = 0.1; // Increase speed fast when currentRPM is less than 700 and less than maxRPM of current gear
      }
      setSpeed((prevSpeed) => {
        if (prevSpeed < maxSpeed) {
          // Calculate the new speed based on the desired acceleration time (4 seconds)
          const newSpeed = prevSpeed + Math.ceil(acceleration * (4 / 1000));
          return Math.min(newSpeed, maxSpeed);
        }
        return prevSpeed;
      });
    }
  };
  
  const trackRef = useRef(null);

  useEffect(() => {
    let position = 0;
    let lastPosition = 0;

    const moveTrack = () => {
      if (trackRef.current) {
        const speedFactor = speed / 40;
        position -= 10 * speedFactor;
        trackRef.current.style.backgroundPosition = `${position}px 0`;
        
        if (position <= -window.innerWidth / 3) {
          lastPosition = position;
          position = 0;
        }
      }
      requestAnimationFrame(moveTrack);
    };

    const animationId = requestAnimationFrame(moveTrack);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [speed]);

  const isCloseToNextGear = currentRPM >= gears[currentGear].maxRPM - 200 &&
    (currentRPM < gears[currentGear + 1]?.minRPM || currentGear === gears.length - 1);

  const trackStyle = {
    position: "relative",
    width: "100%",
    height: "100vh",
    minHeight: "100vh",
    backgroundImage: `url(${Grass})`,
    backgroundSize: "cover",
    backgroundRepeat: "repeat-x",
    objectFill: "cover"
  };

  return (
    <div style={trackStyle} ref={trackRef}>
      <ReactSpeedometer 
        value={currentRPM} 
        minValue={currentGear > 0 ? gears[currentGear].minRPM : 0}
        maxValue={gears[gears.length - 1].maxRPM}
        startColor={isCloseToNextGear ? "red" : "#33CC33"}
        endColor="#FF471A"
      />

      <Car speed={speed} accelerate={accelerate} />
      
      {isCloseToNextGear && currentRPM !== gears[gears.length - 1].maxRPM && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h1 style={{ color: 'red' }}>WARNING: RPM Close to Next Gear!</h1>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '20px' }}> 
        <h3 >{Math.round(currentRPM)} RPM</h3>
      </div>
    </div>
  );
};

export default Track;
