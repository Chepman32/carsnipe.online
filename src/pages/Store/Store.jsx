import React, { useState } from "react";
import "./store.css";
import coin_symbol from "../../assets/icons/coin_symbol.png"
import { Link } from "react-router-dom";
import SlotMachine from "../../components/SlotMachine/SlotMachine";

const StoreItemCard = ({ item, email, username }) => {
  const [isBouncing, setIsBouncing] = useState(false);

  const handleClick = () => {
    // Trigger the bounce animation
    setIsBouncing(true);
    // Reset animation after it completes (duration: 0.5s)
    setTimeout(() => setIsBouncing(false), 500);
  };

  return (
    <Link to={item.link} key={item.id}
      className={`store-item-card ${isBouncing ? "bounce" : ""}`}
      onClick={handleClick}
    >
      <img src={coin_symbol} alt={item.name} className="item-image" />
      <h2 className="item-quantity">{item.name}</h2>
      <p className="item-price">{item.price.toLocaleString()} $</p>
    </Link>
  );
};

const Store = ({ email, username }) => {
  const items = [
    {
      id: 1,
      name: "50,000 CR",
      price: 1.99,
      link: `https://buy.stripe.com/test_3cs7uM54n4kp3FS6ov?prefilled_email=${email}`
    },
    {
      id: 2,
      name: "100,000 CR",
      price: 3.99,
      link: `https://buy.stripe.com/test_dR64iAaoHg370tG8wE?prefilled_email=${email}`
    },
    {
      id: 3,
      name: "200,000 CR",
      price: 6.99,
      link: `https://buy.stripe.com/test_dR68yQdAT3gla4g6ox?prefilled_email=${email}`
      },
    {
      id: 4,
      name: "300,000 CR",
      price: 10.99,
      link: `https://buy.stripe.com/test_14k8yQbsLdUZekweV4?prefilled_email=${email}`
      },
      {
        id: 5,
        name: "500,000 CR",
        price: 15.99,
        link: `https://buy.stripe.com/test_aEUg1i2Wf4kp2BO7sD?prefilled_email=${email}`
      },
      {
        id: 6,
        name: "1,000,000 CR",
        price: 25.99,
        link: `https://buy.stripe.com/test_14kcP62WfeZ3gsEbIU?prefilled_email=${email}`
      },
  ];

  return (
    <div>
      <section className="store-container">
      {items.map((item) => (
          <StoreItemCard key={item.id} item={item} email={email} username={username} />
      ))}
      </section>
    </div>
  );
};

export default Store;