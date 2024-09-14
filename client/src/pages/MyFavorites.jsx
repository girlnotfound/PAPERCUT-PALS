import React, { useState, useEffect } from "react";
import { Box, SimpleGrid, useColorModeValue, Heading, useToast } from "@chakra-ui/react";
import BookCard from "../components/BookCard";
import AuthService from '../utils/auth';

export default function MyFavorites() {
  const [favorites, setFavorites] = useState([]);

  const bgGradient = useColorModeValue(
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)",
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)"
  );

  const toast = useToast();
  if (!AuthService.loggedIn()) {
    toast({
      title: "Authentication required",
      description: "Please log in to access MyFavorites",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
      window.location.assign('/signin');
    return;
  }

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

  const addToFavorites = (book) => {
    const updatedFavorites = [...favorites, book];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (book) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== book.id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <Box p={4} sx={{ background: bgGradient, minHeight: "100vh" }}>
      <Heading as="h1" mb={4} textAlign="center">
        MY FAVORITES
      </Heading>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={1}>
      {favorites.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          addToFavorites={addToFavorites}
          removeFromFavorites={removeFromFavorites}
          isFavorite={true}
        />
      ))}
      </SimpleGrid>
    </Box>
  );
}
