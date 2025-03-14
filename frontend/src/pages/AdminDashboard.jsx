import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanel from "../components/AdminPanel";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/auth/me", {
          credentials: "include",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = await response.json();
        if (data.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          setTimeout(() => navigate("/"), 3000); 
        }
      } catch {
        setIsAdmin(false);
        setTimeout(() => navigate("/"), 3000);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (isAdmin === null) return <p className="text-center text-white mt-10">Checking admin access...</p>;

  if (isAdmin === false)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-lg font-semibold">
        <div className="p-6 bg-gray-800 rounded-md shadow-lg border border-gray-700 text-center">
          <p className="text-red-500">🚫 You are not an admin! Redirecting...</p>
        </div>
      </div>
    );

  return <AdminPanel />;
};

export default AdminDashboard;
