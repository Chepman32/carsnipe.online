import { generateClient } from "aws-amplify/api";
import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations'
import SwitchSound from "./assets/audio/light-switch.mp3"
import OpeningSound from "./assets/audio/opening.MP3"
import ClosingSound from "./assets/audio/closing.MP3"
import avatar1 from "./assets/images/avatars/633acd8e-6641-4ad5-93a7-a2a4a7eedd2a.jpg"
import avatar2 from "./assets/images/avatars/df6a476f-b3ca-42c9-ab86-d3a8f539e7d8.jpg"
import avatar3 from "./assets/images/avatars/images (1).jpeg"
import avatar4 from "./assets/images/avatars/images (2).jpeg"
import avatar5 from "./assets/images/avatars/images (3).jpeg"
import avatar6 from "./assets/images/avatars/images.jpeg"

const client = generateClient();

export const fetchUserCarsRequest = async (id) => {
  try {
    const userData = await client.graphql({
      query: `
        query GetUser($id: ID!) {
          getUser(id: $id) {
            cars {
              items {
                car {
                  id
                  make
                  model
                  year
                  type
                  price
                }
              }
            }
          }
        }
      `,
      variables: {
        id
      },
    });
    return userData.data.getUser.cars.items
  } catch (error) {
    console.error("Error fetching user's cars:", error);
  }
}

export const fetchAuctionCreator = async (auctionId) => {
  try {
    const auctionUserData = await fetchAuctionUser(auctionId);
    
    if (!auctionUserData) {
      // Auction user not found
      return null;
    }
    
    return auctionUserData;
  } catch (error) {
    console.error("Error fetching auction creator:", error);
    throw error;
  }
}

export const fetchUserInfoById = async (userId) => {
  try {
    const userData = await client.graphql({
      query: queries.getUser,
      variables: {
        id: userId
      },
    });

    return userData.data.getUser;
  } catch (error) {
    console.error("Error fetching user information:", error);
    throw error;
  }
}

export const getCarTypeColor = (carType) => {
  switch (carType) {
    case "regular":
      return "#32a852"
    case "rare":
      return "#397aab"
      case "legendary":
      return "#d4ca0f"
      case "epic":
      return "#4d1ac4"
    default:
      return "#32a852"
  }
}
  
