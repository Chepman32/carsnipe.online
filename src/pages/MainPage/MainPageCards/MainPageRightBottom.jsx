import React from 'react'
import { Card, Typography } from 'antd'
import { Link } from 'react-router-dom'

const MainPageRightBottom = ({ focused, handleMouseEnter }) => {
  return (
    <Link to="/profileEditPage" className={`tile ${focused ? 'focused' : ''}`} onMouseEnter={() => handleMouseEnter("rightBottom")}>
      <Typography.Text className="mainpage__cardText_black">
        Profile
      </Typography.Text>
    </Link>
  )
}

export default MainPageRightBottom
