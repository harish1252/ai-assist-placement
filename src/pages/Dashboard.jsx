import React, { useState, useEffect } from "react";
import {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
} from "../services/taskService";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [streak, setStreak] = useState(7);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, []);

  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);
  const progress =
    tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  // Add Task
  const addTask = async () => {
    if (newTask.trim() === "") return;
    try {
      const created = await createTask(newTask);
      setTasks([...tasks, created]);
      setNewTask("");
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  // Delete Task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  // Toggle Complete
  const handleToggleTask = async (id) => {
    setTasks(
      tasks.map((task) =>
        task._id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
    try {
      await toggleTask(id);
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  // Calendar Logic
  const today = new Date();
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const monthName = selectedDate.toLocaleString("default", { month: "long" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setSelectedDate(new Date(year, month - 1, 1));
  const nextMonth = () => setSelectedDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  if (loadingTasks) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          Welcome to AI Assist 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Ready for today's placement preparation?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-3xl font-bold text-green-600 mt-1">
            {completedTasks.length}
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="text-3xl font-bold text-yellow-500 mt-1">
            {pendingTasks.length}
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Progress</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-1">
            {Math.round(progress)}%
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Streak</p>
          <h2 className="text-3xl font-bold text-purple-600 mt-1">
            🔥 {streak} Days
          </h2>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Overall Progress
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {completedTasks.length} of {tasks.length} tasks completed
        </p>
      </div>

      {/* Calendar + Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevMonth}
              className="text-blue-900 font-bold text-lg hover:text-blue-600"
            >
              ‹
            </button>
            <h2 className="text-lg font-semibold text-gray-700">
              {monthName} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="text-blue-900 font-bold text-lg hover:text-blue-600"
            >
              ›
            </button>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 text-center gap-y-2">
            {days.map((day, index) => (
              <div
                key={index}
                onClick={() =>
                  day && setSelectedDate(new Date(year, month, day))
                }
                className={`text-sm py-1 rounded-full cursor-pointer
                  ${!day ? "" : "hover:bg-blue-100"}
                  ${
                    day === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear()
                      ? "bg-blue-900 text-white font-bold"
                      : "text-gray-700"
                  }
                  ${
                    day === selectedDate.getDate() &&
                    month === selectedDate.getMonth()
                      ? "ring-2 ring-blue-400"
                      : ""
                  }
                `}
              >
                {day || ""}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-blue-700 font-medium mt-4">
            📅 {selectedDate.toDateString()}
          </p>
        </div>

        {/* Task Manager */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            📋 My Tasks
          </h2>

          {/* Add Task */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTask}
              className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>

          {/* Task List */}
          <ul className="flex flex-col gap-2 max-h-72 overflow-y-auto">
            {tasks.map((task) => (
              <li
                key={task._id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm ${
                  task.completed
                    ? "bg-green-50 border-green-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task._id)}
                    className="cursor-pointer"
                  />
                  <span
                    className={
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }
                  >
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-400 hover:text-red-600 font-bold text-lg"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
