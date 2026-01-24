import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_BASE = "http://localhost:4000";

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading goals...
      </div>
    );
  }

  return (
    <>
        <Navbar />
   
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold">Savings Goals</h1>

        {/* Create Goal */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Create New Goal</h2>

          {error && (
            <p className="text-sm text-red-500 mb-3">{error}</p>
          )}

          <form onSubmit={createGoal} className="space-y-4">
            <input
              type="text"
              placeholder="Goal name (e.g. Emergency Fund)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl px-4 py-2"
            />

            <input
              type="number"
              placeholder="Target amount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full border rounded-xl px-4 py-2"
            />

            <button
              type="submit"
              disabled={formLoading}
              className="bg-zinc-900 text-white px-5 py-2 rounded-xl hover:bg-zinc-800 transition disabled:opacity-60"
            >
              {formLoading ? "Creating..." : "Create Goal"}
            </button>
          </form>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.length === 0 ? (
            <p className="text-zinc-500">No savings goals yet.</p>
          ) : (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdate={fetchGoals}
              />
            ))
          )}
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
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
 
    
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{goal.name}</h3>
        <span className="text-sm text-zinc-500">
          {goal.progress_percent}%
        </span>
      </div>

      <div className="w-full bg-zinc-200 rounded-full h-2">
        <div
          className="bg-zinc-900 h-2 rounded-full"
          style={{ width: `${goal.progress_percent}%` }}
        />
      </div>

      <p className="text-sm text-zinc-600">
        ₹{goal.saved_amount} / ₹{goal.target_amount}
      </p>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="flex gap-3">
        <input
          type="number"
          placeholder="Add amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-2"
        />

        <button
          onClick={allocate}
          disabled={loading}
          className="bg-zinc-900 text-white px-4 py-2 rounded-xl hover:bg-zinc-800 transition disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </div>

  );
}
