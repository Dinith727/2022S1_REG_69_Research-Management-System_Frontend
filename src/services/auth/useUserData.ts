import { useState } from "react";

export default function useUserData() {
  const getData = () => {
    const rawData = localStorage.getItem("user-data");
    const userData = rawData !== null ? JSON.parse(rawData) : null;
    return userData;
  };

  const [userData, setUserData] = useState(getData());

  const saveData = (userData: any) => {
    localStorage.setItem("user-data", JSON.stringify(userData));
    setUserData(userData);
  };

  return {
    setUserData: saveData,
    userData,
  };
}
