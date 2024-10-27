import React, { useCallback, useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { Authenticator } from "@aws-amplify/ui-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Spin } from "antd";
import { listUsers } from "./graphql/queries";
import { createUser } from "./graphql/mutations";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import AuctionPage from "./pages/AuctionPage/AuctionPage";
import CustomHeader from "./components/CustomHeader/CustomHeader";
import CarsStore from "./pages/CarPages/CarsStore";
import MyCars from "./pages/CarPages/MyCars";
import AuctionsHub from "./pages/AuctionPage/AuctionHub";
import MyBids from "./pages/AuctionPage/MyBids";
import MyAuctions from "./pages/AuctionPage/MyAuctions";
import PaymentError from "./components/PaymentError";
import Store from "./pages/Store/Store";
import ProfileEditPage from "./pages/ProfileEditPage/ProfileEditPage";
import { extractNameFromEmail, selectAvatar } from "./functions";
import AchievementList from "./pages/AchievementList/AchievementList";
import { MainPage } from "./pages/MainPage/MainPage";

const client = generateClient();
Amplify.configure(awsExports);

export default function App() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);
  const [money, setMoney] = useState();

  const createNewPlayer = useCallback(async (username) => {
    if (!email) return;
  
    try {
      setCreatingUser(true);
  
      const existingUsers = await client.graphql({
        query: listUsers,
        variables: {
          filter: {
            email: { eq: email }
          }
        }
      });
  
      if (existingUsers?.data?.listUsers?.items?.length > 0) {
        const existingUser = existingUsers.data.listUsers.items[0];
        setPlayerInfo(existingUser);
        setMoney(existingUser.money);
        return;
      }
  
      const newUserData = {
        nickname: extractNameFromEmail(username) || username,
        email,
        money: 100000,
        bidded: [],
        avatar: "avatar1",
        bio: "",
        achievements: []
      };
  
      const createdPlayer = await client.graphql({
        query: createUser,
        variables: { input: newUserData }
      });
  
      if (createdPlayer?.data?.createUser) {
        setPlayerInfo(createdPlayer.data.createUser);
        setMoney(createdPlayer.data.createUser.money);
      }
    } catch (error) {
      console.error("Error creating new player:", error);
    } finally {
      setCreatingUser(false);
      setLoading(false);
    }
  }, [email]);

  const currentAuthenticatedUser = useCallback(async () => {
    try {
      const { signInDetails } = await getCurrentUser();
      setEmail(signInDetails?.loginId);
      
      const playersData = await client.graphql({
        query: listUsers
      });
      
      const playersList = playersData?.data?.listUsers.items;
      const user = playersList.find((u) => u?.email === signInDetails?.loginId);
      const isNewUser = !playersList.some((pl) => pl?.email === email);
      setIsNewUser(isNewUser);
      
      if (!user) {
        await createNewPlayer(signInDetails?.loginId);
      } else {
        setPlayerInfo(user);
        setMoney(user?.money);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching current authenticated user:", err);
      setLoading(false);
    }
  }, [createNewPlayer, email]);

  const listener = async (data) => {
    await createNewPlayer(data?.payload?.data?.nickname);
    !playerInfo && !loading && window.location.reload();
  };

  useEffect(() => {
    Hub.listen("auth", listener);
  }, [listener]);

  useEffect(() => {
    currentAuthenticatedUser();
    document.title = "Carsnipe Online";
  }, [currentAuthenticatedUser]);

  if (loading || creatingUser) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Authenticator>
        {({ signOut, user }) => (
          <>
            {playerInfo && (
              <main>
                <CustomHeader
                  money={money}
                  username={playerInfo.nickname}
                  email={email}
                  nickname={playerInfo.nickname}
                  avatar={selectAvatar(playerInfo.avatar)}
                />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <MainPage
                        playerInfo={playerInfo}
                        currentAuthenticatedUser={currentAuthenticatedUser}
                      />
                    }
                  />
                  <Route
                    path="/profileEditPage"
                    element={
                      <ProfileEditPage
                        playerInfo={playerInfo}
                        currentAuthenticatedUser={currentAuthenticatedUser}
                        signOut={signOut}
                      />
                    }
                  />
                  <Route
                    path="/carsStore"
                    element={
                      <CarsStore
                        playerInfo={playerInfo}
                        money={money}
                        setMoney={setMoney}
                      />
                    }
                  />
                  <Route
                    path="/auctions"
                    element={
                      <AuctionPage
                        playerInfo={playerInfo}
                        money={money}
                        setMoney={setMoney}
                      />
                    }
                  />
                  <Route
                    path="/myCars"
                    element={
                      <MyCars
                        playerInfo={playerInfo}
                        money={money}
                        setMoney={setMoney}
                      />
                    }
                  />
                  <Route 
                    path="/auctionsHub" 
                    element={<AuctionsHub />} 
                  />
                  <Route
                    path="/myBids"
                    element={
                      <MyBids
                        playerInfo={playerInfo}
                        money={money}
                        setMoney={setMoney}
                      />
                    }
                  />
                  <Route
                    path="/myAuctions"
                    element={
                      <MyAuctions
                        playerInfo={playerInfo}
                        money={money}
                        setMoney={setMoney}
                      />
                    }
                  />
                  <Route
                    path="/achievements"
                    element={<AchievementList userId={playerInfo.id} />}
                  />
                  <Route 
                    path="/paymentError" 
                    element={<PaymentError />} 
                  />
                  <Route
                    path="/store"
                    element={<Store email={playerInfo.email} />}
                  />
                </Routes>
              </main>
            )}
          </>
        )}
      </Authenticator>
    </BrowserRouter>
  );
}