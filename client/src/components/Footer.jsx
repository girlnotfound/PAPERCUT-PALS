import React from "react";
import { Link } from "react-router-dom";
import "../styles/style.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-100 mt-auto bg-secondary p-4">
      <div className="container text-center mb-5">
        <h4>
          Made with{" "}
          <span
            className="emoji"
            role="img"
            aria-label="heart"
            aria-hidden="false"
          >
            ❤️
          </span>{" "}
          by the Your Project Team
        </h4>
        <p className="mt-3">
          &copy; {currentYear} PAPERCUT PALS. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
