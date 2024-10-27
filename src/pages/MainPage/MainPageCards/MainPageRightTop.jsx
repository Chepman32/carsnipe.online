import { Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const MainPageRightTop = ({ focused, handleMouseEnter }) => {
  return (
    <Link to="/store" className={`tile ${focused ? 'focused' : ''}`} onMouseEnter={() => handleMouseEnter("rightTop")}>
      <Typography.Text className="mainpage__cardText_black">
        Bank
      </Typography.Text>
    </Link>
  );
};

export default MainPageRightTop;

