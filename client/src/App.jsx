import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";

function App() {
  return (
    <div className="book-club-container">
      <Header />
      <Navigation />
      <main className="book-club-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
