"use client";
import React from 'react';
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
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import Auth from "../utils/auth";
import { useUser } from '../hooks/useUser';

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
  const { user, loading } = useUser();

  const placeholderImage = 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg';

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
            {user && (
              <Text color="white" fontWeight="medium" mr={2}>
                {user.username}
              </Text>
            )}
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
                _hover={{ bg: "transparent" }}
              >
                <Avatar
                  size={"sm"}
                  src={user?.profileImage || placeholderImage}
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