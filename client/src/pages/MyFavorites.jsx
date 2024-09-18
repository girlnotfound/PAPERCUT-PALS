import { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  useColorModeValue,
  Heading,
  useToast,
  Text,
} from "@chakra-ui/react";
import BookCard from "../components/BookCard";
import AuthService from "../utils/auth";
import { UNFAVORITE_BOOK } from "../utils/mutations";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { QUERY_BOOK, QUERY_USER } from "../utils/queries";

export default function MyFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unFavoriteBook] = useMutation(UNFAVORITE_BOOK);
  const [getBook] = useLazyQuery(QUERY_BOOK);
  const username = AuthService.getProfile().data.username;
  const { loading: userLoading, error: userError, data: userData, refetch } = useQuery(QUERY_USER, {
    variables: { username: username},
    skip: !isLoggedIn, // Skip the query if the user is not logged in
  });

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
      if (!userLoading && !userError && userData && userData.user) {
        const fetchBookDetails = async () => {
          const bookDetailsPromises = userData.user.favoriteBooks.map(async (book) => {
            const { data } = await getBook({ variables: { bookId: book._id } });
            return data.book;
          });
          
          const bookDetailsResults = await Promise.all(bookDetailsPromises);
          setFavorites(bookDetailsResults);
        };
        refetch();
        fetchBookDetails();
      }
    }
  }, [userLoading, userError, userData, getBook, refetch]);

  const removeFromFavorites = async (book) => {
    try {
      const { data } = await unFavoriteBook({
        variables: {
          favoriteBookId: book._id
        },
      });
  
      if (data.unFavoriteBook) {
        // Refetch user data to get the updated favorites list
        await refetch();
        
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

  if (!isLoggedIn) {
    return null;
  }

  if (userLoading) {
    return <Box>Loading...</Box>;
  }

  if (userError) {
    console.error("Error fetching user data:", userError);
    toast({
      title: "Error",
      description: "There was an error fetching your data. Please try again.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return null;
  }


  return (
    <Box p={4} sx={{ background: bgGradient, minHeight: "100vh" }}>
      <Heading as="h1" mb={4} textAlign="center">
        MY FAVORITES
      </Heading>
      {favorites.length === 0 ? (
        <Box textAlign="center" mt={8}>
          <Heading as="h2" size="lg">
            YOU HAVE NO FAVORITES
          </Heading>
          <Text mt={4}>
            Start adding books to your favorites to see them here!
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={1}>
          {favorites.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              removeFromFavorites={removeFromFavorites}
              isFavorite={true}
              imageHeight="440px"
              boxWidth="300px"
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}