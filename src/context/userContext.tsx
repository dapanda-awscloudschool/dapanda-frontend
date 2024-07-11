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
  // Initialize state from localStorage if available and only on the client-side
  const [userData, setUserData] = useState<UserData[]>(() => {
    if (typeof window !== "undefined") {
      const localData = localStorage.getItem("userData");
      return localData ? JSON.parse(localData) : [];
    }
    return []; // Return empty array if not running in the browser
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Use useEffect to update localStorage when userData changes, but only on the client-side
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

  const updateUserData = (newData: Partial<UserData>) => {
    if (userData.length > 0) {
      const updatedData = { ...userData[0], ...newData };
      setUserData([updatedData]);
    } else {
      setUserData([{ ...newData } as UserData]);
    }
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
      {isInitialized ? children : null}
    </UserContext.Provider>
  );
};
