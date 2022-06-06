import { createContext } from "react";

const UserContext = createContext({
  sortBy: null,
  users: null,
  sortedUsers: null,
  setUsers: () => {},
  setSortBy: () => {},
});

export { UserContext };
