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
// import MyFavorites from "./pages/MyFavorites";
import SignIn from "./pages/SignIn";

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
      { path: "/Library", element: <Library /> },
      // { path: "/my-favorites", element: <MyFavorites /> },
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
