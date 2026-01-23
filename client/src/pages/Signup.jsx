import { useState } from "react";
import { signup } from "../services/auth";
import { Link } from "react-router-dom";


function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!name || !email || !password) {
    setError("All fields are required");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  try {
    setLoading(true);

    await signup({ name, email, password });

    // success (for now)
    alert("Account created successfully. Please log in.");

    // later: redirect to login page
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-200 px-4">
      <div
        className={`w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition ${
          error ? "animate-shake" : ""
        }`}
      >
        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-zinc-900">
            Flexiwallet
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Personal finance, simplified
          </p>
        </div>

        <h2 className="text-xl font-medium text-zinc-800 text-center">
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-600 mb-1">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-600 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 text-white py-2.5 rounded-xl font-medium 
                       hover:bg-zinc-800 transition 
                       disabled:opacity-60 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="text-sm text-center text-zinc-500 mt-6">
          Already have an account?{" "}
         <Link
             to="/login"
             className="text-zinc-900 font-medium hover:underline"
        >
                 Log in
        </Link>

        </p>
      </div>
    </div>
  );
}

export default Signup;
