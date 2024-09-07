import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Homepage from "./pages/Homepage";

function App() {
  const location = useLocation();

  return (
    <div className="book-club-container">
      <Header />
      <Navigation />
      <main className="book-club-content">
        {location.pathname === "/" ? <Homepage /> : <Outlet />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
