import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import {
  Coins,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function ReferralIncome() {
  const { user } = useAuthStore();
  const { referralIncome, fetchReferralIncome, isLoading } = useDataStore();
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?._id) {
      fetchReferralIncome();
    }
  }, [user?._id]);

  const filteredIncome = referralIncome.filter((income) => {
    if (filter !== 'all') {
      const now = new Date();
      const incomeDate = new Date(income.date);
      if (filter === 'today') {
        return incomeDate.toDateString() === now.toDateString();
      }
      if (filter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return incomeDate >= weekAgo;
      }
      if (filter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return incomeDate >= monthAgo;
      }
    }
    return true;
  });

  const totalPages = Math.ceil(filteredIncome.length / itemsPerPage);
  const paginatedIncome = filteredIncome.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const totalIncome = filteredIncome.reduce((sum, income) => sum + Number(income.income_amount), 0);

  // Calculate income by level for chart
  const incomeByLevel = referralIncome.reduce((acc, income) => {
    acc[income.level] = (acc[income.level] || 0) + Number(income.income_amount);
    return acc;
  }, {} as Record<number, number>);

  const chartData = Object.entries(incomeByLevel)
    .map(([level, amount]) => ({
      level: `Level ${level}`,
      amount,
    }))
    .slice(0, 10);

  const COLORS = ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16'];

  const handleExport = () => {
    const csv = [
      ['Date', 'Level', 'Income Amount', 'Source Amount', 'Percentage'].join(','),
      ...filteredIncome.map((income) =>
        [income.date, income.level, income.income_amount, income.source_amount, income.percentage].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referral-income-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Level Income</h1>
          <p className="text-slate-500 mt-1">Track your referral earnings from all levels</p>
        </div>
        <button
          onClick={handleExport}
          disabled={filteredIncome.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="w-6 h-6" />
            <span className="text-amber-100">Total Level Income</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-blue-500" />
            <span className="text-slate-500">Total Records</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{filteredIncome.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-6 h-6 text-violet-500" />
            <span className="text-slate-500">Active Levels</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {Object.keys(incomeByLevel).length}
          </p>
        </div>
      </div>

      {/* Level Distribution Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Income by Level</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="level" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => [formatCurrency(value as number), 'Income']}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'today', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => {
                  setFilter(period);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === period
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Source ROI
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Income
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedIncome.length > 0 ? (
                paginatedIncome.map((income) => (
                  <tr key={income.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-slate-800 font-medium">{formatDate(income.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: COLORS[(income.level - 1) % COLORS.length] }}
                        >
                          {income.level}
                        </span>
                        <span className="text-slate-800 font-medium">Level {income.level}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{formatCurrency(income.source_amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{income.percentage}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-amber-600 font-semibold text-lg">
                        +{formatCurrency(income.income_amount)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Coins className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No level income records found</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Refer users to start earning level income
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredIncome.length)} of {filteredIncome.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-amber-500 text-white'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
