import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/style.css";

// component imports
import App from "./App";
import ErrorPage from "./pages/Error";
import Homepage from "./pages/Homepage";
import Library from "./pages/Library";
import MyFavorites from "./pages/MyFavorites";

// router configuration
const routerConfig = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "/homepage", element: <Homepage /> },
      { path: "/library", element: <Library /> },
      { path: "/my-favorites", element: <MyFavorites /> },
    ],
  },
];

const router = createBrowserRouter(routerConfig);

// render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
