import { useState, useEffect } from "react";
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
  const [favoriteBook] = useMutation(FAVORITE_BOOK);
  const [unFavoriteBook] = useMutation(UNFAVORITE_BOOK);
  const [addComment] = useMutation(ADD_COMMENT);
  const [getBook, { loading, error, data }] = useLazyQuery(QUERY_BOOK);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const boxShadow = useColorModeValue(
    "10px 10px 0 #323535",
    "10px 10px 0 cyan"
  );

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
      return;
    }

    const username = AuthService.getProfile().data.username;
    refetch({ username });
  }, [navigate, toast]);

  const { loading: userLoading, error: userError, data: userData, refetch } = useQuery(QUERY_USER, {
    skip: !AuthService.loggedIn(),
    variables: { username: AuthService.loggedIn() ? AuthService.getProfile().data.username : '' }
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        await getBook({ variables: { bookId: id } });
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
    fetchBook();
  }, [id, getBook]);

  useEffect(() => {
    if (data && data.book) {
      setBook(data.book);
      setComments(data.book.comments || []);
    }
  }, [data]);

  useEffect(() => {
    if (!userLoading && !userError && userData && userData.user) {
      setFavorites(userData.user.favoriteBooks);
    }
  }, [userLoading, userError, userData]);

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
          // Ensure the new comment has an _id
          const newCommentWithId = {
            ...data.addComment,
            _id: data.addComment._id
          };
          setComments(prevComments => [...prevComments, newCommentWithId]);
          setNewComment("");
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
  };

  const isFavorite = book ? favorites.some((fav) => fav === book._id) : false;

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(book);
    } else {
      addToFavorites(book);
    }
  };

  if (loading || userLoading) return <Box>Loading...</Box>;
  if (error || userError) return <Box>Error: {(error || userError).message}</Box>;
  if (!book) return <Box>No book found</Box>;

  return (
    <Container maxW="container.xl" py={12}>
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
            <Text fontWeight="bold">Categories:</Text>
            <Text>{book.genre || "Not specified"}</Text>
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

      <Box>
        <Heading size="lg" mb={4} textAlign="center">
          Comments
        </Heading>
        <VStack spacing={4} align="stretch">
          {comments.length > 0 ? (
            comments.map((comment) => (
              (
                <Box
                  key={comment._id}
                  p={4}
                  bg={bgColor}
                  borderRadius="md"
                  borderWidth={1}
                  borderColor={borderColor}
                >
                  <Text>{comment.commentText}</Text>
                  <Text fontSize="sm" mt={2}>
                    Commented By: {comment.commentAuthor} on {comment.createdAt}
                  </Text>
                </Box>
              )
            ))
          ) : (
            <Text textAlign="center">No comments yet.</Text>
          )}
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            size="sm"
          />
          <Button
            onClick={handleAddComment}
            bg="#97cba9"
            color="white"
            _hover={{ bg: "#7ab08e" }}
          >
            Add Comment
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default BookDetails;