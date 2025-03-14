import UsersList from "./UsersList";
import ProjectsList from "./ProjectsList";
import MessagesList from "./MessageList";
import { useTheme } from "../context/ThemeContext";

const AdminPanel = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen p-6 sm:p-10 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-4xl font-extrabold text-center mb-10">Admin Panel</h1>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Users Section */}
        <section
          className={`shadow-md rounded-lg p-6 transition-colors duration-300 ${
            darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            Manage Users
          </h2>
          <UsersList />
        </section>

        {/* Projects Section */}
        <section
          className={`shadow-md rounded-lg p-6 transition-colors duration-300 ${
            darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            Manage Projects
          </h2>
          <ProjectsList />
        </section>

        {/* Messages Section */}
        <section
          className={`shadow-md rounded-lg p-6 transition-colors duration-300 ${
            darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            User Messages
          </h2>
          <MessagesList />
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
