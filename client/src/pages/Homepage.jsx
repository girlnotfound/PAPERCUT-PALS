import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  SimpleGrid,
  Skeleton,
  useColorModeValue,
} from "@chakra-ui/react";
import BookCard from "../components/BookCard2";

const BookOfTheMonth = () => {
  const bgGradient = useColorModeValue(
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)",
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)"
  );
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBookId, setExpandedBookId] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const months = ["last", "current", "next"];
      const storedBooks = localStorage.getItem("booksOfTheMonth");

      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      } else {
        try {
          const fetchedBooks = await Promise.all(
            months.map(async (month) => {
              const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&maxResults=40`
              );
              const randomIndex = Math.floor(
                Math.random() * response.data.items.length
              );
              const book = response.data.items[randomIndex];
              return {
                id: book.id,
                volumeInfo: {
                  ...book.volumeInfo,
                  imageLinks: book.volumeInfo.imageLinks || {
                    thumbnail: "https://via.placeholder.com/128x192",
                  },
                },
                month,
              };
            })
          );
          setBooks(fetchedBooks);
          localStorage.setItem("booksOfTheMonth", JSON.stringify(fetchedBooks));
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      }
      setLoading(false);
    };

    fetchBooks();
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
      <Heading as="h2" size="xl" mb={6}>
        Books of the Month
      </Heading>

      <SimpleGrid columns={[1, null, 3]} spacing={6}>
        {loading
          ? Array(3)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} height="400px" borderRadius="lg" />
              ))
          : books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                showComments={expandedBookId === book.id}
                addToFavorites={addToFavorites}
                removeFromFavorites={removeFromFavorites}
                isFavorite={favorites.some((fav) => fav.id === book.id)}
                onClick={() =>
                  setExpandedBookId(book.id === expandedBookId ? null : book.id)
                }
                imageHeight="440px"
                boxWidth="300px"
              />
            ))}
      </SimpleGrid>
    </Box>
  );
};

export default BookOfTheMonth;
