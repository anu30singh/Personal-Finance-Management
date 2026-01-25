import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import financeGif from "../assets/gif.gif";


const API_BASE = import.meta.env.VITE_API_BASE;

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


const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          
         <div className="mb-4">
           <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
             {user?.name}’s Dashboard
           </h1>
           <p className="text-sm text-zinc-500 mt-1">
              Here’s a quick look at your finances today
           </p>
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
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-center">
                <img
                  src={financeGif}
                  alt="Financial insights"
                  className="max-h-40 object-contain"
                />
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

        </div>
    
      </div>
    </>
  );
}

export default Dashboard;