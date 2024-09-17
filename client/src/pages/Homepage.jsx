import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_BOOKS, QUERY_FAVORITEBOOKS } from '../utils/queries';
import { FAVORITE_BOOK, UNFAVORITE_BOOK } from '../utils/mutations';
import BookCard2 from '../components/BookCard2';
import { SimpleGrid, Heading, VStack } from '@chakra-ui/react';
import AuthService from "../utils/auth";

const Homepage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [favoriteBookIds, setFavoriteBookIds] = useState([]);
  const { loading: loadingBooks, data: booksData } = useQuery(QUERY_BOOKS);
  const { loading: loadingFavs, data: favsData } = useQuery(QUERY_FAVORITEBOOKS, {
    variables: { username: AuthService.getProfile().data.username } // Replace with actual username or get from context
  });
  const [favoriteBook] = useMutation(FAVORITE_BOOK);
  const [unfavoriteBook] = useMutation(UNFAVORITE_BOOK);

  useEffect(() => {
    if (booksData && booksData.books) {
      setFeaturedBooks(booksData.books.slice(0, 3));
    }
  }, [booksData]);

  useEffect(() => {
    if (favsData && favsData.favoriteBooks && favsData.favoriteBooks.favoriteBooks) {
      const favBooks = favsData.favoriteBooks.favoriteBooks;
      const favIds = Object.keys(favBooks).map(key => favBooks[key]._id);
      setFavoriteBookIds(favIds);
    }
  }, [favsData]);

  const handleToggleFavorite = async (book) => {
    try {
      const isFavorite = favoriteBookIds.includes(book._id);
      const mutation = isFavorite ? unfavoriteBook : favoriteBook;
      await mutation({
        variables: { favoriteBookId: book._id },
        refetchQueries: [{ query: QUERY_FAVORITEBOOKS, variables: { username: 'currentUser' } }]
      });

      setFavoriteBookIds(prevFavs => 
        isFavorite 
          ? prevFavs.filter(id => id !== book._id)
          : [...prevFavs, book._id]
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (loadingBooks || loadingFavs) return <div>Loading...</div>;

  return (
    <VStack spacing={8} align="stretch">
      <Heading as="h1" size="2xl" textAlign="center">Featured Books</Heading>
      <SimpleGrid columns={[1, null, 3]} spacing={10}>
        {featuredBooks.map((book, index) => (
          <VStack key={book._id}>
            <Heading as="h2" size="md">Featured Book {index + 1}</Heading>
            <BookCard2
              book={book}
              addToFavorites={() => handleToggleFavorite(book)}
              removeFromFavorites={() => handleToggleFavorite(book)}
              isFavorite={favoriteBookIds.includes(book._id)}
            />
          </VStack>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default Homepage;