import React from 'react'
import { getImageSource } from '../../functions'
import "./slotMachine.css"

export default function SlotItem(item) {
  return (
    <div className="slotItem">
          <img src={getImageSource(item.make, item.model)} alt="" className="slotItem__image" />
          .slotItem
          <div className="slotItem__make">
            <p className="slotItem__make">{item.make}</p>
          </div>
    </div>
  )
}
