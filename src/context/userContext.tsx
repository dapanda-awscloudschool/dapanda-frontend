"use client";

import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

interface UserData {
  memberString: string;
  email: string;
  name: string;
  phoneNum: string;
  address: string;
  memberId: number;
  memStatus: number;
}

interface UserContextType {
  userData: UserData[];
  setUserData: (data: UserData[]) => void;
  clearUserData: () => void;
  isUserDataEmpty: () => boolean;
  updateUserData: (newData: Partial<UserData>) => void;
}

export const UserContext = createContext<UserContextType>({
  userData: [],
  setUserData: () => [],
  isUserDataEmpty: () => false,
  clearUserData: () => [],
  updateUserData: () => [],
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData[]>(() => {
    if (typeof window !== "undefined") {
      const localData = localStorage.getItem("userData");
      return localData ? JSON.parse(localData) : [];
    }
    return []; // Return empty array if not running in the browser
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load userData from localStorage when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userData", JSON.stringify(userData));
      setIsInitialized(true);
    }
  }, [userData]);

  // Update localStorage when userData changes
  useEffect(() => {
    console.log("userData check", userData);
  }, [userData]);

  const isUserDataEmpty = useCallback(() => userData.length === 0, [userData]);

  const clearUserData = () => {
    localStorage.removeItem("userData");
    setUserData([]);
  };

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData((prevUserData) => {
      if (prevUserData.length > 0) {
        const updatedData = { ...prevUserData[0], ...newData };
        return [updatedData];
      } else {
        return [{ ...newData } as UserData];
      }
    });
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        isUserDataEmpty,
        clearUserData,
        updateUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
