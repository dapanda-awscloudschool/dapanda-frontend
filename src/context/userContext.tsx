"use client";

import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

interface UserData {
  memberId: string;
  name: string;
}

interface UserContextType {
  userData: UserData[];
  setUserData: (data: UserData[]) => void;
  clearUserData: () => void;
  isUserDataEmpty: () => boolean;
}

export const UserContext = createContext<UserContextType>({
  userData: [],
  setUserData: () => [],
  isUserDataEmpty: () => false,
  clearUserData: () => [],
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
    return [];
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userData", JSON.stringify(userData));
      setIsInitialized(true);
    }
  }, [userData]);

  const isUserDataEmpty = useCallback(() => userData.length === 0, [userData]);

  const clearUserData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userData");
      setUserData([]);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        isUserDataEmpty,
        clearUserData,
      }}
    >
      {isInitialized ? children : null}
    </UserContext.Provider>
  );
};
