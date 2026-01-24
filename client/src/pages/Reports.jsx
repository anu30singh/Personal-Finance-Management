import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_BASE = "http://localhost:4000";

function Reports() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load reports");

      const data = await res.json();
      setSummary(data.summary);
      setCategories(data.byCategory);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          Loading reports...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-red-500">
          {error}
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
    
      <div className="min-h-screen bg-zinc-100 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-2xl font-semibold">Reports</h1>

          <button
           onClick={async () => {
               const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:4000/reports/pdf", {
               headers: {
                  Authorization: `Bearer ${token}`,
             },
                });

               const blob = await res.blob();
               const url = window.URL.createObjectURL(blob);

               const a = document.createElement("a");
               a.href = url;
               a.download = "flexiwallet-report.pdf";
               document.body.appendChild(a);
               a.click();

               a.remove();
               window.URL.revokeObjectURL(url);
             }}
             className="bg-zinc-900 text-white px-5 py-2 rounded-xl text-sm hover:bg-zinc-800 transition"
           >
             Download PDF
           </button>


          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard label="Income" value={summary.income} />
            <SummaryCard label="Expense" value={summary.expense} />
            <SummaryCard
              label="Net Savings"
              value={summary.income - summary.expense}
            />
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">
              Expenses by Category
            </h2>

            {categories.length === 0 ? (
              <p className="text-zinc-500">No expense data.</p>
            ) : (
              <ul className="space-y-3">
                {categories.map((c) => (
                  <li
                    key={c.category}
                    className="flex justify-between border-b pb-2 last:border-none"
                  >
                    <span>{c.category}</span>
                    <span className="font-medium">₹{c.total}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Reports;

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="text-2xl font-semibold mt-2">₹{value}</p>
    </div>
  );
}
