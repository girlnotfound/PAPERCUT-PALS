import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./styles/style.css";
import { ChakraProvider } from "@chakra-ui/react";


// component imports
import App from "./App";
import ErrorPage from "./pages/Error";
import Homepage from "./pages/Homepage";
import Library from "./pages/Library";
import PaperClip from "./pages/PaperClip";
import MyFavorites from "./pages/MyFavorites";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AboutUs from './pages/AboutUS';
import UserProfile from './pages/UserProfile';
import BookDetails from './pages/BookDetails';
import SearchBar from "./components/SearchBar";


// router configuration
const routerConfig = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/signin" replace /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/homepage", element: <Homepage /> },
      { path: "/library", element: <Library /> },
      { path: "/my-favorites", element: <MyFavorites /> },
      { path: "/signup", element: <SignUp />},
      { path: "/about-us", element: <AboutUs />},
      { path: "/UserProfile", element: <UserProfile />},
      { path: "/book/:id", element: <BookDetails /> },
      { path: "/SearchBaR", element: <SearchBar /> },
      { 
        path: "/paperclip", 
        element: <PaperClip /> 
      },
    ],
  },
];

const router = createBrowserRouter(routerConfig);

// render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);