import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const navItems = [
        { label: " Dashboard",      path: "/" },
        { label: " AI Assistant",   path: "/AiAssistant" },
        { label: " DSA Progress",   path: "/DsaProgress" },
        { label: " Interview Prep", path: "/Interviewpreparation" },
        { label: " Subjects",       path: "/subject" },
    ];

    return (
        <div className="bg-blue-950 text-white w-64 min-h-screen px-4 py-8 flex flex-col gap-2 shadow-xl">

            <h2 className="text-xl font-bold mb-6 text-blue-300 tracking-wide">
                AI Assist
            </h2>

            <ul className="flex flex-col gap-2">
                {navItems.map((item) => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                                ${location.pathname === item.path
                                    ? "bg-blue-700 text-white font-semibold"
                                    : "hover:bg-blue-800 text-gray-200"
                                }`}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-700 transition text-red-400 cursor-pointer"
                >
                     Logout
                </button>
            </div>

        </div>
    );
};

export default Sidebar;