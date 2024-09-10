import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";

function App() {
  const location = useLocation();

  return (
    <div className="book-club-container">
      {location.pathname !== "/signin" && location.pathname !== "/signup" && location.pathname !== "/" && <Header />}
      {location.pathname !== "/signin" && location.pathname !== "/signup" && location.pathname !== "/" && <Navigation />}
      <main className="book-club-content">
        <Outlet />
      </main>
      {location.pathname !== "/signin" && location.pathname !== "/signup" && location.pathname !== "/" && <Footer />}
    </div>
  );
}

export default App;