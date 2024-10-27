import React, { useState, useEffect } from 'react';
import { Button, Menu, Typography, Drawer } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { MenuOutlined } from '@ant-design/icons';
import './styles.css';
import plus_symbol from "../../assets/icons/plus_ymbol.png";
import auction_icon from "../../assets/icons/auctions.png";
import myCars_symbol from "../../assets/icons/myCars.jpg";
import carsStore_symbol from "../../assets/icons/cars_store.png";
import { MenuItems } from './MenuItems';

const { Text } = Typography;

const CustomHeader = ({ nickname, avatar, money }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const location = useLocation();

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  // Added effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (location.pathname === "/") {
    return null;
  }

  return (
    <>
      <Menu
        theme="dark"
        mode="horizontal"
        style={{
          width: "100%",
          lineHeight: '64px',
          display: 'flex',
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: 'flex',
            justifyContent: "space-between",
            alignItems: "center"
          }}
          className='customHeader'
        >
          <Button
            className="burgerMenuButton"
            icon={<MenuOutlined />}
            onClick={toggleDrawer}
            style={{ display: isMobile ? 'block' : 'none' }}
          />

          {!isMobile && <MenuItems />}

          <section style={{ display: 'flex', alignItems: 'center' }}>
            <Link 
              to="store"
              className={`storeLink ${isHovered ? 'scale-up' : 'scale-down'}`}
              onMouseEnter={() => setIsHovered(true)} 
              onMouseLeave={() => setIsHovered(false)}
              style={{ background: 'transparent', borderLeft: location.pathname === "/store" && '1px solid red', borderRight: location.pathname === "/store" && '1px solid red' }}
            >
              <img src={plus_symbol} alt="plus_symbol" className="headerIcon" />
              <Text style={{ marginRight: 15 }} type="warning">{`$${money}`}</Text>
            </Link>
            <Link to="/profileEditPage" className="customHeader__avatar" style={{ background: 'transparent', borderLeft: location.pathname === "/profileEditPage" || location.pathname === "/achievements" && '1px solid red', borderRight: location.pathname === "/profileEditPage" && '1px solid red' }} >
              <Typography.Text style={{ marginRight: 15, color: "#fff", fontSize: "1.4rem", fontWeight: "bold" }}>{nickname}</Typography.Text>
              <img src={avatar} alt="avatar" />
            </Link>
          </section>
        </div>

        {
          isMobile && (
            <Drawer
          title={"Menu"}
          placement="left"
          onClose={toggleDrawer}
          open={drawerVisible}
          width={"60vw"}
        >
          <div className="header__drawer" style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to="/carsStore" className="header__drawer__item" onClick={toggleDrawer}>
              <img src={carsStore_symbol} alt="carsStore_symbol" className="headerIcon" />
              <Text strong>Cars Store</Text>
            </Link>
            <Link to="/myCars" className="header__drawer__item" onClick={toggleDrawer}>
              <img src={myCars_symbol} alt="myCars_symbol" className="headerIcon" />
              <Text strong>My Cars</Text>
            </Link>
            <Link to="/auctionsHub" className="header__drawer__item" onClick={toggleDrawer}>
              <img src={auction_icon} alt="auction_icon" className="headerIcon" />
              <Text strong>Auctions</Text>
            </Link>
            <Link to="store" className="header__drawer__item store" onClick={toggleDrawer}>
              <img src={plus_symbol} alt="plus_ymbol" className="headerIcon" />
              <Text strong>{`$${money}`}</Text>
            </Link>
            <Link to="/profileEditPage" onClick={toggleDrawer}>
              <div className="drawer__avatar">
                <Text className="header__drawer__nickname">
                  {nickname}
                </Text>
                <img src={avatar} alt="avatar" />
              </div>
            </Link>
          </div>
        </Drawer>
          )
        }
      </Menu>
      <div className="headerPlaceholder"></div>
    </>
  );
};

export default CustomHeader;
