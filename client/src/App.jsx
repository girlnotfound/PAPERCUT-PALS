import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";

function App() {
  const location = useLocation();

  return (
    <div className="book-club-container">
      {location.pathname !== "/signin" && <Header />}
      {location.pathname !== "/signin" && <Navigation />}
      <main className="book-club-content">
        <Outlet />
      </main>
      {location.pathname !== "/signin" && <Footer />}
    </div>
  );
}

export default App;
