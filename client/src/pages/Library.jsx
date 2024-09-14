import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  SimpleGrid,
  useColorModeValue,
  VStack,
  Center,
  useToast,
} from "@chakra-ui/react";
import BookCard from "../components/BookCard";
import { ADD_BOOK } from '../utils/mutations';
import { useMutation } from '@apollo/client';
import SearchBar from "../components/SearchBar";
import AuthService from '../utils/auth';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const toast = useToast();
  const [searchParams, setSearchParams] = useState({
    query: "",
    filter: "All",
  });  
  const [addBook] = useMutation(ADD_BOOK);
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

  if (!AuthService.loggedIn()) {
    toast({
      title: "Authentication required",
      description: "Please log in to access Library",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
      window.location.assign('/signin');
    return;
  }

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
  
    try {

      console.log(book.volumeInfo.title);
      console.log(book.volumeInfo.authors.join(", "));
      console.log(book.volumeInfo.categories.join(", "));
      console.log(book.volumeInfo.description);
      console.log(book.volumeInfo.publisher);
      const { data } = await addBook({
        variables: {
          favoredBy: AuthService.getProfile().data.username,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown",
          genre: book.volumeInfo.categories ? book.volumeInfo.categories.join(", ") : "Uncategorized",
          synopsis: book.volumeInfo.description || "No description available",
          publisher: book.volumeInfo.publisher || "Unknown"
        }
      });
  
      const addedBook = data.addBook;
      console.log("Book added:", addedBook);
  
      toast({
        title: "Book added to favorites",
        description: "The book has been successfully added to your favorites.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding book to favorites:", error);
      toast({
        title: "Error",
        description: "There was an error adding the book to favorites. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

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