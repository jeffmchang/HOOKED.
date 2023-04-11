import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
import NavBar from "./Components/Navbar";
import SignUpForm from "./Components/SignUpForm";
import LoginForm from "./Components/LogInForm";
import Hero from "./Components/Hero";
import Footer from "./Components/Footer";
import SearchPage from "./Components/SearchPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider
        tokenUrl={`${process.env.REACT_APP_USER_SERVICE_API_HOST}/token`}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/searchpage" element={<SearchPage />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
