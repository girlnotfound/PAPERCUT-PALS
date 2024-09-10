import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Box, SimpleGrid, Button, Image, Text, useColorModeValue } from "@chakra-ui/react";

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
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
          {books.map((book) => (
            <Box
              key={book.id}
              borderWidth={1}
              borderRadius="lg"
              overflow="hidden"
            >
              <Image
                src={
                  book.volumeInfo.imageLinks?.thumbnail ||
                  "https://via.placeholder.com/128x192"
                }
                alt={book.volumeInfo.title}
              />
              <Box p={3}>
                <Text fontWeight="bold" isTruncated>
                  {book.volumeInfo.title}
                </Text>
                <Text fontSize="sm" isTruncated>
                  {book.volumeInfo.authors?.join(", ")}
                </Text>
                <Button as={Link} to={`/book/${book.id}`} size="sm" mt={2}>
                  View Details
                </Button>
                <Button
                  onClick={() => addToFavorites(book)}
                  size="sm"
                  mt={2}
                  ml={2}
                >
                  Add to Favorites
                </Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
  );
};

export default Library;

