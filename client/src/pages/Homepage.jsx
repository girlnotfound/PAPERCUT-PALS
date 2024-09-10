import { useEffect, useRef, useState } from "react";
import Flickity from "flickity";
import axios from "axios";
import "flickity/css/flickity.css";
import "../styles/style.css";
import { Image } from "@chakra-ui/react";

export default function Homepage() {
  const carouselRef = useRef(null);
  const [books, setBooks] = useState([]);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=5");
        setBooks(response.data.items);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Initialize Flickity
  useEffect(() => {
    const flickityOptions = {
      cellAlign: "center",
      contain: true,
      wrapAround: true,
      selectedAttraction: 0.02,
      friction: 0.8
    };

    const flickity = new Flickity(carouselRef.current, flickityOptions);

    return () => {
      flickity.destroy();
    };
  }, []);

  return (
    <div className="homepage-container page-container">
      <div className="carousel" ref={carouselRef} aria-label="Book Carousel">
        {books.map((book) => (
          <div key={book.id || book.volumeInfo.title} className="carousel-cell">
            <h2>{book.volumeInfo.title}</h2>
            <p>{book.volumeInfo.authors.join(", ")}</p>
            <Image
              src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x192"}
              alt={`Cover of ${book.volumeInfo.title}`}
              height="60vh"
            />
          </div>
        ))}
      </div>
    </div>
  );
}