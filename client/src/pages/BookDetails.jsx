import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import {
  Box,
  Heading,
  Text,
  Image,
  Flex,
  VStack,
  HStack,
  useColorModeValue,
  Container,
  Textarea,
  Button,
  Divider,
  useToast
} from "@chakra-ui/react";
import { BsHeartFill, BsHeart } from "react-icons/bs";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import AuthService from "../utils/auth";
import { QUERY_BOOK, QUERY_USER } from "../utils/queries";
import { FAVORITE_BOOK, UNFAVORITE_BOOK, ADD_COMMENT } from "../utils/mutations";

const BookDetails = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [favoriteBook] = useMutation(FAVORITE_BOOK);
  const [unFavoriteBook] = useMutation(UNFAVORITE_BOOK);
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: QUERY_BOOK, variables: { bookId: id } }],
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  });

  const [getBook, { loading: bookLoading, error: bookError }] = useLazyQuery(QUERY_BOOK);

  const { loading: userLoading, error: userError, data: userData, refetch } = useQuery(QUERY_USER, {
    skip: !isLoggedIn,
    variables: { username: isLoggedIn ? AuthService.getProfile().data.username : '' }
  });

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const boxShadow = useColorModeValue("10px 10px 0 #323535", "10px 10px 0 cyan");

  useEffect(() => {
    if (!AuthService.loggedIn()) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      navigate("/signin");
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate, toast]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await getBook({ variables: { bookId: id } });
        if (data && data.book) {
          setBook(data.book);
          setComments(data.book.comments || []);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
    fetchBook();
  }, [id, getBook]);

  useEffect(() => {
    if (!userLoading && !userError && userData && userData.user) {
      setFavorites(userData.user.favoriteBooks.map(book => book._id));
    }
  }, [userLoading, userError, userData]);

  const addToFavorites = useCallback(async (book) => {
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
        refetch();
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
  }, [favoriteBook, toast, refetch]);

  const removeFromFavorites = useCallback(async (book) => {
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
        refetch();
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
  }, [unFavoriteBook, toast, refetch]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const { data } = await addComment({
          variables: {
            bookId: book._id,
            commentText: newComment
          }
        });
        if (data && data.addComment) {
          const newCommentWithId = {
            ...data.addComment,
            _id: data.addComment._id
          };
          setComments(prevComments => [...prevComments, newCommentWithId]);
          setNewComment("");
          toast({
            title: "Comment added",
            description: "Your comment has been successfully added.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        toast({
          title: "Error",
          description: "There was an error adding your comment. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const isFavorite = book ? favorites.includes(book._id) : false;

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(book);
    } else {
      addToFavorites(book);
    }
  };

  if (bookLoading || userLoading) return <Box>Loading...</Box>;
  if (bookError || userError) return <Box>Error: {(bookError || userError).message}</Box>;
  if (!book) return <Box>No book found</Box>;

  return (
    <Container maxW="container.xl" py={10}>
      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow={boxShadow}>
      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        <Box flex={1}>
          <Image
            src={book.imageLink || "https://via.placeholder.com/128x192"}
            alt={book.title}
            objectFit="cover"
            w="full"
            h="500px"
            borderRadius="md"
            boxShadow={boxShadow}
          />
        </Box>
        <VStack flex={2} align="start" spacing={4}>
          <Heading size="2xl">{book.title}</Heading>
          <Text fontSize="xl" color={textColor}>
            by {book.author}
          </Text>
          <HStack>
            <Text fontWeight="bold">Genre:</Text>
            <Text>{book.genre || "Not specified"}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold">Publisher:</Text>
            <Text>{book.publisher || "Not specified"}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold">Published:</Text>
            <Text>{book.published}</Text>
          </HStack>
          <Box>
            <Text fontWeight="bold">Description:</Text>
            <Box color={textColor}>
              {parse(book.description || "No description available.")}
            </Box>
          </Box>
          <HStack>
            <Button
              leftIcon={isFavorite ? <BsHeartFill /> : <BsHeart />}
              colorScheme={isFavorite ? "red" : "gray"}
              onClick={handleFavoriteClick}
            >
              {isFavorite ? "Unfavorite" : "Favorite"}
            </Button>
          </HStack>
        </VStack>
      </Flex>

      <Divider my={8} />
        <VStack align="start" spacing={4}>
          <Heading as="h2" size="lg">Comments</Heading>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Box key={comment._id} p={4} borderWidth={1} borderRadius="md" w="full">
                <Text>{comment.commentText}</Text>
                <Text fontSize="sm" color={textColor}>
                  Commented By: {comment.commentAuthor} on {comment.createdAt}
                </Text>
              </Box>
            ))
          ) : (
            <Text>No comments yet.</Text>
          )}
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            size="sm"
          />
          <Button onClick={handleAddComment}>Add Comment</Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default BookDetails;