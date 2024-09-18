import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_BOOKS, QUERY_FAVORITEBOOKS } from "../utils/queries";
import {
  FAVORITE_BOOK,
  UNFAVORITE_BOOK,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from "../utils/mutations";
import BookCard2 from "../components/BookCard2";
import {
  SimpleGrid,
  Heading,
  VStack,
  Box,
  Input,
  Button,
  Text,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import AuthService from "../utils/auth";

const BookOfTheMonth = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [favoriteBookIds, setFavoriteBookIds] = useState([]);
  const [newComments, setNewComments] = useState({});
  const toast = useToast();

  const currentUsername = AuthService.getProfile().data.username;

  const {
    loading: loadingBooks,
    data: booksData,
    refetch: refetchBooks,
  } = useQuery(QUERY_BOOKS);
  const { loading: loadingFavs, data: favsData } = useQuery(
    QUERY_FAVORITEBOOKS,
    {
      variables: { username: currentUsername },
    }
  );
  const [favoriteBook] = useMutation(FAVORITE_BOOK);
  const [unfavoriteBook] = useMutation(UNFAVORITE_BOOK);
  const [addComment] = useMutation(ADD_COMMENT);
  const [removeComment] = useMutation(REMOVE_COMMENT);

  const bgGradient = useColorModeValue(
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)",
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)"
  );

  useEffect(() => {
    if (booksData && booksData.books) {
      // Replace these IDs with the actual IDs of the books you want to feature
      const featuredBookIds = ["KuYjyCkM2V4C", "GZAoAQAAIAAJ", "bIZiAAAAMAAJ"];
      const selectedBooks = booksData.books.filter((book) =>
        featuredBookIds.includes(book._id)
      );
      setFeaturedBooks(selectedBooks);
    }
  }, [booksData]);

  useEffect(() => {
    if (
      favsData &&
      favsData.favoriteBooks &&
      favsData.favoriteBooks.favoriteBooks
    ) {
      const favBooks = favsData.favoriteBooks.favoriteBooks;
      const favIds = Object.keys(favBooks).map((key) => favBooks[key]._id);
      setFavoriteBookIds(favIds);
    }
  }, [favsData]);

  const handleToggleFavorite = async (book) => {
    try {
      const isFavorite = favoriteBookIds.includes(book._id);
      const mutation = isFavorite ? unfavoriteBook : favoriteBook;
      await mutation({
        variables: { favoriteBookId: book._id },
        refetchQueries: [
          {
            query: QUERY_FAVORITEBOOKS,
            variables: { username: currentUsername },
          },
        ],
      });

      setFavoriteBookIds((prevFavs) =>
        isFavorite
          ? prevFavs.filter((id) => id !== book._id)
          : [...prevFavs, book._id]
      );

      toast({
        title: isFavorite
          ? "Book removed from favorites"
          : "Book added to favorites",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddComment = async (bookId) => {
    if (newComments[bookId] && newComments[bookId].trim()) {
      try {
        await addComment({
          variables: { bookId, commentText: newComments[bookId] },
        });
        setNewComments((prev) => ({ ...prev, [bookId]: "" }));
        refetchBooks();
        toast({
          title: "Comment added",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        console.error("Error adding comment:", err);
        toast({
          title: "Error",
          description: "Failed to add comment",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleRemoveComment = async (bookId, commentId) => {
    try {
      await removeComment({
        variables: { bookId, commentId },
      });
      refetchBooks();
      toast({
        title: "Comment removed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error removing comment:", err);
      toast({
        title: "Error",
        description: "Failed to remove comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loadingBooks || loadingFavs) return <div>Loading...</div>;

  return (
    <Box bgGradient={bgGradient} minHeight="100vh" p={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl" textAlign="center" color="white">
          Books of the Month
        </Heading>
        <SimpleGrid columns={[1, null, 3]} spacing={10}>
          {featuredBooks.map((book, index) => (
            <Box
              key={book._id}
              borderRadius="lg"
              overflow="hidden"
              boxShadow="xl"
            >
              <Box bg="#4e5a6b" p={4}>
                <Heading as="h2" size="md" color="white" mb={4}>
                  Featured Book {index + 1}
                </Heading>
                <BookCard2
                  book={book}
                  addToFavorites={() => handleToggleFavorite(book)}
                  removeFromFavorites={() => handleToggleFavorite(book)}
                  isFavorite={favoriteBookIds.includes(book._id)}
                />
              </Box>
              <Box bg="white" p={4}>
                <VStack align="stretch" spacing={4}>
                  {book.comments.map((comment) => (
                    <Box
                      key={comment._id}
                      p={2}
                      bg="gray.100"
                      borderRadius="md"
                    >
                      <Text fontWeight="bold">{comment.commentAuthor}</Text>
                      <Text>{comment.commentText}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {comment.createdAt}
                      </Text>
                      {comment.commentAuthor === currentUsername && (
                        <Button
                          size="xs"
                          onClick={() =>
                            handleRemoveComment(book._id, comment._id)
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                  ))}
                </VStack>
                <Input
                  value={newComments[book._id] || ""}
                  onChange={(e) =>
                    setNewComments((prev) => ({
                      ...prev,
                      [book._id]: e.target.value,
                    }))
                  }
                  placeholder="Add a comment..."
                  mt={4}
                />
                <Button onClick={() => handleAddComment(book._id)} mt={2}>
                  Post Comment
                </Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default BookOfTheMonth;
