import { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { useTheme } from "../context/ThemeContext";


const ProjectDashboard = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const { darkTheme } = useTheme();

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/tasks/${projectId}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) setTasks(data);
      else console.error("Error fetching tasks:", data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Count task statuses
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for charts
  const statusLabels = Object.keys(statusCounts);
  const statusData = Object.values(statusCounts);

  // Prepare due date data for Line Chart
  const dueDates = tasks.map((task) => task.dueDate?.split("T")[0]); // Extract date part
  const dueDateCounts = dueDates.reduce((acc, date) => {
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const dueDateLabels = Object.keys(dueDateCounts);
  const dueDateData = Object.values(dueDateCounts);

  return (
    <div className={`p-8 shadow-md rounded-lg ${darkTheme ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <h2 className="text-2xl font-bold mb-6">📊 Project Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Task Completion - Pie Chart */}
        <div className="p-4 border rounded-lg shadow-md bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Task Completion</h3>
          <Pie
            data={{
              labels: statusLabels,
              datasets: [
                {
                  data: statusData,
                  backgroundColor: ["#4CAF50", "#FFC107", "#03a9f4"],
                },
              ],
            }}
          />
        </div>

        {/* Task Status - Bar Chart */}
        <div className="p-4 border rounded-lg shadow-md bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Task Status Distribution</h3>
          <Bar
            data={{
              labels: statusLabels,
              datasets: [
                {
                  label: "Tasks",
                  data: statusData,
                  backgroundColor: "#2196F3",
                },
              ],
            }}
          />
        </div>

        {/* Due Date Trends - Line Chart */}
        <div className="p-4 border rounded-lg shadow-md bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Task Due Date Trends</h3>
          <Line
            data={{
              labels: dueDateLabels,
              datasets: [
                {
                  label: "Tasks Due",
                  data: dueDateData,
                  borderColor: "#FF5722",
                  fill: false,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
