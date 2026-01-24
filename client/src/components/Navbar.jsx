import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
   <nav className="bg-white/80 backdrop-blur border-b sticky top-0 z-50">

      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand */}
        <h1 className="text-lg font-semibold text-zinc-900">
          Flexiwallet
        </h1>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/goals"
            className={({ isActive }) =>
              isActive
                ? "text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900"
            }
          >
            Goals
          </NavLink>

         
          <NavLink
             to="/reports"
             className={({ isActive }) =>
               isActive
                 ? "text-zinc-900"
                 : "text-zinc-500 hover:text-zinc-900"
             }
           >
             Reports
           </NavLink>

            <button
            onClick={handleLogout}
            className="text-zinc-500 hover:text-red-600 transition"
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
