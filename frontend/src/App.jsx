import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/Dashboard";
import Chat from "./components/Chat";
import ProjectDetail from "./pages/ProjectDetail";
import Projects from "./pages/Projects";
import Notifications from "./components/Notification";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TodoList from "./components/TodoList";
import ContactForm from "./components/ContactForm";
import ProjectFiles from "./components/ProjectFiles";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={user ? <Navigate to="/login" /> : <Register />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />

        {/* Protected Routes (Require Authentication) */}
        {user && (
          <>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/todo" element={<TodoList/>}/>
            <Route path="/chat/:projectId" element={<Chat />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/contact" element={<ContactForm/>}/>
            <Route path="/files/:projectId" element={<ProjectFiles/>}/>
          </>
        )}

        {/* Redirect Unknown Routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
