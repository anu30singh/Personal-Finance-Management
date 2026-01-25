import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_BASE = import.meta.env.VITE_API_BASE;

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  // Form state
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
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

  function openAddModal() {
    setEditingTx(null);
    setType("expense");
    setAmount("");
    setCategory("");
    setDescription("");
    setShowForm(true);
  }

  function openEditModal(tx) {
    setEditingTx(tx);
    setType(tx.type);
    setAmount(tx.amount);
    setCategory(tx.category || "");
    setDescription(tx.description || "");
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
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
        throw new Error(data.message || "Failed to save transaction");
      }

      await loadTransactions();
      setShowForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  function exportCSV() {
    const headers = ["Date", "Type", "Category", "Description", "Amount"];
    const rows = transactions.map((tx) => [
      new Date(tx.created_at).toLocaleDateString(),
      tx.type,
      tx.category || "",
      tx.description || "",
      tx.amount,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  }

  const filtered = transactions.filter((tx) => {
    if (filterType !== "all" && tx.type !== filterType) return false;
    if (filterCategory !== "all" && tx.category !== filterCategory) return false;
    return true;
  });

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-900">
                Transactions
              </h1>
              <p className="text-sm text-zinc-500">
                View, add and edit your transactions
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={exportCSV}
                className="border px-4 py-2 rounded-lg text-sm hover:bg-zinc-100"
              >
                Export CSV
              </button>
              <button
                onClick={openAddModal}
                className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-zinc-800"
              >
                + Add Transaction
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className=" rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm"
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
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <p className="text-center py-10 text-zinc-500">
                No transactions found
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-zinc-100 text-zinc-600">
                  <tr>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Description</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-right p-4">Amount</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-t hover:bg-zinc-50"
                    >
                      <td className="p-4">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {tx.description || "—"}
                      </td>
                      <td className="p-4">
                        {tx.category || "—"}
                      </td>
                      <td className="p-4 capitalize">
                        {tx.type}
                      </td>
                      <td
                        className={`p-4 text-right font-medium ${
                          tx.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}₹
                        {Number(tx.amount).toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => openEditModal(tx)}
                          className="text-zinc-500 hover:text-zinc-900"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingTx ? "Edit Transaction" : "Add Transaction"}
            </h3>

            {formError && (
              <p className="text-sm text-red-500 mb-3">{formError}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`flex-1 py-2 rounded ${
                    type === "expense"
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`flex-1 py-2 rounded ${
                    type === "income"
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100"
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
                className="w-full border rounded px-4 py-2"
              />

              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded px-4 py-2"
              />

              <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded px-4 py-2"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-zinc-900 text-white py-2 rounded"
                >
                  {formLoading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Transactions;
