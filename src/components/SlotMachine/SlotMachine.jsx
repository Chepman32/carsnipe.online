import React, { useState, useCallback, useRef } from 'react';
import './slotMachine.css';
import { carImages } from '../../constants';
import SlotItem from './SlotItem';

const slotItems = carImages.map((car, index) => <SlotItem key={index} {...car} />);

const imageHeight = Math.round(window.innerHeight * 0.3333);  // Ensure the height is an exact integer
const numImages = carImages.length;
const spinDuration = 2000; // Total duration of the spin
const decelerationDuration = 1000; // Time for deceleration
const initialSpinSpeed = 50; // Speed when spinning starts

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);  // Easing function for smooth stop

const WheelSpin = () => {
  const [index, setIndex] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [reelStyle, setReelStyle] = useState({});
  const spinStartTime = useRef(0);
  const animationFrameId = useRef(null);

  const getRandomIndex = useCallback(() => {
    return Math.floor(Math.random() * numImages);
  }, []);

  const spin = useCallback((finalIndex) => {
    let position = 0;  // Current Y-axis position
    let lastTimestamp = performance.now();

    console.log('Spinning started! Final Index:', finalIndex);  // Log when the spin starts

    const animate = (timestamp) => {
      const elapsed = timestamp - spinStartTime.current;
      let currentSpinSpeed = initialSpinSpeed;

      if (elapsed > spinDuration - decelerationDuration) {
        // Deceleration Phase
        const decelerationProgress = (elapsed - (spinDuration - decelerationDuration)) / decelerationDuration;
        const easedProgress = easeOutCubic(decelerationProgress);
        currentSpinSpeed = initialSpinSpeed + (500 - initialSpinSpeed) * easedProgress;
      }

      if (elapsed < spinDuration) {
        // During the spin
        const delta = timestamp - lastTimestamp;
        position += (delta / currentSpinSpeed) * imageHeight;
        position %= (numImages * imageHeight);  // Ensure position loops correctly

        // Update reel position without transition during spin
        setReelStyle({
          transform: `translateY(-${position}px)`,
          transition: 'none',
        });

        lastTimestamp = timestamp;
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        // Snap to the final index precisely
        let finalPosition = finalIndex * imageHeight;

        // Apply rounding to avoid sub-pixel issues
        finalPosition = Math.round(finalPosition);

        // Log the final position right before snapping
        console.log(`Final Position before snapping: ${finalPosition}px`);
        console.log('Image Height:', imageHeight, ' Final Index:', finalIndex);

        // Log reel's current style before the transition
        console.log('Reel style before final snap:', reelStyle.transform);

        // Set the reel style with final transition
        setReelStyle({
          transform: `translateY(-${finalPosition}px)`,
          transition: 'transform 500ms ease-out',  // Smooth ease-out transition for the last stop
        });

        // Log after the spin finishes and ensure final position is applied correctly
        setTimeout(() => {
          console.log('Spin finished. Final Position should be:', finalPosition);
          console.log('Reel style after snap:', reelStyle.transform);  // Log final position after the snap
        }, 500);

        setIndex(finalIndex);
        setSpinning(false);  // Mark spin as finished
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);
}, [reelStyle.transform]);

  const handleSpin = useCallback(() => {
    if (!spinning) {
      setSpinning(true);
      spinStartTime.current = performance.now();
      const finalIndex = getRandomIndex();
      spin(finalIndex);
    }
  }, [spinning, getRandomIndex, spin]);
    

  return (
    <div className="wheel-spin-container">
      <div className="wheel-spin-window">
        <div className="wheel-spin-reel" style={reelStyle}>
          {[...slotItems, ...slotItems]}
        </div>
      </div>
      <button
        onClick={handleSpin}
        disabled={spinning}
        className="wheel-spin-button"
      >
        {spinning ? 'Spinning...' : 'PLAY'}
      </button>
    </div>
  );
};

export default WheelSpin;