import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      as="footer"
      w="100%"
      mt="auto"
      p={4}
      bgGradient="linear(to-r, #d558c8, #24d292)"
      color="white"
      borderTop="1px solid" borderColor='black'
    >
      <VStack spacing={2}>
        <Text fontSize="sm" fontWeight="bold">
          Made with{" "}
          <span role="img" aria-label="heart" aria-hidden="false">
            ❤️
          </span>{" "}
          by The PAPERCUT PALS Dev Team
        </Text>
        <Text fontSize="sm">
          &copy; {currentYear} PAPERCUT PALS. All rights reserved.
        </Text>
      </VStack>
    </Box>
  );
};

export default Footer;
