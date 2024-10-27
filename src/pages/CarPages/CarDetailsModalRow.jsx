import React from 'react';
import "./carsPage.css";

export default function CarDetailsModalRow({handler, text, selected}) {
  return (
    <div className={`carDetailsModal__row ${selected ? 'selected' : ''}`} onClick={handler} tabIndex={0}>
      {text}
    </div>
  );
}
