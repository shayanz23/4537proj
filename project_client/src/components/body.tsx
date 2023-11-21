import { Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import Ask from "../pages/Ask";
import Answer from "../pages/Answer";
import Login from "../pages/Login";
import Admin from "../pages/Admin";
import NotFound from "../pages/NotFound";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";

const Body = () => {
  return (
    <Routes>
      {/* The Switch decides which component to show based on the current URL.*/}
      <Route path="/" element={<Index />}></Route>
      <Route path="/ask" element={<Ask />}></Route>
      <Route path="/answer" element={<Answer />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/admin" element={<Admin />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Body;
