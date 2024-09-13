import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import BookCard from "../components/BookCard";
import { ADD_BOOK } from '../utils/mutations';
import { useMutation } from '@apollo/client';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [addBook] = useMutation(ADD_BOOK);
  const bgGradient = useColorModeValue(
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)",
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)"
  );

  useEffect(() => {
    fetchBooks();
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
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

  const addToFavorites = async (book) => {
    const updatedFavorites = [...favorites, book];
    setFavorites(updatedFavorites);
    console.log(updatedFavorites.map(book => book.volumeInfo));
  
    try {
      await Promise.all(updatedFavorites.map(async (book) => {
        console.log(book.volumeInfo.title);
        console.log(book.volumeInfo.authors.join(", "));
        console.log(book.volumeInfo.categories.join(", "));
        console.log(book.volumeInfo.description);
        console.log(book.volumeInfo.publisher);
        const { data } = await addBook({
          variables: {
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown",
            genre: book.volumeInfo.categories ? book.volumeInfo.categories.join(", ") : "Uncategorized",
            synopsis: book.volumeInfo.description || "No description available",
            publisher: book.volumeInfo.publisher || "Unknown"
          }
        });
        console.log("Book added:", data.addBook);
      }));
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Error adding books to favorites:", error);
    }
  };

  const removeFromFavorites = (book) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== book.id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <Box p={4} sx={{ background: bgGradient, minHeight: "100vh" }}>
      <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing={1}>
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            isFavorite={favorites.some((fav) => fav.id === book.id)}
            imageHeight="440px"
            boxWidth="300px"
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Library;
