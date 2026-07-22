import { useState, useEffect } from "react";
import { getSubjects, updateSubjectProgress } from "../services/subjectService";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (err) {
        console.error("Failed to load subjects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const totalProgress = subjects.length > 0
    ? Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length)
    : 0;

  const getColor = (progress) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-400";
  };

  const getBadge = (progress) => {
    if (progress >= 75) return { label: "Strong", style: "bg-green-100 text-green-700" };
    if (progress >= 50) return { label: "Good", style: "bg-blue-100 text-blue-700" };
    if (progress >= 25) return { label: "In Progress", style: "bg-yellow-100 text-yellow-700" };
    return { label: "Just Started", style: "bg-red-100 text-red-600" };
  };

  const updateProgress = async (id, value) => {
    // optimistic update
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, progress: Math.min(100, Math.max(0, s.progress + value)) }
          : s
      )
    );

    try {
      await updateSubjectProgress(id, value);
    } catch (err) {
      console.error("Failed to update subject progress:", err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading subjects...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Subjects 📚</h1>
        <p className="text-gray-500 mt-1">Track your core subject preparation</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Subjects</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-1">{subjects.length}</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-3xl font-bold text-green-600 mt-1">
            {subjects.filter((s) => s.progress === 100).length}
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Overall Progress</p>
          <h2 className="text-3xl font-bold text-purple-600 mt-1">{totalProgress}%</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">In Progress</p>
          <h2 className="text-3xl font-bold text-yellow-600 mt-1">
            {subjects.filter((s) => s.progress > 0 && s.progress < 100).length}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Overall Subject Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${totalProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{totalProgress}% average across all subjects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subject) => {
          const badge = getBadge(subject.progress);
          const isOpen = expanded === subject.id;

          return (
            <div
              key={subject.id}
              className={`bg-white rounded-xl shadow p-5 border-l-4 ${subject.color}`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{subject.icon}</span>
                  <h3 className="font-semibold text-gray-800">{subject.name}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.style}`}>
                  {badge.label}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getColor(subject.progress)}`}
                  style={{ width: `${subject.progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-500">{subject.progress}% completed</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateProgress(subject.id, -10)}
                    className="w-7 h-7 rounded-full bg-red-100 text-red-600 font-bold hover:bg-red-200 transition"
                  >
                    −
                  </button>
                  <button
                    onClick={() => updateProgress(subject.id, 10)}
                    className="w-7 h-7 rounded-full bg-green-100 text-green-600 font-bold hover:bg-green-200 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => toggleExpand(subject.id)}
                className="text-sm text-blue-600 hover:underline"
              >
                {isOpen ? "▲ Hide Topics" : "▼ Show Topics"}
              </button>

              {isOpen && (
                <ul className="mt-3 flex flex-col gap-1">
                  {subject.topics.map((topic, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"
                    >
                       {topic}
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

export default Subjects; 