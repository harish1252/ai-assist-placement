import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext"; 

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext); 

    const handleLogout = () => {
        logout(); 
        navigate("/login");
    };

    return (
        <div className="bg-blue-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">

            <h1 className="text-2xl font-bold tracking-wide">
                AI Placement Assistant
            </h1>

            <ul className="flex gap-8 font-medium">
                <li>
                    <Link to="/" className="hover:text-blue-300 transition">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/DsaProgress" className="hover:text-blue-300 transition">
                        DSA
                    </Link>
                </li>
                <li>
                    <Link to="/Interviewpreparation" className="hover:text-blue-300 transition">
                        Interview
                    </Link>
                </li>
                <li>
                    <Link to="/subject" className="hover:text-blue-300 transition">
                        Subjects
                    </Link>
                </li>
            </ul>

            <div className="flex gap-3 items-center">
                {user ? (
                    <>
                        <span className="text-sm">Hi, {user.name}</span> {/* ← shows logged-in user's name */}
                        <button
                            onClick={handleLogout}
                            className="bg-white text-blue-900 px-4 py-1 rounded font-semibold hover:bg-blue-100 transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="border border-white px-4 py-1 rounded hover:bg-white hover:text-blue-900 transition">
                                Login
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="bg-white text-blue-900 px-4 py-1 rounded font-semibold hover:bg-blue-100 transition">
                                Register
                            </button>
                        </Link>
                    </>
                )}
            </div>

        </div>
    );
};

export default Navbar;