import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import BookCard from "../components/BookCard";

const Library = () => {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Define the background color
  const bgGradient = useColorModeValue(
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)",
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)"
  );

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=40"
      );
      setBooks(response.data.items);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const addToFavorites = (book) => {
    setFavorites([...favorites, book]);
    // You might want to save this to localStorage or a backend service
  };

  return (
    <Box p={4} sx={{ background: bgGradient, minHeight: "100vh" }}>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={1}>
        {books.map((book) => (
          <BookCard 
            key={book.id} 
            book={book} 
            addToFavorites={addToFavorites} 
            imageHeight="440px" // Adjusts Image Height
            boxWidth="300px"  // Adjusts box width
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Library;

