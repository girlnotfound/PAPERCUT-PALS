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
import { FAVORITE_BOOK, UNFAVORITE_BOOK, ADD_COMMENT, REMOVE_COMMENT } from "../utils/mutations";

const BookDetails = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(()=>{
    console.log(comments);
    
  },[comments])
  const [removeComment] = useMutation(REMOVE_COMMENT);
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

  const [getBook, { loading: bookLoading, error: bookError, refetch: getBookAgain }] = useLazyQuery(QUERY_BOOK);

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
  }, []);

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
            ...data.addComment.comments[data.addComment.comments.length -1],
            _id: data.addComment.comments[data.addComment.comments.length -1]._id
          };
          setComments(prevComments => [...prevComments, newCommentWithId]);
          setBook(prevBook => ({
            ...prevBook,
            commentCount: (prevBook.commentCount || 0) + 1
          }));

          setNewComment("");
          toast({
            title: "Comment added",
            description: "Your comment has been successfully added.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          // setTimeout(()=>window.location.reload(), 750)
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

  const handleAmazonSearch = () => {
    const searchQuery = encodeURIComponent(`${book.title} ${book.author}`);
    window.open(`https://www.amazon.com/s?k=${searchQuery}`, '_blank');
  };

  const handleBarnesNobleSearch = () => {
    const searchQuery = encodeURIComponent(`${book.title} ${book.author}`);
    window.open(`https://www.barnesandnoble.com/s/${searchQuery}`, '_blank');
  };

  const handleRemoveComment = async (commentId) => {
    try {
      await removeComment({
        variables: { bookId: book._id, commentId },
        refetchQueries: [{ query: QUERY_BOOK, variables: { bookId: id } }]
      });
      setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
      setBook(prevBook => ({
        ...prevBook,
        commentCount: Math.max((prevBook.commentCount || 0) - 1, 0)
      }));

      toast({
        title: "Comment removed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error removing comment:", error);
      toast({
        title: "Error",
        description: "There was an error removing your comment. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  console.log(book);
  
  const bgGradient = useColorModeValue(
    "linear-gradient(-20deg, #D558C8 0%, #24D292 100%)",
    "linear-gradient(-20deg, #D558C8 0%, #24D292 100%)"
  );
  

  if (bookLoading || userLoading) return <Box>Loading...</Box>;
  if (bookError || userError) return <Box>Error: {(bookError || userError).message}</Box>;
  if (!book) return <Box>No book found</Box>;

  return (
    <Box
    width="100%"
    minHeight="100vh"
    bgGradient={bgGradient}
    paddingY={8}
    >
    <Container maxW="container.xl" py={10} >
      <Box bg="#edf2f7" p={6} borderRadius="lg" boxShadow={boxShadow}>
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
          <HStack spacing={4}>
            <Button
              leftIcon={isFavorite ? <BsHeartFill /> : <BsHeart />}
              colorScheme={isFavorite ? "red" : "gray"}
              onClick={handleFavoriteClick}
            >
              {isFavorite ? "Unfavorite" : "Favorite"}
            </Button>
            <Button
              colorScheme="orange"
              onClick={handleAmazonSearch}
            >
              Search on Amazon
            </Button>
            <Button
              colorScheme="green"
              onClick={handleBarnesNobleSearch}
            >
              Search on Barnes & Noble
            </Button>
          </HStack>
        </VStack>
      </Flex>

      <Divider my={8} />
        <VStack align="start" spacing={4}>
        <Heading as="h3" size="md">{book.commentCount} Comments</Heading>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Box key={comment._id} p={2} bg="gray.100" borderRadius="md" width="100%" boxShadow='xl' border="1px solid" borderColor='#aaabad'>
                <Text>{comment.commentText}</Text>
                <Text fontSize="sm" color="gray.500" >
                  Commented By: {comment.commentAuthor} on {comment.createdAt}
                </Text>
                {AuthService.loggedIn() && AuthService.getProfile().data.username === comment.commentAuthor && (
                  <Button size="xs" onClick={() => handleRemoveComment(comment._id)} mt={2}>
                    Remove
                  </Button>
                )}
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
            boxShadow='xl' border="1px solid" borderColor='#aaabad'
          />
          <Button onClick={handleAddComment}>Add Comment</Button>
        </VStack>
      </Box>
    </Container>
    </Box>
  );
};

export default BookDetails;