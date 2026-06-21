import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import {
  History,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function RoiHistory() {
  const { user } = useAuthStore();
  const { roiHistory, fetchROIHistory, isLoading } = useDataStore();
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?._id) {
      fetchROIHistory();
    }
  }, [user?._id]);

  const filteredHistory = roiHistory.filter((roi) => {
    if (filter !== 'all') {
      const now = new Date();
      const roiDate = new Date(roi.date);
      if (filter === 'today') {
        return roiDate.toDateString() === now.toDateString();
      }
      if (filter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return roiDate >= weekAgo;
      }
      if (filter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return roiDate >= monthAgo;
      }
    }
    if (dateRange.start && dateRange.end) {
      const roiDate = new Date(roi.date);
      return roiDate >= new Date(dateRange.start) && roiDate <= new Date(dateRange.end);
    }
    return true;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const totalRoi = filteredHistory.reduce((sum, roi) => sum + Number(roi.roi_amount), 0);

  const handleExport = () => {
    const csv = [
      ['Date', 'Investment', 'ROI Amount', 'Status'].join(','),
      ...filteredHistory.map((roi) =>
        [roi.date, roi.investment?.plan?.name || 'Unknown', roi.roi_amount, roi.status].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roi-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">ROI History</h1>
          <p className="text-slate-500 mt-1">Track your daily return on investment earnings</p>
        </div>
        <button
          onClick={handleExport}
          disabled={filteredHistory.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6" />
            <span className="text-emerald-100">Total ROI</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalRoi)}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            <span className="text-slate-500">Total Records</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{filteredHistory.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <ArrowUpRight className="w-6 h-6 text-amber-500" />
            <span className="text-slate-500">Daily Average</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {filteredHistory.length > 0 ? formatCurrency(totalRoi / filteredHistory.length) : '$0.00'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
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
                  setDateRange({ start: '', end: '' });
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === period
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 lg:ml-auto">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => {
                setDateRange({ ...dateRange, start: e.target.value });
                setFilter('all');
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Start date"
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => {
                setDateRange({ ...dateRange, end: e.target.value });
                setFilter('all');
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="End date"
            />
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
                  Investment
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Daily ROI
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedHistory.length > 0 ? (
                paginatedHistory.map((roi) => (
                  <tr key={roi.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="text-slate-800 font-medium">{formatDate(roi.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800 font-medium">{roi.investment?.plan?.name || 'Unknown Plan'}</div>
                      <div className="text-sm text-slate-500">
                        Amount: {roi.investment ? formatCurrency(roi.investment.amount) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-600 font-semibold text-lg">
                        +{formatCurrency(roi.roi_amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        {roi.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No ROI records found</p>
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
              {Math.min(currentPage * itemsPerPage, filteredHistory.length)} of {filteredHistory.length} results
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
                        ? 'bg-emerald-500 text-white'
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
