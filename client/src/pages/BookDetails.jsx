import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
} from "@chakra-ui/react";
import { BsHeartFill, BsHeart } from "react-icons/bs";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
    fetchBook();

    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, [id]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now(), text: newComment }]);
      setNewComment("");
    }
  };

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

  const isFavorite = book ? favorites.some((fav) => fav.id === book.id) : false;

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(book);
    } else {
      addToFavorites(book);
    }
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  if (!book) return <Box>Loading...</Box>;

  return (
    <Container maxW="container.xl" py={12}>
      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        <Box flex={1}>
          <Image
            src={
              book.volumeInfo.imageLinks?.thumbnail ||
              "https://via.placeholder.com/128x192"
            }
            alt={book.volumeInfo.title}
            objectFit="cover"
            w="full"
            h="500px"
            borderRadius="md"
            boxShadow={useColorModeValue(
              "10px 10px 0 #323535",
              "10px 10px 0 cyan"
            )}
          />
        </Box>
        <VStack flex={2} align="start" spacing={4}>
          <Heading size="2xl">{book.volumeInfo.title}</Heading>
          <Text fontSize="xl" color={textColor}>
            by {book.volumeInfo.authors?.join(", ")}
          </Text>
          <HStack>
            <Text fontWeight="bold">Categories:</Text>
            <Text>
              {book.volumeInfo.categories?.join(", ") || "Not specified"}
            </Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold">Published:</Text>
            <Text>{book.volumeInfo.publishedDate}</Text>
          </HStack>
          <Box>
            <Text fontWeight="bold">Description:</Text>
            <Text color={textColor}>{book.volumeInfo.description}</Text>
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
        <Heading size="lg" mb={4}>
          Comments
        </Heading>
        <VStack spacing={4} align="stretch">
          {comments.map((comment) => (
            <Box
              key={comment.id}
              p={4}
              bg={bgColor}
              borderRadius="md"
              borderWidth={1}
              borderColor={borderColor}
            >
              <Text>{comment.text}</Text>
            </Box>
          ))}
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            size="sm"
          />
          <Button onClick={handleAddComment} colorScheme="blue">
            Add Comment
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default BookDetails;
