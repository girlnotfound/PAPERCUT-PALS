import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement,
  Image,
  FormErrorMessage
} from "@chakra-ui/react";
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import { FaUserAlt, FaLock } from "react-icons/fa";
import leftImage from "/images/left_facing_green_glasses.png";
import rightImage from "/images/right_facing_pink_glasses.png";

// create Chakra UI versions of the icon components
const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const SignUp = () => {
  // state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // function to handle password visibility toggle
  const handleShowClick = () => setShowPassword(!showPassword);

const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };


  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: '', email: '', password: '' };
  
    if (!formState.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }
  
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
  
    if (!formState.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formState.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const { data } = await addUser({
          variables: { ...formState },
        });
        Auth.login(data.addUser.token);
      } catch (e) {
        console.error(e);
        setErrors({ ...errors, form: e.message });
      }
    }
  };

  return (
    // main container
    <Flex
      width="100vw"
      height="100vh"
      backgroundColor="#f7f7f7"
      justifyContent="center"
      alignItems="center"
      bgGradient="linear(-20deg, #d558c8 0%, #24d292 100%)"
    >
      {/* right image */}
      <Box
        display={{ base: "none", lg: "flex" }}
        width="15%"
        height="auto"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Image
          src={rightImage}
          alt="right facing Papercut Pal"
          objectFit="cover"
          height="auto"
          maxHeight="300px"
        />
      </Box>

      {/* central content */}
      <Flex
        flexDirection="column"
        width={{ base: "100%", lg: "50%" }}
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        {/* stack for centering content */}
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
          width={{ base: "90%", md: "70%", lg: "80%" }}
          spacing={8}
        >
          {/* avatar and heading */}
          <Avatar bg="#929aab" size="xl" />
          <Heading color="#393e46" size="2xl">
            Welcome
          </Heading>

          {/* form container */}
          <Box width="100%">
            {" "}
            <form onSubmit={handleFormSubmit}>
              <Stack
                spacing={6}
                p={{ base: "1.5rem", md: "2rem" }}
                backgroundColor="#e7eaf6"
                boxShadow="lg"
                borderRadius="xl"
              >
                

                {/* username input field */}
                <FormControl isInvalid={!!errors.username}>
                  <InputGroup size="lg">
                    {" "}
                    <InputLeftElement pointerEvents="none">
                      <CFaUserAlt color="#929aab" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="Username"
                      name="username"
                      borderColor="#929aab"
                      value={formState.name}
                      onChange={handleChange}
                      _hover={{ borderColor: "#393e46" }}
                      _focus={{
                        borderColor: "#393e46",
                        boxShadow: "0 0 0 1px #393e46",
                      }}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>

                {/* email input field */}
                <FormControl isInvalid={!!errors.email}>
                  <InputGroup size="lg">
                    {" "}
                    <InputLeftElement pointerEvents="none">
                      <CFaUserAlt color="#929aab" />
                    </InputLeftElement>
                    <Input
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      borderColor="#929aab"
                      _hover={{ borderColor: "#393e46" }}
                      _focus={{
                        borderColor: "#393e46",
                        boxShadow: "0 0 0 1px #393e46",
                      }}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                {/* password input field */}
                <FormControl isInvalid={!!errors.password}>
                  <InputGroup size="lg">
                    {" "}
                    <InputLeftElement pointerEvents="none" color="#929aab">
                      <CFaLock color="#929aab" />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      value={formState.password}
                      onChange={handleChange}
                      borderColor="#929aab"
                      _hover={{ borderColor: "#393e46" }}
                      _focus={{
                        borderColor: "#393e46",
                        boxShadow: "0 0 0 1px #393e46",
                      }}
                    />
                    {/* password visibility toggle button */}
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowClick}
                        bg="#929aab"
                        color="#f7f7f7"
                        _hover={{ bg: "#393e46" }}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                {/* sign up button*/}
                <Button
                  borderRadius="md"
                  type="submit"
                  variant="solid"
                  bg="#393e46"
                  color="#f7f7f7"
                  width="full"
                  size="lg"
                  _hover={{ bg: "#929aab" }}
                >
                  Sign Up
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>

      {/* left image */}
      <Box
        display={{ base: "none", lg: "flex" }}
        width="15%"
        height="auto"
        alignItems="center"
        justifyContent="flex-end"
        flexDirection="row-reverse"
      >
        <Image
          src={leftImage}
          alt="left facing Papercut Pal"
          objectFit="cover"
          height="auto"
          maxHeight="300px"
        />
      </Box>
    </Flex>
  );
};

export default SignUp;
