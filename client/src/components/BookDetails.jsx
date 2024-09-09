import React, { useState } from "react";
import "./BookDetails.css"; // Assume we have some styles defined

const BookDetails = ({ book }) => {
  const [userComment, setUserComment] = useState("");
  const [comments, setComments] = useState(book.comments || []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (userComment.trim()) {
      setComments([...comments, userComment]);
      setUserComment("");
    }
  };

  return (
    <div className="book-details">
      <div className="book-image">
        <img src={book.imageUrl} alt={book.title} />
      </div>
      <div className="book-info">
        <h2>{book.title}</h2>
        <p>
          <strong>Author:</strong> {book.author}
        </p>
        <p>
          <strong>Publish Date:</strong> {book.publishDate}
        </p>
        <p>
          <strong>Publisher:</strong> {book.publisher}
        </p>
        <p>
          <strong>Genre:</strong> {book.genre}
        </p>
        <div className="synopsis">
          <h3>Synopsis</h3>
          <p>{book.synopsis}</p>
        </div>

        {/* Needs to be google books api implemented */}
        <div className="comments-section">
          <h3>Comments</h3>
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Add your comment..."
            />
            <button type="submit">Add Comment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