export function calculateTimeDifference(targetTime) {
  const targetDateTime = new Date(targetTime);
  const currentTime = new Date();
  const timeDifferenceInSeconds = Math.floor((targetDateTime - currentTime) / 1000);

  if (timeDifferenceInSeconds <= 0) {
    return "Finished";
  } else if (timeDifferenceInSeconds < 60) {
    return "finishing";
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    const remainingMinutes = Math.floor((timeDifferenceInSeconds % 3600) / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  }
}

export const createNewUserCar = async (userId, carId) => {
  await client.graphql({
    query: mutations.createUserCar,
    variables: {
      input: {
        userId,
        carId,
      },
    },
  });
}

export async function getUserCar(userId, carId) {
  const userCarData = await client.graphql({
    query: queries.listUserCars,
    variables: {
      filter: {
        userId: { eq: userId },
        carId: { eq: carId }
      }
    },
  });

  const toBeDeletedUserCar = userCarData.data.listUserCars.items[0]; // This should now contain the UserCar data

  return toBeDeletedUserCar;
}

export async function deleteUserCar(userCar) {
  const deletedData = await client.graphql({
    query: mutations.deleteUserCar, // Replace with your actual delete mutation
    variables: { input: { id: userCar.id } }, // Pass 'id' inside an 'input' object
  });

  return deletedData;
}

export const createNewAuctionUser = async (userId, auctionId) => {
  try {
    const result = await client.graphql({
      query: mutations.createAuctionUser,
      variables: {
        input: {
          userId,
          auctionId,
        },
      },
    });
    return result.data.createAuctionUser; // Return the created auction user data
  } catch (error) {
    console.error('Error creating auction user:', error);
    throw error; // Handle or propagate the error as needed
  }
};

export const fetchAuctionUser = async (auctionId) => {
  try {
    const auctionUserData = await client.graphql({
      query: queries.listAuctionUsers,
      variables: {
        filter: {
          auctionId: { eq: auctionId }
        }
      }
    });

    const auctionUser = auctionUserData.data.listAuctionUsers.items[0];

    if (!auctionUser) {
      // Auction user not found
      return null;
    }

    const userData = await client.graphql({
      query: queries.getUser,
      variables: {
        id: auctionUser.userId  
      }
    });

    const user = userData.data.getUser;
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export const increaseAuctionUserMoney = async (auctionUserId) => {

  try {

    // Get current user money
    const userResult = await client.graphql({
      query: queries.getUser,  
      variables: {
        id: auctionUserId
      }
    });
    
    const currentMoney = userResult.data.getUser.money;

    // Calculate new money
    const newMoney = currentMoney + 2000;

    // Update user with new money
    await client.graphql({
      query: mutations.updateUser,
      variables: {
        input: {
          id: auctionUserId,
          money: newMoney
        }
      }
    });

    console.log("Increased auction user money by 2000!");

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserCreatedAuction(auctionId) {
  try {
    const auctionUserData = await client.graphql({
      query: queries.getAuctionUser,
      variables: {
        id: auctionId
      }
    });

    const auctionUser = auctionUserData.data.getAuctionUser;

    if (!auctionUser) {
      // Auction user not found
      return null;
    }

    return auctionUser.userId;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const addUserToAuction = async (userId, auctionId) => {
  try {
    await client.graphql({
      query: mutations.createAuctionUser,
      variables: {
        input: {
          userId: userId,
          auctionId: auctionId
        }
      }
    });
  } catch (error) {
    console.error('Error adding user to auction:', error);
    // Handle error or notify the user
  }
};

export const fetchUserBiddedList = async (userId) => {
  try {
    const userData = await client.graphql({
      query: queries.getUser,
      variables: {
        id: userId,
      },
    });

    const biddedAuctions = userData.data.getUser.bidded;
    return biddedAuctions;
  } catch (error) {
    console.error("Error fetching user's bidded auctions:", error);
    return [];
  }
};

export const fetchUserAchievementsList = async (userId) => {
  try {
    const userData = await client.graphql({
      query: queries.getUser,
      variables: {
        id: userId,
      },
    });

    // Ensure we return the correct field containing the achievements
    return userData.data.getUser.achievements || []; // Return an empty array if no achievements
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    return []; // Return an empty array on error to avoid breaking the code
  }
};

export const getCarPriceByIdFromUserCar = async (userId, carId) => {
  try {
    const userData = await client.graphql({
      query: `
        query GetUserCar($userId: ID!, $carId: ID!) {
          getUser(id: $userId) {
            cars(filter: {carId: {eq: $carId}}) {
              items {
                car {
                  price
                }
              }
            }
          }
        }
      `,
      variables: {
        userId,
        carId
      },
    });

    const carData = userData.data.getUser.cars.items[0];
    if (carData && carData.car) {
      return carData.car.price;
    } else {
      throw new Error("Car not found in user's cars");
    }
  } catch (error) {
    console.error("Error fetching car price:", error);
    throw error;
  }
}

export const playSwitchSound = () => {
  const audio = new Audio(SwitchSound);
    audio.play();
}

export const playOpeningSound = () => {
  const audio = new Audio(OpeningSound);
    audio.play();
}

export const playClosingSound = () => {
  const audio = new Audio(ClosingSound);
    audio.play();
}

export const getCarsPerRow = () => {
  const width = window.innerWidth;
  if (width < 512) return 1;
  if (width < 768) return 2;
  if (width < 900) return 2;
  if (width < 1200) return 3;
  if (width < 1600) return 4;
  return 5;
};

export const selectAvatar = (avatar) => {
  switch (avatar) {
    case "avatar1":
      return avatar1;
    case "avatar2":
      return avatar2;
    case "avatar3":
      return avatar3;
    case "avatar4":
      return avatar4;
    case "avatar5":
      return avatar5;
    default:
      return avatar1;
  }
}

export function extractNameFromEmail(email) {
  return email.split('@')[0];
}

export const getImageSource = (make, model) => {
  const imageName = `${make} ${model}.png`;
  return require(`./assets/images/${imageName}`);
};