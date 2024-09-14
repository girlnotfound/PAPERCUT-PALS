"use client";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import Auth from "../utils/auth";

const Links = [
  { name: "Homepage", path: "/homepage" },
  { name: "Library", path: "/library" },
  { name: "MyFavorites", path: "/my-favorites" },
  { name: "About Us", path: "/about-us" },
];

const NavLink = ({ children, to }) => {
  return (
    <Box
      as={RouterLink}
      px={3}
      py={2}
      rounded={"full"}
      _hover={{
        textDecoration: "none",
        bg: "rgba(255, 255, 255, 0.2)",
        transform: "translateY(-2px)",
        transition: "all 0.3s ease",
      }}
      to={to}
      fontWeight="medium"
      color="white"
    >
      {children}
    </Box>
  );
};

NavLink.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

export default function Navigation() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        bgGradient="linear(to-r, #d558c8, #24d292)"
        px={4}
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
            color="white"
            _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
          />
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link.name} to={link.path}>
                  {link.name}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
                _hover={{ bg: "transparent" }} // Keep the button transparent on hover
              >
                <Avatar
                  size={"sm"}
                  src={"https://avatars.githubusercontent.com/u/5844161?v=4"}
                  border="2px solid white"
                />
              </MenuButton>
              <MenuList bg="rgba(255, 255, 255, 0.9)" borderColor="transparent">
                <MenuItem
                  as={RouterLink}
                  to="/UserProfile"
                  width="100%"
                  _hover={{
                    bg: "rgba(213, 88, 200, 0.2)",
                    color: "black", 
                  }}
                >
                  Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={Auth.logout}
                  width="100%"
                  _hover={{
                    bg: "rgba(36, 210, 146, 0.2)",
                    color: "black", 
                  }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.name} to={link.path}>
                  {link.name}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
