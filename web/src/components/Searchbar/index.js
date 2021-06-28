import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useQuery } from "urql";
import { UserContext } from "../../context/UserContext";
import { AllUserProfiles as AllUserProfilesQuery } from "../../graphql/queries/user";
import { handleBlur } from "../../utils/handleBlur";
import { useUser } from "../../utils/useUser";
import { Results } from "./Results";

const Searchbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const { user } = useUser();
  const { users, setUsers } = useContext(UserContext);

  // Query all user profiles
  const [{ data }] = useQuery({ query: AllUserProfilesQuery });

  const searchRef = useRef(null);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Update search value on change
  const handleChange = (event) => setSearchValue(event.target.value);

  // Load & store users globally
  useEffect(() => {
    if (data?.allUserProfiles && user?.me) {
      setUsers(data.allUserProfiles);
    }
  }, [data]);

  // Filter results based on name or email
  useEffect(async () => {
    // Reset results on empty search value
    if (searchValue === "") {
      // End loading animation
      setIsLoading(false);

      return setResults([]);
    }

    if (users) {
      // Fake loading animation
      setIsLoading(true);

      const filteredResults = users.filter((result) => {
        const { name, email } = result;

        // Convert search to lowercase
        const lowercaseName = name?.toLowerCase();
        const lowercaseEmail = email?.toLowerCase();
        const lowercaseSearch = searchValue && searchValue.toLowerCase();

        // Check if name or email match any part of search
        const includesName = lowercaseName?.includes(lowercaseSearch);
        const includesEmail = lowercaseEmail?.includes(lowercaseSearch);

        if (includesName || includesEmail) {
          return result;
        }
      });

      // Sort users alphabetically
      filteredResults.sort((a, b) =>
        a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
      );

      // Update results on value change
      setResults(filteredResults);

      // Wait for 1000 ms
      await delay(1000);

      // End loading animation
      setIsLoading(false);
    }
  }, [searchValue]);

  const resultsProps = { handleBlur, searchRef, setIsSearchFocused, results };

  return (
    <InputGroup ref={searchRef} {...styles.wrapper}>
      <InputLeftElement
        pointerEvents="none"
        children={<IoSearchSharp color="lightgray" />}
      />
      <Input
        isTruncated
        placeholder="Search by name or email"
        onChange={handleChange}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={(e) => handleBlur(e, searchRef, setIsSearchFocused)}
        {...styles.input}
      />
      <InputRightElement
        pointerEvents="none"
        children={<Spinner {...styles.spinner} />}
        display={isLoading ? "flex" : "none"}
      />

      {/* Results bar */}
      {isSearchFocused && <Results {...resultsProps} />}
    </InputGroup>
  );
};

export { Searchbar };

// Styles

const styles = {
  wrapper: {
    tabIndex: "0",
    position: "relative",
    width: "100%",
  },
  input: {
    background: "tertiary",
    spellCheck: "false",
    marginY: "auto",
    color: "text",
    borderRadius: "0.5em",
    border: "none",
    _focus: {
      borderColor: "secondary",
    },
  },
  spinner: {
    color: "link",
    size: "sm",
    thickness: "1px",
  },
};
