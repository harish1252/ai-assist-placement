import { useState, useEffect } from "react";
import { getDsaProgress, updateDsaProgress } from "../services/dsaService";

const DsaProgress = () => {
  const [dsaTopics, setDsaTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getDsaProgress();
        setDsaTopics(data);
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const totalSolved = dsaTopics.reduce((acc, t) => acc + t.solved, 0);
  const totalProblems = dsaTopics.reduce((acc, t) => acc + t.total, 0);
  const overallProgress =
    totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  const increment = async (id) => {
    setDsaTopics((prev) =>
      prev.map((t) =>
        t.id === id && t.solved < t.total ? { ...t, solved: t.solved + 1 } : t,
      ),
    );
    try {
      await updateDsaProgress(id, "increment");
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  const decrement = async (id) => {
    setDsaTopics((prev) =>
      prev.map((t) =>
        t.id === id && t.solved > 0 ? { ...t, solved: t.solved - 1 } : t,
      ),
    );
    try {
      await updateDsaProgress(id, "decrement");
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  const getColor = (percent) => {
    if (percent === 100) return "bg-green-500";
    if (percent >= 60) return "bg-blue-500";
    if (percent >= 30) return "bg-yellow-500";
    return "bg-red-400";
  };

  const getBadge = (percent) => {
    if (percent === 100)
      return { label: "Completed", style: "bg-green-100 text-green-700" };
    if (percent >= 60)
      return { label: "Good", style: "bg-blue-100 text-blue-700" };
    if (percent >= 30)
      return { label: "In Progress", style: "bg-yellow-100 text-yellow-700" };
    return { label: "Just Started", style: "bg-red-100 text-red-600" };
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading your progress...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          DSA Progress Tracker 🧠
        </h1>
        <p className="text-gray-500 mt-1">
          Track your problem solving across all topics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Solved</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-1">
            {totalSolved}
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Total Problems</p>
          <h2 className="text-3xl font-bold text-green-600 mt-1">
            {totalProblems}
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Overall Progress</p>
          <h2 className="text-3xl font-bold text-purple-600 mt-1">
            {overallProgress}%
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Topics Done</p>
          <h2 className="text-3xl font-bold text-yellow-600 mt-1">
            {dsaTopics.filter((t) => t.solved === t.total).length}/
            {dsaTopics.length}
          </h2>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Overall Progress
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {totalSolved} of {totalProblems} problems solved
        </p>
      </div>

      {/* Topic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dsaTopics.map((topic) => {
          const percent = Math.round((topic.solved / topic.total) * 100);
          const badge = getBadge(percent);

          return (
            <div key={topic.id} className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">{topic.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${badge.style}`}
                >
                  {badge.label}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getColor(percent)}`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {topic.solved} / {topic.total} solved ({percent}%)
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrement(topic.id)}
                    className="w-7 h-7 rounded-full bg-red-100 text-red-600 font-bold hover:bg-red-200 transition"
                  >
                    −
                  </button>
                  <button
                    onClick={() => increment(topic.id)}
                    className="w-7 h-7 rounded-full bg-green-100 text-green-600 font-bold hover:bg-green-200 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DsaProgress;
