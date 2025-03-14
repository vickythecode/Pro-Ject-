import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaRegCircle,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const TodoList = () => {
  const { darkMode } = useTheme();
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("user-tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("user-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    if (editTaskId !== null) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editTaskId ? { ...task, text: newTask } : task
        )
      );
      setEditTaskId(null);
    } else {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    }
    setNewTask("");
  };

  const editTask = (id, text) => {
    setEditTaskId(id);
    setNewTask(text);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center px-4 py-10 transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-3xl lg:max-w-4xl p-6 sm:p-8 rounded-xl shadow-lg border transition-all ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-300"
        }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">
          📝 Manage Your Tasks
        </h2>

        {/* Task Input */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
                : "bg-gray-200 text-gray-900 border-gray-300 focus:ring-blue-400"
            }`}
          />
          <button
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-transform transform hover:scale-105 w-full sm:w-auto"
          >
            {editTaskId !== null ? <FaEdit /> : <FaPlus />}
            <span>{editTaskId !== null ? "Update" : "Add"}</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 space-y-3 sm:space-y-0">
          <p className="text-lg font-medium">{filteredTasks.length} task(s) found</p>
          <div className="flex flex-wrap justify-center space-x-2">
            {["all", "pending", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-transform transform hover:scale-105 ${
                  filter === status
                    ? "bg-blue-500 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-blue-400 hover:text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-400 hover:text-white"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <ul className="space-y-4 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between p-4 rounded-lg shadow-md transition-all duration-300 border ${
                task.completed
                  ? darkMode
                    ? "bg-green-900 border-green-500"
                    : "bg-green-100 border-green-400"
                  : darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-200 border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-4">
                <button onClick={() => toggleCompletion(task.id)} className="text-2xl">
                  {task.completed ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaRegCircle className="text-gray-500 hover:text-blue-500" />
                  )}
                </button>
                <span
                  className={`text-lg ${
                    task.completed
                      ? "line-through text-gray-500"
                      : darkMode
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  {task.text}
                </span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => editTask(task.id, task.text)}
                  className="text-yellow-500 hover:text-yellow-400 transition-transform transform hover:scale-110"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-400 transition-transform transform hover:scale-110"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <p className="text-center text-gray-500 mt-6 text-lg animate-pulse">
            🎉 No tasks available. Enjoy your time!
          </p>
        )}
      </div>
    </div>
  );
};

export default TodoList;
