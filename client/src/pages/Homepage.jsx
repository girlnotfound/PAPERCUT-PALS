import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  SimpleGrid,
  Skeleton,
  useColorModeValue,
  Image,
  useToast,
} from "@chakra-ui/react";
import BookCard from "../components/BookCard2";
import AuthService from "../utils/auth";

const BookOfTheMonth = () => {
  const bgGradient = useColorModeValue(
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)",
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)"
  );
  const toast = useToast();
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBookId, setExpandedBookId] = useState(null);

  useEffect(() => {
    if (!AuthService.loggedIn()) {
      toast({
        title: "Authentication required",
        description: "Please log in to access Homepage",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      window.location.assign("/signin");
      return;
    }

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
  }, [toast]); // added toast to the dependency array

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

  // function to get the appropriate label for each book
  const getBookLabel = (month) => {
    switch (month) {
      case "last":
        return "Last Month's Pick";
      case "current":
        return "This Month's Top Choice";
      case "next":
        return "Next Month's Selection";
      default:
        return "";
    }
  };

  return (
    <Box p={4} sx={{ background: bgGradient, minHeight: "100vh" }}>
      {/* logo image as heading */}
      <Box display="flex" justifyContent="center" mb={15}>
        <Image
          src="/images/FeaturedBooks_Logo.png"
          alt="Featured Books of the Month"
          maxWidth="100%"
          height="85px"
        />
      </Box>

      <SimpleGrid columns={[1, null, 3]} spacing={0}>
        {loading
          ? Array(3)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} height="400px" borderRadius="lg" />
              ))
          : books.map((book) => (
              // wrap BookCard in Box with label
              <Box key={book.id} margin={0} padding={0}>
                {/* add book label as heading */}
                <Heading as="h3" size="md" mb={0} textAlign="center">
                  {getBookLabel(book.month)}
                </Heading>
                <BookCard
                  book={book}
                  showComments={expandedBookId === book.id}
                  addToFavorites={addToFavorites}
                  removeFromFavorites={removeFromFavorites}
                  isFavorite={favorites.some((fav) => fav.id === book.id)}
                  onClick={() =>
                    setExpandedBookId(
                      book.id === expandedBookId ? null : book.id
                    )
                  }
                  imageHeight="440px"
                  boxWidth="300px"
                />
              </Box>
            ))}
      </SimpleGrid>
    </Box>
  );
};

export default BookOfTheMonth;
