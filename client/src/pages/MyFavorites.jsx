import { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  useColorModeValue,
  Heading,
  useToast,
} from "@chakra-ui/react";
import BookCard from "../components/BookCard";
import AuthService from "../utils/auth";

export default function MyFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const bgGradient = useColorModeValue(
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)",
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)"
  );

  const toast = useToast();

  useEffect(() => {
    if (!AuthService.loggedIn()) {
      toast({
        title: "Authentication required",
        description: "Please log in to access MyFavorites",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      window.location.assign("/signin");
    } else {
      setIsLoggedIn(true);
      const storedFavorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );
      setFavorites(storedFavorites);
    }
  }, [toast]);

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

  if (!isLoggedIn) {
    return null;
  }

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
