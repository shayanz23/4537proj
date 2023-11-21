import NavBar from "./components/Navbar.tsx";
import Body from "./components/Body.tsx";
import Footer from "./components/Footer.tsx";
import "./App.css";
import "./pages/container.css";

function App() {
  return (
    <body className="body">
      <NavBar />
      <Body />
      <Footer />
    </body>
  );
}

export default App;
