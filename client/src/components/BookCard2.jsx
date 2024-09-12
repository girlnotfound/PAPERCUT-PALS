import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Img,
  Flex,
  Center,
  useColorModeValue,
  HStack,
  Badge,
  Input,
  Button,
  VStack,
} from "@chakra-ui/react";
import { BsArrowUpRight, BsHeart, BsHeartFill } from "react-icons/bs";

const CommentSection = ({ bookId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  React.useEffect(() => {
    // Fetch comments for the book
    // This is a placeholder - you'd typically fetch from a backend
    setComments([
      { id: 1, user: "User1", text: "Great book!" },
      { id: 2, user: "User2", text: "I enjoyed reading this." },
    ]);
  }, [bookId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Add new comment
      // In a real app, you'd send this to your backend
      setComments([
        ...comments,
        { id: Date.now(), user: "CurrentUser", text: newComment },
      ]);
      setNewComment("");
    }
  };

  return (
    <Box>
      <VStack align="stretch" spacing={4}>
        {comments.map((comment) => (
          <Box key={comment.id} p={2} bg="gray.100" borderRadius="md">
            <Text fontWeight="bold">{comment.user}</Text>
            <Text>{comment.text}</Text>
          </Box>
        ))}
      </VStack>
      <form onSubmit={handleSubmit}>
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          mt={4}
        />
        <Button type="submit" mt={2}>
          Post Comment
        </Button>
      </form>
    </Box>
  );
};

const BookCard = ({
  book,
  addToFavorites,
  imageHeight = "450px",
  boxWidth = "310px",
  showComments = false,
}) => {
  const [liked, setLiked] = useState(false);

  if (!book || typeof book !== "object") {
    return null;
  }

  const { imageLinks, title, authors, categories, id, monthStatus } = book;

  const getMonthStatusColor = (status) => {
    switch (status) {
      case "last":
        return "purple";
      case "current":
        return "green";
      case "next":
        return "blue";
      default:
        return "gray";
    }
  };

  const getMonthStatusText = (status) => {
    switch (status) {
      case "last":
        return "Last Month's Book";
      case "current":
        return "This Month's Book";
      case "next":
        return "Next Month's Book";
      default:
        return "";
    }
  };

  return (
    <Center py={6}>
      <Box
        w={boxWidth}
        rounded={"sm"}
        my={5}
        mx={[0, 5]}
        overflow={"hidden"}
        bg="white"
        border={"1px"}
        borderColor="black"
        boxShadow={useColorModeValue("10px 10px 0 #323535", "10px 10px 0 cyan")}
      >
        <Box h={imageHeight} borderBottom={"1px"} borderColor="black">
          <Img
            src={imageLinks?.thumbnail || "https://via.placeholder.com/128x192"}
            roundedTop={"sm"}
            objectFit="cover"
            h="full"
            w="full"
            alt={title || "Book cover"}
          />
        </Box>
        <Box p={4}>
          <Box
            bg="black"
            display={"inline-block"}
            px={2}
            py={1}
            color="white"
            mb={2}
          >
            <Text fontSize={"xs"} fontWeight="medium">
              {categories?.[0] || "Fiction"}
            </Text>
          </Box>
          <Heading color={"black"} fontSize={"2xl"} noOfLines={1}>
            {title || "Untitled"}
          </Heading>
          <Text color={"gray.500"} noOfLines={2}>
            {authors?.join(", ") || "Unknown Author"}
          </Text>
          {monthStatus && (
            <Badge
              colorScheme={getMonthStatusColor(monthStatus)}
              mt={2}
              fontSize="sm"
            >
              {getMonthStatusText(monthStatus)}
            </Badge>
          )}
        </Box>
        <HStack borderTop={"1px"} color="black">
          <Flex
            p={4}
            alignItems="center"
            justifyContent={"space-between"}
            roundedBottom={"sm"}
            cursor={"pointer"}
            w="full"
            as={Link}
            to={`/book/${id}`}
          >
            <Text fontSize={"md"} fontWeight={"semibold"}>
              View Details
            </Text>
            <BsArrowUpRight />
          </Flex>
          <Flex
            p={4}
            alignItems="center"
            justifyContent={"space-between"}
            roundedBottom={"sm"}
            borderLeft={"1px"}
            cursor="pointer"
            onClick={() => {
              setLiked(!liked);
              if (addToFavorites) addToFavorites(book);
            }}
          >
            {liked ? (
              <BsHeartFill fill="red" fontSize={"24px"} />
            ) : (
              <BsHeart fontSize={"24px"} />
            )}
          </Flex>
        </HStack>
        {showComments && (
          <Box p={4}>
            <CommentSection bookId={id} />
          </Box>
        )}
      </Box>
    </Center>
  );
};

export default BookCard;
