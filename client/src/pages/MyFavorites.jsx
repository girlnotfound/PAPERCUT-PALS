import React, { useState, useEffect } from "react";
import { Box, SimpleGrid, useColorModeValue, Heading } from "@chakra-ui/react";
import BookCard from "../components/BookCard";

export default function MyFavorites() {
  const [favorites, setFavorites] = useState([]);

  const bgGradient = useColorModeValue(
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)",
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)"
  );

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

  const removeFromFavorites = (book) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== book.id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // This function is not used in MyFavorites, but we need to pass it to BookCard
  const addToFavorites = (book) => {
    // Do nothing, as the book is already in favorites
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
            imageHeight="440px"
            boxWidth="300px"
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
