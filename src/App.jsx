import { BrowserRouter, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./Routes/AppRoutes";
import { AuthProvider } from "./context/Authcontext"; 

// Separate component to access useLocation
const Layout = () => {
  const location = useLocation();

  // These pages should NOT show Navbar/Sidebar
  const authPages = ["/login", "/register"];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div>
      {!isAuthPage && <Navbar />}

      <div className="flex">
        {!isAuthPage && <Sidebar />}

        <div className={`${!isAuthPage ? "flex-1" : "w-full"} bg-gray-100 min-h-screen`}>
          <AppRoutes />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>       
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>          
  );
}

export default App;