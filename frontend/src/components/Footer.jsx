import { Link } from "react-router-dom";

const Footer = () => {
    return (
      <footer className="bg-gray-950 text-white py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Pro-Ject </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              LinkedIn
            </a>
            <Link
              to={"/contact"}
              className="hover:text-blue-400 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  