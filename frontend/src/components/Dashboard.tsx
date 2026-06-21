import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import {
  Wallet,
  TrendingUp,
  Users,
  Coins,
  ArrowUpRight,
  DollarSign,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuthStore();
  
const {
  dashboard,
  investments,
  roiHistory,
  referralIncome,
  fetchDashboard,
  fetchInvestments,
  fetchROIHistory,
  fetchReferralIncome,
} = useDataStore();
  useEffect(() => {
  fetchDashboard();
  fetchInvestments();
  fetchROIHistory();
  fetchReferralIncome();
}, []);

  const statsCards = [
    {
      label: 'Total Investments',
      value: dashboard?.totalInvestment || 0,
      prefix: '$',
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Wallet Balance',
      value: dashboard?.walletBalance || 0,
      prefix: '$',
      icon: Wallet,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Total ROI Earned',
      value: dashboard?.totalROIEarned || 0,
      prefix: '$',
      icon: TrendingUp,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600',
    },
    {
      label: 'Level Income Earned',
      value: dashboard?.totalLevelIncome || 0,
      prefix: '$',
      icon: Coins,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Active Investments',
      value: dashboard?.activeInvestments || 0,
      icon: Activity,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
    },
    {
      label: 'Total Referrals',
      value: dashboard?.totalReferrals || 0,
      icon: Users,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
    },
  ];

  // Chart data - last 7 days ROI
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const roiChartData = last7Days.map((date) => {
    const dayRoi = roiHistory
      .filter((r) => r.date === date)
      .reduce((sum, r) => sum + Number(r.roi_amount), 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      roi: dayRoi,
    };
  });

  // Investment distribution by plan
  const investmentByPlan = investments.reduce((acc, inv) => {
    const planName = inv.plan?.name || 'Unknown';
    acc[planName] = (acc[planName] || 0) + Number(inv.amount);
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(investmentByPlan).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {user?.fullName?.split(' ')[0]}!</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-emerald-700">All systems operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Active</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-slate-500 text-sm">{stat.label}</p>
                <p className="text-2xl lg:text-3xl font-bold text-slate-800 mt-1">
                  {stat.prefix}
                  {typeof stat.value === 'number'
                    ? stat.prefix
                      ? stat.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : stat.value.toLocaleString()
                    : stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ROI Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">ROI Earnings</h3>
              <p className="text-sm text-slate-500">Last 7 days performance</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                {formatCurrency(roiChartData.reduce((sum, d) => sum + d.roi, 0))}
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={roiChartData}>
              <defs>
                <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => [formatCurrency(value as number), 'ROI']}
              />
              <Area
                type="monotone"
                dataKey="roi"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRoi)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Investment Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Investment Distribution</h3>
            <p className="text-sm text-slate-500">By investment plan</p>
          </div>
          {/* Responsive pie chart container */}
          <div className="w-full overflow-hidden">
          {pieChartData.length > 0 ? (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-slate-400">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No investments yet</p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent ROI */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent ROI</h3>
          <div className="space-y-3">
            {roiHistory.slice(0, 5).map((roi) => (
              <div
                key={roi.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      {roi.investment?.plan?.name || 'Investment'}
                    </p>
                    <p className="text-xs text-slate-500">{roi.date}</p>
                  </div>
                </div>
                <span className="text-emerald-600 font-semibold">+{formatCurrency(roi.roi_amount)}</span>
              </div>
            ))}
            {roiHistory.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <p>No ROI records yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Level Income */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Level Income</h3>
          <div className="space-y-3">
            {referralIncome.slice(0, 5).map((income) => (
              <div
                key={income.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Coins className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Level {income.level} Income</p>
                    <p className="text-xs text-slate-500">{income.date}</p>
                  </div>
                </div>
                <span className="text-amber-600 font-semibold">+{formatCurrency(income.income_amount)}</span>
              </div>
            ))}
            {referralIncome.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <p>No level income yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
