import { useState, useEffect } from "react";
import { getInterviewPrep, toggleQuestion } from "../services/interviewService";

const Interviewpreparation = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchPrep = async () => {
      try {
        const categories = await getInterviewPrep();
        setData(categories);
      } catch (err) {
        console.error("Failed to load interview prep:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrep();
  }, []);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const toggleDone = async (categoryId, questionId) => {
    // optimistic update
    setData((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              questions: cat.questions.map((q) =>
                q.id === questionId ? { ...q, done: !q.done } : q
              ),
            }
          : cat
      )
    );

    try {
      await toggleQuestion(categoryId, questionId);
    } catch (err) {
      console.error("Failed to update question:", err);
    }
  };

  const totalQuestions = data.reduce((acc, c) => acc + c.questions.length, 0);
  const totalDone = data.reduce(
    (acc, c) => acc + c.questions.filter((q) => q.done).length,
    0
  );
  const overallPercent = totalQuestions > 0 ? Math.round((totalDone / totalQuestions) * 100) : 0;

  const getProgress = (cat) => {
    const done = cat.questions.filter((q) => q.done).length;
    return Math.round((done / cat.questions.length) * 100);
  };

  const getBadge = (percent) => {
    if (percent === 100)
      return { label: "Completed", style: "bg-green-100 text-green-700" };
    if (percent >= 60)
      return { label: "Good", style: "bg-blue-100 text-blue-700" };
    if (percent >= 30)
      return { label: "In Progress", style: "bg-yellow-100 text-yellow-700" };
    return { label: "Not Started", style: "bg-red-100 text-red-600" };
  };

  const getBarColor = (percent) => {
    if (percent === 100) return "bg-green-500";
    if (percent >= 60) return "bg-blue-500";
    if (percent >= 30) return "bg-yellow-500";
    return "bg-red-400";
  };

  const filters = ["All", "Not Started", "In Progress", "Completed"];

  const filteredData = data.filter((cat) => {
    const percent = getProgress(cat);
    if (filter === "All") return true;
    if (filter === "Completed") return percent === 100;
    if (filter === "In Progress") return percent > 0 && percent < 100;
    if (filter === "Not Started") return percent === 0;
    return true;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading interview prep...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          Interview Preparation 🎯
        </h1>
        <p className="text-gray-500 mt-1">
          Practice commonly asked interview questions
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Questions</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-1">{totalQuestions}</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-3xl font-bold text-green-600 mt-1">{totalDone}</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Overall Progress</p>
          <h2 className="text-3xl font-bold text-purple-600 mt-1">{overallPercent}%</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Remaining</p>
          <h2 className="text-3xl font-bold text-yellow-600 mt-1">
            {totalQuestions - totalDone}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Overall Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {totalDone} of {totalQuestions} questions completed
        </p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition border
              ${
                filter === f
                  ? "bg-blue-900 text-white border-blue-900"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((cat) => {
          const percent = getProgress(cat);
          const badge = getBadge(percent);
          const isOpen = expanded === cat.id;
          const done = cat.questions.filter((q) => q.done).length;

          return (
            <div
              key={cat.id}
              className={`bg-white rounded-xl shadow p-5 border-l-4 ${cat.color}`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{cat.icon}</span>
                  <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.style}`}>
                  {badge.label}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getBarColor(percent)}`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {done} / {cat.questions.length} done ({percent}%)
                </p>
                <button
                  onClick={() => toggleExpand(cat.id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {isOpen ? "▲ Hide" : "▼ Show Questions"}
                </button>
              </div>

              {isOpen && (
                <ul className="mt-4 flex flex-col gap-2">
                  {cat.questions.map((q) => (
                    <li
                      key={q.id}
                      onClick={() => toggleDone(cat.id, q.id)}
                      className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition
                        ${
                          q.done
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-100 hover:bg-blue-50"
                        }`}
                    >
                      <span className="mt-0.5 text-lg">{q.done ? "✅" : "⬜"}</span>
                      <span className={`text-sm ${q.done ? "line-through text-gray-400" : "text-gray-700"}`}>
                        {q.question}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Interviewpreparation; 