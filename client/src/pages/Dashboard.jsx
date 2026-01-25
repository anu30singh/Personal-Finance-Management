import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";


function StatCard({ label, value, trend, trendValue }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-zinc-200 hover:border-zinc-300 transition-all duration-300">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-semibold text-zinc-900">₹{value}</h3>
        {trend && (
          <span className={`text-xs font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}

function QuickAction({ icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-4 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 group"
    >
      <div className="w-10 h-10 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-lg font-semibold">
        {icon}
      </div>
      <span className="text-sm font-medium text-zinc-900 group-hover:text-zinc-700">
        {label}
      </span>
      <span className="ml-auto text-zinc-400 group-hover:text-zinc-600 group-hover:translate-x-1 transition-transform">
        →
      </span>
    </Link>
  );
}

const API_BASE = import.meta.env.VITE_API_BASE;

function Dashboard() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [goals, setGoals] = useState([]);
  const [insights, setInsights] = useState([]);
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
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-zinc-300 border-t-zinc-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
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

  const netBalance = totalIncome - totalExpense;

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

  const user = JSON.parse(localStorage.getItem("user"));
  
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-zinc-50">
        {/* HERO BANNER */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Left: Welcome */}
              <div className="text-white">
                <p className="text-sm font-medium text-zinc-400 mb-2">
                  Dashboard Overview
                </p>
                <h1 className="text-4xl lg:text-5xl font-semibold mb-3">
                  Welcome back, {user?.name}
                </h1>
                <p className="text-zinc-300 text-lg">
                  Track your finances and reach your goals
                </p>
              </div>

              {/* Right: Balance Card */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 lg:min-w-[320px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                    Total Balance
                  </p>
                </div>
                <h2 className="text-5xl font-semibold text-white mb-4">
                  ₹{wallet?.balance ?? "0.00"}
                </h2>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-white/60 mb-1">Income</p>
                    <p className="text-lg font-semibold text-green-400">
                      +₹{totalIncome.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">Expenses</p>
                    <p className="text-lg font-semibold text-red-400">
                      -₹{totalExpense.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* TWO COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  label="Net Flow"
                  value={netBalance.toLocaleString()}
                  trend={netBalance >= 0 ? 'up' : 'down'}
                  trendValue={Math.abs(netBalance).toLocaleString()}
                />
                <StatCard
                  label="Savings"
                  value={totalSaved.toLocaleString()}
                />
                <StatCard
                  label="Goals"
                  value={goals.length.toString()}
                />
              </div>

              {/* AI Insights Panel */}
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                <div className="bg-zinc-900 px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-zinc-900">AI</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Smart Insights
                  </h3>
                </div>

                <div className="p-6">
                  {insights.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📊</span>
                      </div>
                      <p className="text-zinc-500 font-medium mb-2">
                        No insights available yet
                      </p>
                      <p className="text-sm text-zinc-400">
                        Add transactions to unlock AI-powered insights
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {insights.map((insight, i) => (
                        <div
                          key={i}
                          className="flex gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200 hover:bg-zinc-100 transition-colors duration-200"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-zinc-900 text-white rounded-md flex items-center justify-center text-xs font-semibold mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-zinc-700 leading-relaxed flex-1">
                            {insight}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-zinc-900">
                    Recent Transactions
                  </h3>
                  <Link
                    to="/transactions"
                    className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    View all →
                  </Link>
                </div>

                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-zinc-500">No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((tx, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            tx.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {tx.type === 'income' ? '↓' : '↑'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-900">
                              {tx.category || 'Transaction'}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`text-sm font-semibold ${
                          tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN - Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <QuickAction icon="+" label="Add Transaction" to="/transactions" />
                  <QuickAction icon="🎯" label="Manage Goals" to="/goals" />
                </div>
              </div>

              {/* Savings Goals Progress */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide">
                    Savings Goals
                  </h3>
                  <Link
                    to="/goals"
                    className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
                  >
                    View all
                  </Link>
                </div>

                {goals.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <p className="text-sm text-zinc-500 mb-3">No goals yet</p>
                    <Link
                      to="/goals"
                      className="inline-block text-xs font-medium text-zinc-900 bg-zinc-100 px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                      Create your first goal
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {goals.slice(0, 3).map((goal, i) => {
                      const progress = (goal.saved_amount / goal.target_amount) * 100;
                      return (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-zinc-900">
                              {goal.name}
                            </p>
                            <span className="text-xs font-semibold text-zinc-600">
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-zinc-500">
                            ₹{goal.saved_amount.toLocaleString()} of ₹{goal.target_amount.toLocaleString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;