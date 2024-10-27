import React, { useState, useEffect, useCallback } from "react";
import { Card, Col, Row, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./auctionPage.css";
import AuctionHubMyBids from "./AuctionHubCards/AuctionHubMyBids";
import AuctionHubMyAuctions from "./AuctionHubCards/AuctionHubMyAuctions";
import AuctionHubStart from "./AuctionHubCards/AuctionHubStart";
import AuctionHubSearch from "./AuctionHubCards/AuctionHubSearch";
import { playOpeningSound, playSwitchSound } from "../../functions";

export default function AuctionsHub() {
  const [focusedTile, setFocusedTile] = useState("search");

  const navigate = useNavigate();

  const handleKeyDown = useCallback(
    (event) => {
      const { key } = event
      if (event.key === "ArrowRight" && focusedTile === "search") {
        playSwitchSound();
        setFocusedTile("start");
      } else if (event.key === "ArrowLeft" && focusedTile !== "search") {
        playSwitchSound();
        setFocusedTile("search");
      } else if (event.key === "ArrowDown" && focusedTile !== "search" && focusedTile !== "myauctions") {
        setFocusedTile((prevTile) =>
          prevTile === "start" ? "mybids" : prevTile === "mybids" ? "myauctions" : prevTile === "myauctions" ? "myauctions" : prevTile
        );
        playSwitchSound();
      } else if (event.key === "ArrowUp" && focusedTile !== "search" && focusedTile !== "start") {
        setFocusedTile((prevTile) =>
          prevTile === "myauctions" ? "mybids" : prevTile === "mybids" ? "start" : prevTile
        );
        playSwitchSound();
      }
      else if (key === "Enter") {
        playOpeningSound()
        switch (focusedTile) {
          case "search":
            navigate("/auctions")
            break;
          case "start":
            navigate("/myCars")
            break;
          case "mybids":
            navigate("/myBids")
            break;
          case "myauctions":
            navigate("/myAuctions")
            break;
          default:
            break;
        }
      }
    },
    [focusedTile]
  );
  
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedTile, handleKeyDown]);

  return (
    <div className="auctionsHub" onKeyDown={handleKeyDown} tabIndex={0}>
      <Row style={{ height: "90vh", margin: "0", boxSizing: "border-box" }}>
        <AuctionHubSearch focused={focusedTile === "search"} />
        <Col span={12} style={{ height: "100%" }}>
          <AuctionHubStart focused={focusedTile === "start"} />
          <AuctionHubMyBids focused={focusedTile === "mybids"} />
          <AuctionHubMyAuctions focused={focusedTile === "myauctions"} />
        </Col>
      </Row>
    </div>
  );
}