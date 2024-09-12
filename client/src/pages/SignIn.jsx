import { useState } from "react";
import {
  Flex,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  FormControl,
  FormHelperText,
  InputRightElement,
  Image,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';
import { FaUserAlt, FaLock } from "react-icons/fa";
import leftImage from "/images/left_facing_green_glasses.png";
import rightImage from "/images/right_facing_pink_glasses.png";
import logo from "/images/PapercutPals_Logo_Letering_only.png";
import "../styles/style.css";
import { LOGIN_USER } from '../utils/mutations';


// create Chakra UI versions of the icon components
const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const SignIn = () => {
  // state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_USER);
  const [alertMessage, setAlertMessage] = useState(null);
  // function to handle password visibility toggle
  const handleShowClick = () => setShowPassword(!showPassword);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setAlertMessage(null); // Clear any existing alert
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });
  
      if (data && data.login && data.login.token) {
        Auth.login(data.login.token);
      } else {
        setAlertMessage("Invalid credentials. If you're a new user, please sign up first.");
      }
    } catch (e) {
      console.error(e);
      setAlertMessage("Invalid credentials. If you're a new user, please sign up first.");
    }
  
    // clear form values
    setFormState({
      email: '',
      password: '',
    });
  };

  return (
    // main container
    <Flex
      className="main-container"
      justifyContent="center"
      alignItems="center"
      bgGradient="linear(-20deg, #d558c8 0%, #24d292 100%)"
    >
      {/* logo */}
      <Box
        className="logo-container"
        position="absolute"
        top="50px"
        left="50%"
        transform="translateX(-50%)"
        zIndex="1"
      >
        <Image
          className="logo"
          src={logo}
          alt="PapercutPals Logo"
          width="auto"
          height="auto"
        />
      </Box>

      {/* right image */}
      <Box className="side-image right-image">
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
        className="central-content"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        {/* stack for centering content */}
        <Stack
          className="content-stack"
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
          spacing={8}
        >
          {/* form container */}
          <Box className="form-wrapper" width="100%">
            {" "}
            {(error || alertMessage) && (
              <Alert status='error' mb={4}>
                <AlertIcon />
                {alertMessage}
              </Alert>
            )}
            <form onSubmit={handleFormSubmit}>
              <Stack
                className="form-stack"
                spacing={6}
                p={{ base: "1.5rem", md: "2rem" }}
                backgroundColor="#e7eaf6"
                boxShadow="lg"
                borderRadius="xl"
              >
                {/* email input field */}
                <FormControl>
                  <InputGroup size="lg">
                    {" "}
                    <InputLeftElement pointerEvents="none">
                      <CFaUserAlt color="#929aab" />
                    </InputLeftElement>
                    <Input
                      className="input-field"
                      type="email"
                      name="email"
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
                </FormControl>

                {/* password input field */}
                <FormControl>
                  <InputGroup size="lg">
                    {" "}
                    <InputLeftElement pointerEvents="none" color="#929aab">
                      <CFaLock color="#929aab" />
                    </InputLeftElement>
                    <Input
                      className="input-field"
                      type={showPassword ? "text" : "password"}
                      value={formState.password}
                      onChange={handleChange}
                      name="password"
                      placeholder="Password"
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
                        className="show-hide-btn"
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

                  {/* forgot password link */}
                  <FormHelperText
                    className="forgot-password"
                    textAlign="right"
                    mt={2}
                  >
                    <Link color="#393e46" _hover={{ color: "#929aab" }}>
                      Forgot password?
                    </Link>
                  </FormHelperText>
                </FormControl>

                {/* login button */}
                <Button
                  className="signin-btn"
                  borderRadius="md"
                  type="submit"
                  variant="solid"
                  bg="#393e46"
                  color="#f7f7f7"
                  width="full"
                  size="lg"
                  _hover={{ bg: "#929aab" }}
                >
                  Sign In
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>

        {/* sign up link */}
        <Box className="signup-link" mt={8}>
          New to us?{" "}
          <Link
            color="#393e46"
            _hover={{ color: "#929aab" }}
            href="/signup"
            fontWeight="bold"
          >
            Sign Up
          </Link>
        </Box>
      </Flex>

      {/* left image */}
      <Box className="side-image left-image">
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

export default SignIn;
