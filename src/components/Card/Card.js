import React from 'react'

import './Card.scss'
import img from 'Images/avatar.png'

function Card(props) {
  const { card } = props
  return (
    <div className="card-item">
      {card.cover &&
      <img src={card.cover}
        alt="mc"
        className="card-cover"
        onMouseDown={e => e.preventDefault()}>
      </img>
      }

      {card.title}
    </div>
  )
}

export default Card
