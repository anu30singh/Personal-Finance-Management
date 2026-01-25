import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { Pencil, Trash2, X, Download, Plus, Filter } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Modal
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  // Form
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  /* -------------------- API -------------------- */

  async function fetchTransactions() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load transactions");

      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  /* -------------------- CRUD -------------------- */

  function openAddModal() {
    setEditingTx(null);
    setType("expense");
    setAmount("");
    setCategory("");
    setDescription("");
    setFormError("");
    setShowForm(true);
  }

  function openEditModal(tx) {
    setEditingTx(tx);
    setType(tx.type);
    setAmount(tx.amount);
    setCategory(tx.category || "");
    setDescription(tx.description || "");
    setFormError("");
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setFormError("");

    if (!amount) {
      setFormError("Amount is required");
      return;
    }

    try {
      setFormLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        editingTx
          ? `${API_BASE}/transactions/${editingTx.id}`
          : `${API_BASE}/transactions`,
        {
          method: editingTx ? "PUT" : "POST",
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
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Save failed");
      }

      await fetchTransactions();
      setShowForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  /* -------------------- CSV -------------------- */

  function exportCSV() {
    const headers = ["Date", "Type", "Category", "Description", "Amount"];
    const rows = transactions.map((tx) => [
      new Date(tx.created_at).toLocaleDateString(),
      tx.type,
      tx.category || "",
      tx.description || "",
      tx.amount,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  /* -------------------- FILTERED DATA -------------------- */

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (filterType !== "all" && tx.type !== filterType) return false;
      if (filterCategory !== "all" && tx.category !== filterCategory)
        return false;
      return true;
    });
  }, [transactions, filterType, filterCategory]);

  const totalIncome = useMemo(() => 
    filteredTransactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + Number(tx.amount), 0)
  , [filteredTransactions]);

  const totalExpense = useMemo(() => 
    filteredTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Number(tx.amount), 0)
  , [filteredTransactions]);

  /* -------------------- UI -------------------- */

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-zinc-300 border-t-zinc-700 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-600 font-medium">Loading transactions...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        </div>
      </>
    );
  }

  const activeFilters = (filterType !== 'all' || filterCategory !== 'all');

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-zinc-50">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="text-white">
                <p className="text-sm font-medium text-zinc-400 mb-2">
                  Transaction Management
                </p>
                <h1 className="text-4xl lg:text-5xl font-semibold mb-3">
                  All Transactions
                </h1>
                <p className="text-zinc-300 text-lg">
                  Track and manage your financial activity
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={exportCSV}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-3 rounded-xl font-medium hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <Download size={18} />
                  Export CSV
                </button>
                <button
                  onClick={openAddModal}
                  className="bg-white text-zinc-900 px-6 py-3 rounded-xl font-semibold hover:bg-zinc-100 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus size={18} />
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-zinc-200">
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-2">
                Total Transactions
              </p>
              <h3 className="text-3xl font-semibold text-zinc-900">
                {filteredTransactions.length}
              </h3>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <p className="text-sm font-medium text-green-700 uppercase tracking-wide mb-2">
                Total Income
              </p>
              <h3 className="text-3xl font-semibold text-green-600">
                ₹{totalIncome.toLocaleString()}
              </h3>
            </div>
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <p className="text-sm font-medium text-red-700 uppercase tracking-wide mb-2">
                Total Expenses
              </p>
              <h3 className="text-3xl font-semibold text-red-600">
                ₹{totalExpense.toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Filter size={20} className="text-zinc-600" />
                <span className="font-medium text-zinc-900">Filters</span>
                {activeFilters && (
                  <span className="bg-zinc-900 text-white text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-zinc-400 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showFilters && (
              <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Transaction Type
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full border border-zinc-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="income">Income Only</option>
                      <option value="expense">Expenses Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full border border-zinc-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      {[...new Set(transactions.map((t) => t.category))]
                        .filter(Boolean)
                        .map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                  </div>
                </div>

                {activeFilters && (
                  <button
                    onClick={() => {
                      setFilterType('all');
                      setFilterCategory('all');
                    }}
                    className="mt-4 text-sm text-zinc-600 hover:text-zinc-900 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                  No transactions found
                </h3>
                <p className="text-zinc-500 mb-6">
                  {activeFilters ? 'Try adjusting your filters' : 'Get started by adding your first transaction'}
                </p>
                {!activeFilters && (
                  <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-zinc-800 transition-colors"
                  >
                    <Plus size={18} />
                    Add Transaction
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                          {new Date(tx.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700">
                            {tx.category || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-600 max-w-xs truncate">
                          {tx.description || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            tx.type === "income"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {tx.type === "income" ? "Income" : "Expense"}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${
                          tx.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}>
                          {tx.type === "income" ? "+" : "-"}₹{Number(tx.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(tx)}
                              className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                              title="Edit transaction"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(tx.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete transaction"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h3 className="text-xl font-bold text-zinc-900">
                {editingTx ? "Edit Transaction" : "Add Transaction"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{formError}</p>
                </div>
              )}

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType("expense")}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      type === "expense"
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("income")}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      type === "income"
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-zinc-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g., Food, Salary, Shopping"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-zinc-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Add notes about this transaction"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-zinc-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-zinc-200">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 border border-zinc-300 rounded-xl font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={formLoading}
                className="flex-1 px-4 py-3 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {formLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  editingTx ? "Update" : "Add Transaction"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Transactions;