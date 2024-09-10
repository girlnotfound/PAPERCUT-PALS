import { useEffect, useRef, useState} from "react";
import Flickity from "flickity";
import axios from "axios";
import "flickity/css/flickity.css";
import "../styles/style.css";
import {Image} from "@chakra-ui/react";

export default function Homepage() {
  const carouselRef = useRef(null);

  useEffect(() => {
    const flickity = new Flickity(carouselRef.current, {
      cellAlign: "center",
      contain: true,
      wrapAround: true,
      selectedAttraction: 0.02,  // Lower values make the motion smoother
      friction: 0.8             // Higher values slow down the motion faster
    });

    return () => {
      flickity.destroy();
    };
  }, []);

  const [books, setBooks] = useState([]);

  useEffect(() => {
    homeBooks();
  }, []);

  const homeBooks = async () => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=5"
      );
      setBooks(response.data.items);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  return (
    <div className="homepage-container page-container">
      <div className="carousel" ref={carouselRef}>
        {books.map((book) => (
          <div key={book.volumeInfo.title} className="carousel-cell"> {/* Using book.volumeInfo.title as the key */}
            <h2>{book.volumeInfo.title}</h2>
            <p>{book.volumeInfo.author}</p>
            <Image
              src={
                book.volumeInfo.imageLinks?.thumbnail ||
                "https://via.placeholder.com/128x192"
              }
              alt={book.volumeInfo.title}
            />
          </div>
        ))}
      </div>
    </div>
  );}