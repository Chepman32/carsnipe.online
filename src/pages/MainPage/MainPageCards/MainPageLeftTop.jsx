import React from 'react';
import { Card, Typography } from 'antd';
import { Link } from 'react-router-dom';

const MainPageLeftTop = ({ focused, handleMouseEnter }) => {
  return (
    <Link to="/mycars" className={`tile ${focused ? 'focused' : ''}`} onMouseEnter={() => handleMouseEnter("leftTop")}>
      <Typography.Text className="mainpage__cardText_black">
        My Cars
      </Typography.Text>
    </Link>
  );
};

export default MainPageLeftTop;
