import { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  useColorModeValue,
  VStack,
  Center,
  useToast,
} from "@chakra-ui/react";
import BookCard from "../components/BookCard";
import { FAVORITE_BOOK, UNFAVORITE_BOOK } from "../utils/mutations";
import { QUERY_BOOKS, QUERY_FAVORITEBOOKS } from "../utils/queries";
import { useMutation, useQuery } from "@apollo/client";
import SearchBar from "../components/SearchBar";
import AuthService from "../utils/auth";

const Library = () => {
  const [favorites, setFavorites] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchParams, setSearchParams] = useState({
    query: "",
    filter: "All",
  });

  const toast = useToast();
  const { loading, error, data } = useQuery(QUERY_BOOKS);
  const { loading: favoriteBooksLoading, error: favoriteBooksError, data: favoriteBooksData } = useQuery(QUERY_FAVORITEBOOKS, {
    variables: { username: AuthService.getProfile().data.username },
    fetchPolicy: 'network-only'
  });

  const [favoriteBook] = useMutation(FAVORITE_BOOK);
  const [unFavoriteBook] = useMutation(UNFAVORITE_BOOK);

  const bgGradient = useColorModeValue(
    "linear-gradient(-20deg, #D558C8 0%, #24D292 100%)",
    "linear-gradient(-20deg, #D558C8 0%, #24D292 100%)"
  );

  const fetchBooks = () => {
    if (loading) return;
    if (error) {
      console.error("Error fetching books:", error);
      return;
    }

    try {
      let filteredBooks = data?.books || [];

      if (searchParams.filter !== "All" && searchParams.query) {
        if (searchParams.filter === "Genre") {
          filteredBooks = filteredBooks.filter(book => book.genre.toLowerCase().includes(searchParams.query.toLowerCase()));
        } else if (searchParams.filter === "Title") {
          filteredBooks = filteredBooks.filter(book => book.title.toLowerCase().includes(searchParams.query.toLowerCase()));
        } else if (searchParams.filter === "Author") {
          filteredBooks = filteredBooks.filter(book => book.author.toLowerCase().includes(searchParams.query.toLowerCase()));
        }
      }

      setBooks(filteredBooks);
    } catch (error) {
      console.error("Error filtering books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchParams, data, loading, error]);

  useEffect(() => {
    if (!favoriteBooksLoading && !favoriteBooksError && favoriteBooksData) {
      const favoriteBookIds = favoriteBooksData.favoriteBooks.favoriteBooks.map(book => book._id);
      setFavorites(favoriteBookIds);
    }
  }, [favoriteBooksLoading, favoriteBooksError, favoriteBooksData]);

  useEffect(() => {
    if (!AuthService.loggedIn()) {
      toast({
        title: "Authentication required",
        description: "Please log in to access Library",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      window.location.assign("/signin");
    }
  }, [toast]);

  const handleSearch = (query, filter) => {
    setSearchParams({ query, filter });
  };

  const addToFavorites = async (book) => {
    try {
      const { data } = await favoriteBook({
        variables: {
          favoriteBookId: book._id
        },
      });

      if (data.favoriteBook) {
        setFavorites(prevFavorites => [...prevFavorites, book._id]);
        toast({
          title: "Book added to favorites",
          description: "The book has been successfully added to your favorites.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
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
  };

  const removeFromFavorites = async (book) => {
    try {
      const { data } = await unFavoriteBook({
        variables: {
          favoriteBookId: book._id
        },
      });

      if (data.unFavoriteBook) {
        setFavorites(prevFavorites => prevFavorites.filter(id => id !== book._id));
        toast({
          title: "Book unfavorited",
          description: "The book has been successfully removed from your favorites.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error removing book from favorites:", error);
      toast({
        title: "Error",
        description: "There was an error removing the book from favorites. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading || favoriteBooksLoading) {
    return <p>Loading...</p>;
  }

  if (error || favoriteBooksError) {
    return <p>Error: {error ? error.message : favoriteBooksError.message}</p>;
  }

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
              key={book._id}
              book={book}
              addToFavorites={addToFavorites}
              removeFromFavorites={removeFromFavorites}
              isFavorite={favorites.includes(book._id)}
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