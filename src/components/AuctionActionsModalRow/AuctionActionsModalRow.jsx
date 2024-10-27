import React from 'react';
import "./styles.css";

export default function AuctionActionsModalRow({handler, text, selected}) {
  return (
    <div className={selected ? "auctionActionsModal__row_selected" : "auctionActionsModal__row"} onClick={handler} tabIndex={0}>
      {text}
    </div>
  );
}
