import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";

const SearchBar = ({ onSearch }) => {
  const [filterOption, setFilterOption] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFilterChange = (option) => {
    setFilterOption(option);
    onClose();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchQuery) {
      onSearch(searchQuery, filterOption);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup size="lg" width="500px">
        <InputLeftAddon p={0} bg="white">
          <Menu isOpen={isOpen} onClose={onClose}>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              onClick={onOpen}
              onMouseEnter={onOpen}
              onMouseLeave={onClose}
            >
              {filterOption}
            </MenuButton>
            <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
              <MenuItem onClick={() => handleFilterChange("All")}>All</MenuItem>
              <MenuItem onClick={() => handleFilterChange("Genre")}>Genre</MenuItem>
              <MenuItem onClick={() => handleFilterChange("Title")}>Title</MenuItem>
            </MenuList>
          </Menu>
        </InputLeftAddon>
        <Input
          placeholder={`Search by ${filterOption.toLowerCase()}...`}
          value={searchQuery}
          onChange={handleSearchChange}
          borderRadius={0}
          bg="white"
        />
        <InputRightAddon p={0} bg="white">
          <Button
            type="submit"
            leftIcon={<SearchIcon />}
            borderLeftRadius={0}
            height="100%"
            bg="white"
            _hover={{ bg: "gray.100" }}
          >
            Search
          </Button>
        </InputRightAddon>
      </InputGroup>
    </form>
  );
};

export default SearchBar;