import { NavLink, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";


function Navbar() {
  const [user, setUser] = useState(null);

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
   <nav className="bg-white/80 backdrop-blur sticky top-0 z-50">

      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        
        <Link
  to="/"
  className="flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900 hover:opacity-80 transition"
>
  <img
    src={logo}
    alt="Flexiwallet logo"
    className="h-6 w-6"
  />
  <span>Flexiwallet</span>
</Link>

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
    to="/transactions"
    className={({ isActive }) =>
      isActive
        ? "text-zinc-900"
        : "text-zinc-500 hover:text-zinc-900"
    }
  >
    Transactions
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



  {/* User Section */}
  {user && (
    <div className="flex items-center gap-3 pl-4 border-l">
      <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">
        {user.name?.charAt(0).toUpperCase()}
      </div>

      <span className="text-zinc-700">
        {user.name}
      </span>
    </div>
  )}

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
