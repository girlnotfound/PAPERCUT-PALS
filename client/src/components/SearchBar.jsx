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
  Portal,
  Box,
  useStyleConfig,
} from "@chakra-ui/react";
import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";

const SearchBar = ({ onSearch }) => {
  const [filterOption, setFilterOption] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const menuListStyles = useStyleConfig("Menu", { variant: "unstyled" });

  const handleFilterChange = (option) => {
    setFilterOption(option);
    setIsOpen(false);
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
          <Box overflow="visible">
            <Menu isOpen={isOpen} onClose={() => setIsOpen(false)} placement="bottom-end">
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                onClick={() => setIsOpen(!isOpen)}
              >
                {filterOption}
              </MenuButton>
              <Portal>
                <MenuList zIndex={1000} sx={{ ...menuListStyles, boxShadow: "none" }}>
                  <MenuItem onClick={() => handleFilterChange("All")}>All</MenuItem>
                  <MenuItem onClick={() => handleFilterChange("Genre")}>Genre</MenuItem>
                  <MenuItem onClick={() => handleFilterChange("Title")}>Title</MenuItem>
                  <MenuItem onClick={() => handleFilterChange("Author")}>Author</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
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
  )}

  export default SearchBar;