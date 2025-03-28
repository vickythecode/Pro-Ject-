// components/ProjectFiles.js
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const ProjectFiles = () => {
  const { projectId } = useParams();
  const { darkMode } = useTheme();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch files on component load
  useEffect(() => {
    fetchFiles();
  }, []);

  // Fetch project files
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/files/${projectId}/files`,
        {
          method: "GET",
          credentials: "include",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch files");

      const data = await response.json();
      setFiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload file
  const uploadFile = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `http://localhost:4000/api/files/${projectId}/upload`,
        {
          method: "POST",
          credentials: "include",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("File upload failed");

      await fetchFiles(); // Refresh file list
      setSelectedFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete file
  const deleteFile = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/files/${fileId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to delete file");

      await fetchFiles(); // Refresh file list after deletion
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  // Styles for Light and Dark Mode
  const containerClass = darkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-gray-900";

  const inputClass = darkMode
    ? "bg-gray-800 text-white border-gray-600"
    : "bg-gray-200 text-gray-900 border-gray-300";

  const buttonClass = darkMode
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-blue-500 hover:bg-blue-600";

  const fileListClass = darkMode
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-gray-200 hover:bg-gray-100";

  return (
    <div
      className={`w-full h-screen flex flex-col items-center justify-center overflow-auto p-6 transition-all duration-300 ${containerClass}`}
    >
      <div className={`w-full max-w-4xl h-full overflow-auto p-6 rounded-lg shadow-lg ${darkMode?"bg-gray-800 text-white":""}`}>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          📂 Project Files
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Only images and documents are allowed! 📚
        </p>

        {/* Upload Form */}
        <form
          onSubmit={uploadFile}
          className="flex items-center gap-4 mb-6 bg-gray-800 p-4 rounded-lg w-full"
        >
          <input
            type="file"
            onChange={handleFileChange}
            className={`p-2 w-full rounded-lg border focus:outline-none ${inputClass}`}
          />
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-md transition-all duration-300 ${buttonClass}`}
          >
            Upload
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Loading State */}
        {loading && (
          <p className="text-gray-400 text-center animate-pulse">Loading files...</p>
        )}

        {/* File List */}
        {files.length === 0 && !loading ? (
          <p className="text-gray-400 text-center">No files uploaded yet.</p>
        ) : (
          <ul className="space-y-3 overflow-auto max-h-[65vh]">
            {files.map((file) => (
              <li
                key={file._id}
                className={`flex justify-between items-center p-3 rounded-lg transition-all ${fileListClass}`}
              >
                <span className="text-lg font-medium">{file.filename}</span>
                <div className="flex gap-3">
                  <a
                    href={`http://localhost:4000/api/files/download/${file.filepath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md transition-all"
                  >
                    📥 Download
                  </a>
                  <button
                    onClick={() => deleteFile(file._id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition-all"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectFiles;
