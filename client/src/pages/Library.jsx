import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  SimpleGrid,
  useColorModeValue,
  VStack,
  Center,
} from "@chakra-ui/react";
import BookCard from "../components/BookCard";
import { ADD_BOOK } from '../utils/mutations';
import { useMutation } from '@apollo/client';
import SearchBar from "../components/SearchBar";
const Library = () => {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchParams, setSearchParams] = useState({
    query: "",
    filter: "All",
  });  const [addBook] = useMutation(ADD_BOOK);
  const bgGradient = useColorModeValue(
    "linear-gradient(-20deg, #D558C8 0%, #24D292 100%)",
    "linear-gradient(-20deg, #D558C8 0%, #24D292 100%)"
  );
  useEffect(() => {
    fetchBooks();
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, [searchParams]);
  const fetchBooks = async () => {
    try {
      let url = "https://www.googleapis.com/books/v1/volumes?";
      let params = new URLSearchParams({
        maxResults: 40,
        orderBy: "relevance",
      });
      if (searchParams.filter === "Genre") {
        params.append("q", `subject:${searchParams.query}`);
      } else if (searchParams.filter === "Title") {
        params.append("q", `intitle:${searchParams.query}`);
      } else if (searchParams.filter === "Author") {
        params.append("q", `author:${searchParams.query}`);
      } else {
        params.append("q", searchParams.query || "subject:fiction");
      }
      const response = await axios.get(url + params.toString());
      setBooks(response.data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
  const handleSearch = (query, filter) => {
    setSearchParams({ query, filter });
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
      <VStack spacing={8} align="stretch">
        <Center>
          <Box boxShadow="md" borderRadius="md" overflow="hidden">
            <SearchBar onSearch={handleSearch} />
          </Box>
        </Center>
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
      </VStack>
    </Box>
  );
};
export default Library;
