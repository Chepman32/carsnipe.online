import { Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const MainPageCenter = ({ focused, handleMouseEnter }) => {
  return (
    <Link to="/auctionsHub" className={`tile ${focused ? 'focused' : ''}`} onMouseEnter={() => handleMouseEnter("center")}>
      <Typography.Text className="mainpage__cardText_black">
        Auctions
      </Typography.Text>
    </Link>
  );
};

export default MainPageCenter;

