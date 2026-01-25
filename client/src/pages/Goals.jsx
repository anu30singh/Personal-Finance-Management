import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_BASE = import.meta.env.VITE_API_BASE;

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  async function fetchGoals() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/goals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load goals");

      const data = await res.json();
      setGoals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createGoal(e) {
    e.preventDefault();
    setError("");

    if (!name || !targetAmount) {
      setError("Goal name and target amount are required");
      return;
    }

    try {
      setFormLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          targetAmount,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create goal");
      }

      setName("");
      setTargetAmount("");
      fetchGoals();
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createGoal(e);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-zinc-300 border-t-zinc-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600 font-medium">Loading your goals...</p>
        </div>
      </div>
    );
  }

  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0);
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.saved_amount), 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-zinc-50">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 border-b border-zinc-200">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="text-white">
                <p className="text-sm font-medium text-zinc-400 mb-2">
                  Financial Planning
                </p>
                <h1 className="text-4xl lg:text-5xl font-bold mb-3">
                  Savings Goals
                </h1>
                <p className="text-zinc-300 text-lg">
                  Track your progress and achieve your financial dreams
                </p>
              </div>

              {/* Overall Progress Card */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 lg:min-w-[300px]">
                <p className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
                  Overall Progress
                </p>
                <div className="flex items-baseline gap-2 mb-3">
                  <h2 className="text-4xl font-bold text-white">
                    {Math.round(overallProgress)}%
                  </h2>
                  <span className="text-sm text-zinc-300">complete</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(overallProgress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-zinc-300">
                  ₹{totalSaved.toLocaleString()} of ₹{totalTarget.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Create Goal Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 sticky top-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-bold">
                    +
                  </div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    Create New Goal
                  </h2>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Goal Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Emergency Fund, Vacation"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-zinc-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Target Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="50000"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSubmit(e);
                          }
                        }}
                        className="w-full border border-zinc-300 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={formLoading}
                    className="w-full bg-zinc-900 text-white px-5 py-3 rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                  >
                    {formLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating...
                      </span>
                    ) : (
                      "Create Goal"
                    )}
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-zinc-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600">Total Goals</span>
                    <span className="text-sm font-semibold text-zinc-900">{goals.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600">Completed</span>
                    <span className="text-sm font-semibold text-green-600">
                      {goals.filter(g => g.progress_percent >= 100).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600">In Progress</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {goals.filter(g => g.progress_percent > 0 && g.progress_percent < 100).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Goals List */}
            <div className="lg:col-span-2">
              {goals.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
                  <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                    No goals yet
                  </h3>
                  <p className="text-zinc-500 mb-6">
                    Start your savings journey by creating your first goal
                  </p>
                  <div className="inline-block bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-3">
                    <p className="text-sm text-zinc-600">
                      💡 Tip: Start with an emergency fund equal to 3-6 months of expenses
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} onUpdate={fetchGoals} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Goals;

function GoalCard({ goal, onUpdate }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showInput, setShowInput] = useState(false);

  async function allocate() {
    setError("");

    if (!amount) {
      setError("Enter amount");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:4000/goals/${goal.id}/allocate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Allocation failed");
      }

      setAmount("");
      setShowInput(false);
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const isCompleted = goal.progress_percent >= 100;
  const remaining = goal.target_amount - goal.saved_amount;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 hover:shadow-lg transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
            isCompleted ? 'bg-green-50' : 'bg-blue-50'
          }`}>
            {isCompleted ? '✓' : '🎯'}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">
              {goal.name}
            </h3>
            <p className="text-sm text-zinc-500">
              {isCompleted ? 'Goal achieved! 🎉' : `₹${remaining.toLocaleString()} remaining`}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isCompleted 
            ? 'bg-green-100 text-green-700' 
            : goal.progress_percent > 50 
            ? 'bg-blue-100 text-blue-700'
            : 'bg-zinc-100 text-zinc-700'
        }`}>
          {goal.progress_percent}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-zinc-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-green-500' : 'bg-zinc-900'
            }`}
            style={{ width: `${Math.min(goal.progress_percent, 100)}%` }}
          />
        </div>
      </div>

      {/* Amount Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-zinc-500 mb-1">Saved</p>
          <p className="text-xl font-bold text-zinc-900">
            ₹{goal.saved_amount.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-zinc-500 mb-1">Target</p>
          <p className="text-xl font-bold text-zinc-900">
            ₹{goal.target_amount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Add Money Section */}
      {!isCompleted && (
        <div className="pt-4 border-t border-zinc-200">
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="w-full bg-zinc-900 text-white px-4 py-3 rounded-xl hover:bg-zinc-800 transition-colors font-medium flex items-center justify-center gap-2 group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">+</span>
              Add Money
            </button>
          ) : (
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      allocate();
                    }
                  }}
                  className="w-full border border-zinc-300 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  autoFocus
                />
              </div>
              <button
                onClick={allocate}
                disabled={loading}
                className="bg-zinc-900 text-white px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-60 font-medium"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Add"
                )}
              </button>
              <button
                onClick={() => {
                  setShowInput(false);
                  setAmount("");
                  setError("");
                }}
                className="px-4 py-3 rounded-xl border border-zinc-300 hover:bg-zinc-50 transition-colors"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Completion Badge */}
      {isCompleted && (
        <div className="pt-4 border-t border-zinc-200">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold text-green-700">
               Congratulations! You've reached your goal!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}