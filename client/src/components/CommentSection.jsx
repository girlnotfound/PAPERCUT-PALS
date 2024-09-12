import React, { useState, useEffect } from "react";
import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";

const CommentSection = ({ bookId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
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

export default CommentSection;
