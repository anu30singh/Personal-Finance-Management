import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_BASE = "http://localhost:4000";

function Dashboard() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [goals, setGoals] = useState([]);
  const [insights, setInsights] = useState([]);

  //filter
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterRange, setFilterRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");


  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const token = localStorage.getItem("token");

      const insightsRes = await fetch(`${API_BASE}/ai/insights`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const insightsData = await insightsRes.json();
      setInsights(insightsData.insights);

      if (!token) {
        throw new Error("Not authenticated");
      }

      const goalsRes = await fetch(`${API_BASE}/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const goalsData = await goalsRes.json();
      setGoals(goalsData);

      const res = await fetch(`${API_BASE}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load dashboard");
      }

      const data = await res.json();
      setWallet(data.wallet);
      setTransactions(data.recentTransactions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  const totalSaved = goals.reduce((sum, g) => sum + Number(g.saved_amount), 0);

  const totalExpense = transactions
  .filter((tx) => tx.type === "expense")
  .reduce((sum, tx) => sum + Number(tx.amount), 0);

const totalIncome = transactions
  .filter((tx) => tx.type === "income")
  .reduce((sum, tx) => sum + Number(tx.amount), 0);

const filteredTransactions = transactions
  .filter((tx) => {
    if (filterType !== "all" && tx.type !== filterType) {
      return false;
    }

    if (filterCategory !== "all" && tx.category !== filterCategory) {
      return false;
    }

    if (filterRange !== "all") {
      const txDate = new Date(tx.created_at);
      const now = new Date();

      if (filterRange === "7") {
        return now - txDate <= 7 * 24 * 60 * 60 * 1000;
      }

      if (filterRange === "30") {
        return now - txDate <= 30 * 24 * 60 * 60 * 1000;
      }
    }

    return true;
  })
  .sort((a, b) =>
    sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount
  );



  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          
          <div className="mb-2">
            <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
          </div>

          {/* Main Balance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Wallet */}
  <div className="bg-white rounded-2xl p-6 shadow-sm card-hover">
    <p className="text-sm text-zinc-500">Wallet Balance</p>
    <h2 className="text-3xl font-semibold mt-2 tracking-tight">
      ₹{wallet?.balance ?? "0.00"}
    </h2>
  </div>

  {/* Income */}
  <div className="bg-white rounded-2xl p-6 shadow-sm card-hover">
    <p className="text-sm text-zinc-500">Total Income</p>
    <h2 className="text-3xl font-semibold mt-2 tracking-tight text-green-600">
      ₹{totalIncome}
    </h2>
  </div>

  {/* Expense */}
  <div className="bg-white rounded-2xl p-6 shadow-sm card-hover">
    <p className="text-sm text-zinc-500">Total Expense</p>
    <h2 className="text-3xl font-semibold mt-2 tracking-tight text-red-600">
      ₹{totalExpense}
    </h2>
  </div>
</div>


          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-6 border border-zinc-200">
              <p className="text-zinc-500 text-sm mb-2">Savings Goals</p>
              <p className="text-2xl font-bold text-zinc-900">{goals.length}</p>
              <p className="text-sm text-zinc-600 mt-1">₹{totalSaved.toLocaleString()} saved</p>
               <Link to="/goals" className="text-sm text-zinc-600 hover:text-zinc-900 mt-1 inline-block">
                View all →
              </Link>
            </div>
          </div>

          {/* AI Insights */}
          {insights.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-zinc-200">
              <h3 className="font-bold text-zinc-900 mb-4">Insights</h3>
              <div className="space-y-3">
                {insights.map((insight, i) => (
                  <p key={i} className="text-zinc-700 text-sm leading-relaxed">
                    • {insight}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Add Transaction Button */}
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800"
          >
            + Add Transaction
          </button>

          {/* Transaction Form */}
          {showForm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">New Transaction</h3>

                {formError && (
                  <p className="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded">{formError}</p>
                )}

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setFormError("");

                    if (!amount) {
                      setFormError("Amount is required");
                      return;
                    }

                    try {
                      setFormLoading(true);
                      const token = localStorage.getItem("token");

                      const res = await fetch("http://localhost:4000/transactions", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          type,
                          amount,
                          category,
                          description,
                        }),
                      });

                      if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data.message || "Failed to add transaction");
                      }

                      await loadDashboard();
                      setAmount("");
                      setCategory("");
                      setDescription("");
                      setShowForm(false);
                    } catch (err) {
                      setFormError(err.message);
                    } finally {
                      setFormLoading(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setType("expense")}
                      className={`flex-1 py-2 rounded font-medium ${
                        type === "expense"
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("income")}
                      className={`flex-1 py-2 rounded font-medium ${
                        type === "income"
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      Income
                    </button>
                  </div>

                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-zinc-300 rounded px-4 py-2 focus:outline-none focus:border-zinc-900"
                  />

                  <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-zinc-300 rounded px-4 py-2 focus:outline-none focus:border-zinc-900"
                  />

                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-zinc-300 rounded px-4 py-2 focus:outline-none focus:border-zinc-900"
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="flex-1 bg-zinc-900 text-white py-2 rounded font-medium hover:bg-zinc-800 disabled:opacity-50"
                    >
                      {formLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 rounded border border-zinc-300 font-medium hover:bg-zinc-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
    <div className="bg-white rounded-2xl shadow-sm flex flex-wrap gap-5 items-center p-4 mb-4">
       <p className="text-zinc-700 font-medium">Filter your transactions</p>
      <select
       value={filterType}
       onChange={(e) => setFilterType(e.target.value)}
       className=" rounded-xl  px-3 py-2 text-sm"
     >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

           <select
             value={filterCategory}
             onChange={(e) => setFilterCategory(e.target.value)}
             className=" rounded-xl px-3 py-2 text-sm"
           >
             <option value="all">All Categories</option>
             {[...new Set(transactions.map((t) => t.category))]
               .filter(Boolean)
               .map((cat) => (
                 <option key={cat} value={cat}>
                   {cat}
                 </option>
               ))}
           </select>

           <select
             value={filterRange}
             onChange={(e) => setFilterRange(e.target.value)}
             className=" rounded-xl px-3 py-2 text-sm"
           >
             <option value="all">All Time</option>
             <option value="7">Last 7 days</option>
             <option value="30">Last 30 days</option>
           </select>
          </div>
         

        </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg p-6 border border-zinc-200">
            <h3 className="font-bold text-zinc-900 mb-4">Recent Transactions</h3>

           {filteredTransactions.length === 0 ? (
           <p className="text-zinc-500 text-center py-8">No transactions match filters</p>
           ) : (
           <div className="space-y-3">
            {filteredTransactions.map((tx, index) => (
                 <div
                    key={index}
                     className="flex justify-between items-center py-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">
                        {tx.description || "Transaction"}
                      </p>
                      <p className="text-sm text-zinc-500">{tx.category || "General"}</p>
                    </div>
                    <span
                      className={`font-bold ${
                        tx.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}₹{Number(tx.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
    
      </div>
    </>
  );
}

export default Dashboard;