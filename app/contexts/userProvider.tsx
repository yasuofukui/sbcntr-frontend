import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { v7 as uuidV7 } from "uuid";

interface UserContextType {
  userId: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Generate or retrieve user ID
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId === null) {
      const id = uuidV7();
      localStorage.setItem("userId", id);
      setUserId(id);
    } else {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
