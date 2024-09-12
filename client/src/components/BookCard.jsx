import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Img,
  Flex,
  Center,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { BsArrowUpRight, BsHeartFill, BsHeart } from 'react-icons/bs';

const BookCard = ({ book, addToFavorites, imageHeight = "300px", boxWidth="200px" }) => {
  const [liked, setLiked] = useState(false);

  return (
    <Center py={6}>
      <Box
        w={boxWidth}
        rounded={'sm'}
        my={5}
        mx={[0, 5]}
        overflow={'hidden'}
        bg="white"
        border={'1px'}
        borderColor="black"
        boxShadow={useColorModeValue('10px 10px 0 #323535', '10px 10px 0 cyan')}
        >
        <Box h={imageHeight} borderBottom={'1px'} borderColor="black">
          <Img
            src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192'}
            roundedTop={'sm'}
            objectFit="cover"
            h="full"
            w="full"
            alt={book.volumeInfo.title}
          />
        </Box>
        <Box p={4}>
          <Box bg="black" display={'inline-block'} px={2} py={1} color="white" mb={2}>
            <Text fontSize={'xs'} fontWeight="medium">
              {book.volumeInfo.categories?.[0] || 'Fiction'}
            </Text>
          </Box>
          <Heading color={'black'} fontSize={'2xl'} noOfLines={1}>
            {book.volumeInfo.title}
          </Heading>
          <Text color={'gray.500'} noOfLines={2}>
            {book.volumeInfo.authors?.join(', ')}
          </Text>
        </Box>
        <HStack borderTop={'1px'} color="black">
          <Flex
            p={4}
            alignItems="center"
            justifyContent={'space-between'}
            roundedBottom={'sm'}
            cursor={'pointer'}
            w="full"
            as={Link}
            to={`/book/${book.id}`}>
            <Text fontSize={'md'} fontWeight={'semibold'}>
              View Details
            </Text>
            <BsArrowUpRight />
          </Flex>
          <Flex
            p={4}
            alignItems="center"
            justifyContent={'space-between'}
            roundedBottom={'sm'}
            borderLeft={'1px'}
            cursor="pointer"
            onClick={() => {
              setLiked(!liked);
              addToFavorites(book);
            }}>
            {liked ? (
              <BsHeartFill fill="red" fontSize={'24px'} />
            ) : (
              <BsHeart fontSize={'24px'} />
            )}
          </Flex>
        </HStack>
      </Box>
    </Center>
  );
};

export default BookCard;