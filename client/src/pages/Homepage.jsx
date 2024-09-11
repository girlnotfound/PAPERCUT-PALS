import React, { useEffect, useRef, useState, useCallback } from "react";
import Flickity from "flickity";
import axios from "axios";
import "flickity/css/flickity.css";
import "../styles/style.css";
import {
  Center,
  Box,
  Img,
  Text,
  Heading,
  HStack,
  Flex,
  Link,
  Spinner,
} from "@chakra-ui/react";
import { BsArrowUpRight, BsHeart, BsHeartFill } from "react-icons/bs";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // static getDerivedStateFromError(error) {
  //   return { hasError: true };
  // }

  componentDidCatch(error, errorInfo) {
    console.log("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default function Homepage() {
  const carouselRef = useRef(null);
  const [books, setBooks] = useState([]);
  const [liked, setLiked] = useState({});
  const [loading, setLoading] = useState(true);
  const flickityInstanceRef = useRef(null);

  const boxWidth = "xs";
  const imageHeight = "200px";

  console.log("Component rendering. Books:", books.length, "Loading:", loading);

  // Fetch books
  useEffect(() => {
    console.log("Fetching books...");
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=40"
        );
        console.log("Books fetched:", response.data.items.length);
        setBooks(response.data.items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (
        (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
        flickityInstanceRef.current
      ) {
        event.preventDefault();
        const randomIndex = Math.floor(Math.random() * books.length);
        flickityInstanceRef.current.select(randomIndex, false, true);
      }
    },
    [books]
  );

  // Initialize Flickity
  useEffect(() => {
    console.log(
      "Initializing Flickity. Books:",
      books.length,
      "Ref:",
      carouselRef.current
    );
    if (
      books.length > 0 &&
      carouselRef.current &&
      !flickityInstanceRef.current
    ) {
      const flickityOptions = {
        cellAlign: "center",
        contain: true,
        wrapAround: true,
        selectedAttraction: 0.02,
        friction: 0.8,
        accessibility: true,
      };

      flickityInstanceRef.current = new Flickity(
        carouselRef.current,
        flickityOptions
      );
      carouselRef.current.focus();
      carouselRef.current.addEventListener("keydown", handleKeyDown);

      console.log("Flickity initialized");
    }

    return () => {
      console.log("Cleaning up Flickity");
      if (flickityInstanceRef.current) {
        flickityInstanceRef.current.destroy();
        flickityInstanceRef.current = null;
      }
      if (carouselRef.current) {
        carouselRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [books, handleKeyDown]);

  const addToFavorites = (book) => {
    setLiked((prev) => ({ ...prev, [book.id]: !prev[book.id] }));
    console.log("Added to favorites:", book.volumeInfo.title);
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <ErrorBoundary>
      <div className="homepage-container page-container">
        <div
          className="carousel"
          ref={carouselRef}
          aria-label="Book Carousel"
          tabIndex="0"
        >
          {books.map((book) => (
            <Center py={6} key={book.id}>
              <Box
                w={boxWidth}
                rounded={"sm"}
                my={5}
                mx={[0, 5]}
                overflow={"hidden"}
                bg="white"
                border={"1px"}
                borderColor="black"
                // boxShadow={useColorModeValue(
                //   "10px 10px 0 black",
                //   "10px 10px 0 cyan"
                // )}
              >
                <Box h={imageHeight} borderBottom={"1px"} borderColor="black">
                  <Img
                    src={
                      book.volumeInfo.imageLinks?.thumbnail ||
                      "https://via.placeholder.com/128x192"
                    }
                    roundedTop={"sm"}
                    objectFit="cover"
                    h="full"
                    w="full"
                    alt={book.volumeInfo.title}
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
                      {book.volumeInfo.categories?.[0] || "Fiction"}
                    </Text>
                  </Box>
                  <Heading color={"black"} fontSize={"2xl"} noOfLines={1}>
                    {book.volumeInfo.title}
                  </Heading>
                  <Text color={"gray.500"} noOfLines={2}>
                    {book.volumeInfo.authors?.join(", ")}
                  </Text>
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
                    to={`/book/${book.id}`}
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
                    onClick={() => addToFavorites(book)}
                  >
                    {liked[book.id] ? (
                      <BsHeartFill fill="red" fontSize={"24px"} />
                    ) : (
                      <BsHeart fontSize={"24px"} />
                    )}
                  </Flex>
                </HStack>
              </Box>
            </Center>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
