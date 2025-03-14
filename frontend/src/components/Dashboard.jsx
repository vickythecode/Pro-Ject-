import { Link } from "react-router-dom";
import Footer from "./Footer";
import { useTheme } from "../context/ThemeContext";

const Dashboard = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`transition-all ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Hero Section */}
      <header className={`${darkMode ? "bg-gray-800" : "bg-gray-100"} text-center py-20`}>
        <h1 className="text-5xl font-bold mb-6">🚀 Project Management Made Simple</h1>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Collaborate, assign tasks, and manage projects seamlessly.
        </p>
        <Link 
          to="/login" 
          className={`px-8 py-3 rounded-lg text-lg transition ${darkMode ? "bg-blue-500 hover:bg-blue-400 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
        >
          Get Started
        </Link>
      </header>

      {/* Features Section */}
      <section className={`py-16 px-6 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <h2 className="text-4xl font-semibold text-center mb-12">
          🌟 Platform Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Collaborate in Real-Time"
            description="Chat and communicate with your teammates instantly."
            darkMode={darkMode}
          />
          <FeatureCard
            title="Task Management"
            description="Create, assign, and track tasks with ease."
            darkMode={darkMode}
          />
          <FeatureCard
            title="AI-Powered Insights"
            description="Gain intelligent insights to optimize your workflow."
            darkMode={darkMode}
          />
          <FeatureCard
            title="Admin Panel"
            description="Manage users, track projects, and oversee the entire platform."
            darkMode={darkMode}
          />
          <FeatureCard
            title="Secure Authentication"
            description="Robust authentication for user and admin roles."
            darkMode={darkMode}
          />
          <FeatureCard
            title="Notification System"
            description="Stay updated with real-time project notifications."
            darkMode={darkMode}
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`py-16 px-6 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100"}`}>
        <h2 className="text-4xl font-semibold text-center mb-12">📘 How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <StepCard step="1" title="Sign Up or Log In" darkMode={darkMode} />
          <StepCard step="2" title="Create or Join Projects" darkMode={darkMode} />
          <StepCard step="3" title="Assign & Track Tasks" darkMode={darkMode} />
          <StepCard step="4" title="Communicate via Chat" darkMode={darkMode} />
          <StepCard step="5" title="Manage with Admin Panel" darkMode={darkMode} />
          <StepCard step="6" title="Stay Updated with Notifications" darkMode={darkMode} />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-bold mb-8">Ready to Boost Your Productivity?</h2>
        <p className={`text-lg mb-8 max-w-xl mx-auto ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          Start managing your projects like a pro – streamline communication,
          track progress, and achieve more with our AI-powered solution.
        </p>
        <Link
          to="/login"
          className={`px-8 py-3 rounded-lg text-lg transition ${darkMode ? "bg-green-500 hover:bg-green-400 text-white" : "bg-green-600 hover:bg-green-500 text-white"}`}
        >
          Get Started for Free
        </Link>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Feature Card Component (Dark Mode Support Added)
const FeatureCard = ({ title, description, darkMode }) => (
  <div className={`p-6 border rounded-lg shadow-md transition ${darkMode ? "bg-gray-900 border-gray-700 text-white hover:bg-gray-700" : "bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-200"}`}>
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <p>{description}</p>
  </div>
);

// Step Card Component (Dark Mode Support Added)
const StepCard = ({ step, title, darkMode }) => (
  <div className={`p-6 border rounded-lg transition text-center ${darkMode ? "border-gray-600 bg-gray-900 hover:bg-gray-700 text-white" : "border-gray-300 bg-white hover:bg-gray-200 text-gray-900"}`}>
    <span className={`text-5xl font-bold ${darkMode ? "text-blue-400" : "text-blue-500"}`}>{step}</span>
    <h3 className="text-2xl font-semibold mt-4">{title}</h3>
  </div>
);

export default Dashboard;
