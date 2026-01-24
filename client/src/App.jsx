import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Reports from "./pages/Reports";




function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
         path="/reports"
         element={
           localStorage.getItem("token") ? (
             <Reports />
           ) : (
             <Navigate to="/login" />
           )
         }
       />
      <Route
        path="/goals"
        element={
          localStorage.getItem("token") ? (
            <Goals />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
          path="/dashboard"
            element={
            localStorage.getItem("token") ? (
           <Dashboard />
          ) : (
            <Navigate to="/login" />
          )
       }
      />
    </Routes>
    
  );
}

export default App;
