import { useEffect, useRef } from "react";
import Flickity from "flickity";
import "flickity/css/flickity.css";
import "../styles/style.css";

export default function Homepage() {
  const carouselRef = useRef(null);

  useEffect(() => {
    const flickity = new Flickity(carouselRef.current, {
      cellAlign: "left",
      contain: true,
    });

    return () => {
      flickity.destroy();
    };
  }, []);

  const books = [
    { title: "Book 1", author: "Author 1" },
    { title: "Book 2", author: "Author 2" },
    { title: "Book 3", author: "Author 3" },
  ];

  return (
    <div className="homepage-container page-container">
      <h1>PAPERCUT PALS</h1>
      <div className="carousel" ref={carouselRef}>
        {books.map((book, index) => (
          <div key={index} className="carousel-cell">
            <h2>{book.title}</h2>
            <p>{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
