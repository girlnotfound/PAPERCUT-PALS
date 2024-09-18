import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Image,
  SimpleGrid,
  VStack,
  HStack,
  useColorModeValue,
  Wrap,
  WrapItem,
  List, 
  ListItem, 
  ListIcon,
  Center
} from "@chakra-ui/react";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";

const AboutUs = () => {
  const bgGradient = useColorModeValue(
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)",
    "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)"
  );

  const FuturePlanCard = ({ title, description }) => {
    return (
      <Box
        p={6}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow='dark-lg' rounded='md' 
        borderRadius="lg"
        transition="all 0.3s"
        _hover={{ boxShadow: "xl" }}
      >
        <Heading as="h3" size="lg" mb={2}>
          {title}
        </Heading>
        <Text color={useColorModeValue("gray.600", "gray.200")}>
          {description}
        </Text>
      </Box>
    );
  };

  const futurePlans = [
    {
      title: "Friends List",
      description:"Add other bookworms who are interested in similar genres or authors so that you may explore new books together.",
    },
    {
      title: "Chat Rooms / Private Messages",
      description: "Join groups with people interested in similar books so you may talk privately and seperatly from the comment setions.",
    },
    {
      title: "Upload Books",
      description: "Allow users to be able to upload their own books or books they can't seem to find in our library.",
    },
    {
      title: "Book store",
      description: "Create a Section on our webpage where users have the option to buy their favorite books directly from us.",
    },
  ];

  const CreatorCard = ({ name, image, github, email }) => {
    return (
      <Box
        borderWidth={1}
        borderRadius="lg"
        overflow="hidden"
        bg={useColorModeValue("white", "gray.700")}
        boxShadow="dark-lg"
        w="250px"
      >
        <Image src={image} alt={name} objectFit="cover" h="200px" w="100%" />
        <VStack p={4} align="center" spacing={3}>
          <Heading as="h3" size="md">
            {name}
          </Heading>
          <HStack spacing={4}>
            <Button
              as="a"
              href={github}
              target="_blank"
              leftIcon={<FaGithub />}
              colorScheme="teal"
              size="sm"
            >
              GitHub
            </Button>
            <Button
              as="a"
              href={`mailto:${email}`}
              leftIcon={<FaEnvelope />}
              colorScheme="blue"
              size="sm"
            >
              Email
            </Button>
          </HStack>
        </VStack>
      </Box>
    ); 
  }; 

  const creators = [
    {
      name: "Adam Rosenberg",
      image: "https://avatars.githubusercontent.com/u/164822352?v=4",
      github: "https://github.com/AcoderRose",
      email: "rosencloud@icloud.com",
    },
    {
      name: "Justin Herrera",
      image: "https://avatars.githubusercontent.com/u/163674455?v=4",
      github: "https://github.com/Justino11247",
      email: "herrerajustin11@gmail.com",
    },
    {
      name: "Kaila Ronquillo",
      image: "https://avatars.githubusercontent.com/u/150276019?v=4",
      github: "https://github.com/girlnotfound",
      email: "errorgirlnotfound@gmail.com",
    },
    {
      name: "Renz Carl Supnet",
      image: "https://avatars.githubusercontent.com/u/31431868?v=4",
      github: "https://github.com/renzsupnet",
      email: "renzlakers24@gmail.com",
    },
    {
      name: "Ryan Petersen",
      image: "https://avatars.githubusercontent.com/u/164073199?v=4",
      github: "https://github.com/RyanPetersen-89",
      email: "rp26898@gmail.com",
    },
  ];

  return (
    <Box p={8} minHeight="100vh" bgGradient={bgGradient}>
      <VStack spacing={8} align="stretch">
        <Heading
          as="h1"
          size="3xl"
          textAlign="center"
          color={useColorModeValue("gray.800", "white")}
        >
          About Us
        </Heading>

        <Center p="30px">
        <Box
          bg={useColorModeValue("white", "gray.700")}
          p={6}
          borderRadius="lg"
          w="1000px"
          boxShadow='dark-lg'  rounded='md' 
        >
          <Heading
            as="h2"
            size="xl"
            mb={4}
            textAlign="center"
            color={useColorModeValue("gray.700", "white")}
          >
            Our Mission
          </Heading>
          <Text
            fontSize="lg"
            textAlign="center"
            color={useColorModeValue("gray.600", "gray.200")}
          >
            Our mission is to revolutionize the way people discover and engage
            with literature. We strive to create an innovative and user-friendly
            platform that connects readers with their next favorite book,
            fostering a love for reading and lifelong learning.
          </Text>
        </Box>
        </Center>

        <Center p="30px">
        <Box
          bg={useColorModeValue("white", "gray.700")}
          p={6}
          borderRadius="lg"
          w="700px"
          boxShadow='dark-lg' rounded='md' 
          
        >
          <Heading
            as="h2"
            size="xl"
            mb={4}
            textAlign="center"
            color={useColorModeValue("gray.700", "white")}
          >
            Our Features Include:
          </Heading>
          <Center>
          <List spacing={3}>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Featured books of the month.
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Extensive book library with search functionality.
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Books details with options to buy off-site.
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Community engagement using comment sections for each book title.
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Library personalization with the ability to favorite books to a dedicated page.
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              User authenitication for secure sign up functionality.
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              User customization with ability to change username and/or profile picture.
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Clear system to navigate the site seamlessly.
            </ListItem>
          </List>
          </Center>
        </Box>
        </Center>


        <Box py={12}>
          <Heading
            as="h2"
            size="xl"
            textAlign="center"
            mb={8}
            color={useColorModeValue("gray.800", "white")}
          >
            Plans for Future Development
          </Heading>
          <SimpleGrid columns={[1, null, 2]} spacing={8} maxW="5xl" mx="auto">
            {futurePlans.map((plan, index) => (
              <FuturePlanCard
                key={index}
                title={plan.title}
                description={plan.description}
              />
            ))}
          </SimpleGrid>
        </Box>

        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mt={8}
          mb={6}
          color={useColorModeValue("gray.800", "white")}
        >
          Meet the Creators
        </Heading>

        <Wrap spacing={6} justify="center">
          {creators.map((creator, index) => (
            <WrapItem key={index}>
              <CreatorCard {...creator} />
            </WrapItem>
          ))}
        </Wrap>
      </VStack>
    </Box>
  );
};

export default AboutUs;
