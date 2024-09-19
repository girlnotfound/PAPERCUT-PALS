import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from "@apollo/client";
import axios from 'axios';
import { Box, Button, Input, Spinner, VStack, HStack, useToast, Image } from '@chakra-ui/react';
import AuthService from "../utils/auth";
import { QUERY_BOOK, QUERY_USER } from "../utils/queries";
import Header from '../components/Header';
const PaperClip = () => {

 if (!AuthService.loggedIn()) {
    window.location.assign("/signin");
    }
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const toast = useToast();
  const username = AuthService.getProfile().data.username; 
  const [getBook] = useLazyQuery(QUERY_BOOK);
  const { loading: userLoading, error: userError, data: userData, refetch } = useQuery(QUERY_USER, {
    variables: { username: username},
  });

  const API_URL = import.meta.env.VITE_URL;
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!AuthService.loggedIn()) {
      toast({
        title: "Authentication required",
        description: "Please log in to access PaperClip",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      window.location.assign("/signin");
    } else {
      setIsLoggedIn(true);
      if (!userLoading && !userError && userData && userData.user) {
        const fetchBookDetails = async () => {
          const bookDetailsPromises = userData.user.favoriteBooks.map(async (book) => {
            const { data } = await getBook({ variables: { bookId: book._id } });
            return data.book;
          });
          
          const bookDetailsResults = await Promise.all(bookDetailsPromises);
          setFavorites(bookDetailsResults);
        };
        refetch();
        fetchBookDetails();
      }
    }
  }, [userLoading, userError, userData, getBook, refetch]);

  const getPerplexityResponse = async (prompt) => {
    if (!prompt.trim()) return; // Prevent empty submissions

    setLoading(true);
    setError(null);
    setQuestions(prevQuestions => [...prevQuestions, prompt]);
    setResponses(prevResponses => [...prevResponses, null]); // Add a placeholder for the new response
    
    try {
      // Limit the number of favorite books to mention
      const favoriteBookTitles = favorites.map(book => book.title).join(', ');
      console.log(favoriteBookTitles);
      let greetMessage;
      console.log(responses.length);
      if(responses.length == 0){
        greetMessage = "Greet the user and introduce yourself."
      }else{
        greetMessage = "Do not greet the user."
      }
      
      const systemContent = `You are Sir PaperClip, a book expert of PaperCut Pals (a book search web app). Keep it short, accurate and conversational. The user is: ${username}, ${greetMessage} The user's favorite books: ${favoriteBookTitles}. Focus on books and politely decline to answer otherwise.`;

      const response = await axios.post(API_URL, {
        model: "mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: systemContent
          },
          {
            role: "user",
            content: prompt
          }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,  
          'Content-Type': 'application/json'
        }
      });

      const newResponse = response.data.choices[0].message.content;
      setResponses(prevResponses => {
        const updatedResponses = [...prevResponses];
        updatedResponses[updatedResponses.length - 1] = newResponse;
        return updatedResponses;
      });

    } catch (error) {
      console.error('Perplexity API Error:', error);
      let errorMessage = "Error: Failed to get response";
      if (error.response) {
        errorMessage += ` (${error.response.status}: ${error.response.data.error || error.response.statusText})`;
      } else if (error.request) {
        errorMessage += " (No response received)";
      } else {
        errorMessage += ` (${error.message})`;
      }
      setError(errorMessage);
      setResponses(prevResponses => {
        const updatedResponses = [...prevResponses];
        updatedResponses[updatedResponses.length - 1] = errorMessage;
        return updatedResponses;
      });
    } finally {
      setLoading(false);
      setCurrentQuestion(''); // Clear the input field
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    getPerplexityResponse(currentQuestion);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%" maxWidth="800px" mx="auto" p={4} minHeight={'72vh'}>
      <VStack spacing={4} width="100%" align="stretch">
        <Box>
          <Image 
  src='../images/Sirpaperclip2.jpg' 
  alt='Image with transparent background'
/>
        </Box> 
        {questions.map((q, i) => (
          <VStack key={i} spacing={2} align="stretch">
            <HStack justify="flex-start">
              <Box
                backgroundColor="blue.600"
                borderRadius="md"
                color="white"
                p={3}
                maxWidth="70%"
              >
                {q}
              </Box>
            </HStack>
            <HStack justify="flex-end">
              <Box
                backgroundColor="green.600"
                borderRadius="md"
                color="white"
                p={3}
                maxWidth="70%"
              >
                {responses[i] === null ? (
                  <Spinner size="sm" color='white' thickness='2px' />
                ) : (
                  responses[i]
                )}
              </Box>
            </HStack>
          </VStack>
        ))}
      </VStack>
      <Box width="100%" mb={4} position={'relative'} bottom={0} mt={5}>
        <form onSubmit={handleSubmit}>
          <Input 
            placeholder="Start a conversation!"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            mb={2}
            required
          />
          <Button 
            type="submit"
            width="100%"
            isLoading={loading}
            loadingText="Getting Response"
          >
            Get Response
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default PaperClip;