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
              return {
                ...response.data.items[randomIndex].volumeInfo,
                month,
                id: response.data.items[randomIndex].id,
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
  }, []);

  const addToFavorites = (book) => {
    // Implement your logic to add the book to favorites
    console.log("Adding to favorites:", book);
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
              <React.Fragment key={book.id}>
                <BookCard
                  book={book}
                  showComments={expandedBookId === book.id}
                  addToFavorites={addToFavorites}
                  onClick={() =>
                    setExpandedBookId(
                      book.id === expandedBookId ? null : book.id
                    )
                  }
                />
                {expandedBookId === book.id && (
                  <Box gridColumn="1 / -1">
                    <CommentSection bookId={book.id} />
                  </Box>
                )}
              </React.Fragment>
            ))}
      </SimpleGrid>
    </Box>
  );
};

export default BookOfTheMonth;
