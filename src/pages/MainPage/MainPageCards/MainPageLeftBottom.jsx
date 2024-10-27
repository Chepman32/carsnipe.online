import { Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const MainPageLeftBottom = ({ focused, handleMouseEnter }) => {
  return (
    <Link to="/carsStore" className={`tile ${focused ? 'focused' : ''}`} onMouseEnter={() => handleMouseEnter("leftBottom")}    >
      <Typography.Text className="mainpage__cardText_black">
        Cars Store
      </Typography.Text>
    </Link>
  );
};

export default MainPageLeftBottom;

