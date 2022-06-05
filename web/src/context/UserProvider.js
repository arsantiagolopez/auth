import React, { useState } from "react";
import { UserContext } from "./UserContext";

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(null);
  const [sortBy, setSortBy] = useState("date");

  // Sort users based on choice
  const sortedUsers = users?.sort((a, b) => {
    // Sort users from newest to oldest
    if (sortBy === "date") {
      return a.createdAt < b.createdAt ? 1 : -1;
    }
    // Sort users alphabetically
    if (sortBy === "name") {
      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    }
  });

  return (
    <UserContext.Provider
      value={{
        sortBy,
        users,
        sortedUsers,
        setUsers,
        setSortBy,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider };
