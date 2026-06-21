import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import {
  Wallet as WalletIcon,
  TrendingUp,
  Coins,
  History,
  DollarSign,
} from 'lucide-react';

export default function Wallet() {
  const { user } = useAuthStore();
 const {
  dashboard,
  roiHistory,
  referralIncome,
  fetchDashboard,
  fetchROIHistory,
  fetchReferralIncome,
  fetchInvestments,
  investments
} = useDataStore();
 
 useEffect(() => {
  if (user?._id) {
    fetchDashboard();
    fetchROIHistory();
    fetchReferralIncome();
    fetchInvestments();
  }
}, [user?._id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Combine and sort transactions
  const allTransactions = [
    ...roiHistory.map((r) => ({
      id: r.id,
      type: 'roi',
      amount: r.roi_amount,
      date: r.date,
      description: `ROI from ${r.investment?.plan?.name || 'Investment'}`,
    })),
    ...referralIncome.map((r) => ({
      id: r.id,
      type: 'level',
      amount: r.income_amount,
      date: r.date,
      description: `Level ${r.level} Income`,
    })),
    ...investments.map((inv) => ({
      id: inv.id,
      type: 'investment',
      amount: -Number(inv.amount),
      date: inv.created_at.split('T')[0],
      description: `Investment in ${inv.plan?.name || 'Plan'}`,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Wallet</h1>
        <p className="text-slate-500 mt-1">Your earnings and transaction history</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

        <div className="relative">
          <p className="text-slate-400 text-sm font-medium mb-2">Available Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl lg:text-6xl font-bold">
              {formatCurrency(dashboard?.walletBalance || 0)}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Total ROI Earned</p>
              <p className="text-xl font-bold text-emerald-400">
                {formatCurrency(dashboard?.totalROIEarned || 0)}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Level Income</p>
              <p className="text-xl font-bold text-amber-400">
                {formatCurrency(dashboard?.totalLevelIncome || 0)}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Total Invested</p>
              <p className="text-xl font-bold text-blue-400">
                {formatCurrency(dashboard?.totalInvestment || 0)}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Active Plans</p>
              <p className="text-xl font-bold text-violet-400">
                {dashboard?.activeInvestments || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-slate-500 font-medium">ROI Earnings</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{formatCurrency(dashboard?.totalROIEarned || 0)}</p>
          <p className="text-sm text-slate-400 mt-1">{roiHistory.length} transactions</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-slate-500 font-medium">Level Income</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {formatCurrency(dashboard?.totalLevelIncome || 0)}
          </p>
          <p className="text-sm text-slate-400 mt-1">{referralIncome.length} transactions</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-slate-500 font-medium">Investments</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{formatCurrency(dashboard?.totalInvestment || 0)}</p>
          <p className="text-sm text-slate-400 mt-1">{investments.length} total investments</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-800">Transaction History</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">All your earnings and investments in one place</p>
        </div>

        <div className="divide-y divide-slate-100">
          {allTransactions.length > 0 ? (
            allTransactions.slice(0, 20).map((tx) => (
              <div key={`${tx.type}-${tx.id}`} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    tx.type === 'roi'
                      ? 'bg-emerald-100'
                      : tx.type === 'level'
                      ? 'bg-amber-100'
                      : 'bg-blue-100'
                  }`}
                >
                  {tx.type === 'roi' ? (
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  ) : tx.type === 'level' ? (
                    <Coins className="w-6 h-6 text-amber-600" />
                  ) : (
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{tx.description}</p>
                  <p className="text-sm text-slate-500">{formatDate(tx.date)}</p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-lg font-semibold ${
                      tx.amount >= 0 ? 'text-emerald-600' : 'text-slate-600'
                    }`}
                  >
                    {tx.amount >= 0 ? '+' : ''}
                    {formatCurrency(Math.abs(tx.amount))}
                  </p>
                  <p className="text-xs text-slate-400">
                    {tx.type === 'roi' ? 'ROI' : tx.type === 'level' ? 'Level Income' : 'Investment'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <WalletIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No transactions yet</p>
              <p className="text-sm text-slate-400 mt-1">Start investing to see your earnings here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
