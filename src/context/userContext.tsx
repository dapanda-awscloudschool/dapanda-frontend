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
  email: string;
  name: string;
  phoneNum: string;
  address: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
  isUserDataEmpty: () => boolean;
  favorites: number[];
  addFavorite: (memberId: string, productId: number) => Promise<void>;
  removeFavorite: (memberId: string, productId: number) => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
  isUserDataEmpty: () => true,
  clearUserData: () => {},
  favorites: [],
  addFavorite: async () => {},
  removeFavorite: async () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(() => {
    if (typeof window !== "undefined") {
      const localData = localStorage.getItem("userData");
      return localData ? JSON.parse(localData) : null;
    }
    return null;
  });

  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const localFavorites = localStorage.getItem("favorites");
      return localFavorites ? JSON.parse(localFavorites) : [];
    }
    return [];
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsInitialized(true);
    }
  }, [userData, favorites]);

  const isUserDataEmpty = useCallback(() => userData === null, [userData]);

  const clearUserData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userData");
      setUserData(null);
    }
  };

  const addFavorite = async (memberId: string, productId: number) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL_DJANGO}/api/django/wishlist/${memberId}/${productId}/`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        member_id: memberId,
        product_id: productId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add to wishlist");
    }

    setFavorites((prevFavorites) => [...prevFavorites, productId]);
  };

  const removeFavorite = async (memberId: string, productId: number) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL_DJANGO}/api/django/wishlist/${memberId}/${productId}/`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        member_id: memberId,
        product_id: productId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to remove from wishlist");
    }

    setFavorites((prevFavorites) =>
      prevFavorites.filter((id) => id !== productId)
    );
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        isUserDataEmpty,
        clearUserData,
        favorites,
        addFavorite,
        removeFavorite,
      }}
    >
      {isInitialized ? children : null}
    </UserContext.Provider>
  );
};
