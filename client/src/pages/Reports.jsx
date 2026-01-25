import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_BASE = import.meta.env.VITE_API_BASE;

function Reports() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingPDF, setDownloadingPDF] = useState(false);

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

  async function handleDownloadPDF() {
    try {
      setDownloadingPDF(true);
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
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setDownloadingPDF(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-zinc-300 border-t-zinc-700 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-600 font-medium">Loading reports...</p>
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

  const netSavings = summary.income - summary.expense;
  const savingsRate = summary.income > 0 ? ((netSavings / summary.income) * 100).toFixed(1) : 0;

  // Find top spending category
  const topCategory = categories.length > 0 
    ? categories.reduce((max, cat) => cat.total > max.total ? cat : max, categories[0])
    : null;

  // Calculate percentage for each category
  const totalExpense = categories.reduce((sum, cat) => sum + Number(cat.total), 0);
  const categoriesWithPercent = categories.map(cat => ({
    ...cat,
    percentage: totalExpense > 0 ? ((cat.total / totalExpense) * 100).toFixed(1) : 0
  }));

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
                  Financial Analysis
                </p>
                <h1 className="text-4xl lg:text-5xl font-bold mb-3">
                  Reports & Insights
                </h1>
                <p className="text-zinc-300 text-lg">
                  Comprehensive overview of your financial activity
                </p>
              </div>

              {/* Export Button */}
              <button
                onClick={handleDownloadPDF}
                disabled={downloadingPDF}
                className="bg-white text-zinc-900 px-6 py-3 rounded-xl font-semibold hover:bg-zinc-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
              >
                {downloadingPDF ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SummaryCard 
              label="Total Income" 
              value={summary.income}
              trend="positive"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              }
            />
            <SummaryCard 
              label="Total Expenses" 
              value={summary.expense}
              trend="negative"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              }
            />
            <SummaryCard 
              label="Net Savings" 
              value={netSavings}
              trend={netSavings >= 0 ? "positive" : "negative"}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <SummaryCard 
              label="Savings Rate" 
              value={`${savingsRate}%`}
              isPercentage
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Breakdown - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 overflow-hidden">
              <div className="bg-zinc-900 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  Expenses by Category
                </h2>
              </div>

              <div className="p-6">
                {categoriesWithPercent.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-zinc-500 font-medium">No expense data available</p>
                    <p className="text-sm text-zinc-400 mt-1">Start adding transactions to see your spending breakdown</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {categoriesWithPercent.map((c) => (
                      <div key={c.category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold text-zinc-600">
                                {c.category.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-zinc-900">{c.category}</p>
                              <p className="text-xs text-zinc-500">{c.percentage}% of total</p>
                            </div>
                          </div>
                          <span className="text-lg font-semibold text-zinc-900">₹{c.total.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                            style={{ width: `${c.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Insights Panel */}
            <div className="space-y-6">

              {/* Financial Health Score */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-700 rounded-2xl p-6 text-white">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Financial Health
                </p>
                <div className="flex items-end gap-2 mb-4">
                  <h3 className="text-4xl font-semibold">
                    {Math.max(0, Math.min(100, Math.round(savingsRate)))}
                  </h3>
                  <span className="text-lg font-semibold text-zinc-400 mb-1">/100</span>
                </div>
                <p className="text-sm text-zinc-300">
                  {savingsRate >= 20 
                    ? "Excellent savings rate!" 
                    : savingsRate >= 10 
                    ? "Good progress, keep it up" 
                    : "Try to save more each month"}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600">Categories</span>
                    <span className="text-sm font-semibold text-zinc-900">{categories.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600">Avg per category</span>
                    <span className="text-sm font-semibold text-zinc-900">
                      ₹{categories.length > 0 ? Math.round(totalExpense / categories.length).toLocaleString() : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600">Income/Expense</span>
                    <span className="text-sm font-semibold text-zinc-900">
                      {summary.expense > 0 ? (summary.income / summary.expense).toFixed(2) : '0'}x
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reports;

function SummaryCard({ label, value, trend, icon, isPercentage = false }) {
  const trendConfig = {
    positive: {
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-100"
    },
    negative: {
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-100"
    },
    neutral: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100"
    }
  };

  const config = trendConfig[trend] || trendConfig.neutral;

  return (
    <div className={`${config.bg} rounded-2xl p-6 border ${config.border} hover:shadow-md transition-all duration-300`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-zinc-600 uppercase tracking-wide">
          {label}
        </p>
        <div className={`${config.text}`}>
          {icon}
        </div>
      </div>
      <h3 className={`text-3xl font-semibold ${config.text} tracking-tight`}>
        {isPercentage ? value : `₹${typeof value === 'number' ? value.toLocaleString() : value}`}
      </h3>
    </div>
  );
}