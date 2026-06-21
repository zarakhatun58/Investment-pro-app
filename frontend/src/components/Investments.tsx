import { useState } from 'react';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import {
  TrendingUp,
  DollarSign,
  Percent,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
} from 'lucide-react';



export default function Investments() {
  const { user } = useAuthStore();
  const {
     plans,
    investments,
    fetchInvestments,
    createInvestment,
    isLoading,
    error
  } = useDataStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [planName, setPlanName] = useState("Starter");
  const [dailyROI, setDailyROI] = useState(1);
  const [durationDays, setDurationDays] = useState(100);

  useEffect(() => {
  if (user?._id) {
    fetchInvestments();
  }
}, [user?._id, fetchInvestments]);

//  const plans = [
//   {
//     id: "starter",
//     name: "Starter Plan",
//     minAmount: 100,
//     maxAmount: 1000,
//     dailyROI: 1,
//     durationDays: 30,
//   },
//   {
//     id: "premium",
//     name: "Premium Plan",
//     minAmount: 1000,
//     maxAmount: 10000,
//     dailyROI: 2,
//     durationDays: 60,
//   },
// ]; 

const handleInvest = async () => {
  if (!investmentAmount || !user?._id) return;

  try {
    await createInvestment({
      amount: Number(investmentAmount),
      planName,
      dailyROI,
      durationDays,
    });

    setShowModal(false);
    setInvestmentAmount("");

    setSuccessMessage(
      "Investment created successfully! ROI will be credited daily."
    );

    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  } catch (error) {
    console.error(error);
  }
};

const selectedPlanData =
plans.find(
  (p) => p._id === selectedPlan
);
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: {
        icon: CheckCircle,
        color: 'bg-emerald-100 text-emerald-700',
        label: 'Active'
      },

      COMPLETED: {
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-700',
        label: 'Completed'
      },

      CANCELLED: {
        icon: XCircle,
        color: 'bg-red-100 text-red-700',
        label: 'Cancelled'
      }
    };

    const config =
      statusConfig[
      status as keyof typeof statusConfig
      ] || statusConfig.ACTIVE;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

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

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Investments</h1>
        <p className="text-slate-500 mt-1">Choose an investment plan and start earning daily ROI</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <p className="text-emerald-700 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Investment Plans */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {plans.map((plan: any) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 cursor-pointer group"
              onClick={() => {
                setSelectedPlan(plan.id);
                setInvestmentAmount(plan.min_amount.toString());
                setShowModal(true);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {plan.duration_days} Days
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
              <p className="text-sm text-slate-500 mt-1 min-h-[40px]">{plan.description}</p>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-emerald-600">{plan.daily_roi_percentage}%</span>
                  <span className="text-slate-500 text-sm">daily ROI</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Min: {formatCurrency(plan.min_amount)}</span>
                  <span>Max: {formatCurrency(plan.max_amount)}</span>
                </div>
              </div>

              <button className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium opacity-90 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                Invest Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* My Investments */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">My Investments</h2>
        {investments.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      ROI Rate
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Total ROI
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {investments.map((investment) => (
                    <tr key={investment._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{investment?.planName || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">{formatCurrency(investment.amount)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <Percent className="w-4 h-4" />
                          {investment.daily_roi_percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">
                          <div>{formatDate(investment.start_date)} - {formatDate(investment.end_date)}</div>
                          {investment.status === 'active' && (
                            <div className="text-emerald-600 font-medium flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {getDaysRemaining(investment.end_date)} days remaining
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-emerald-600">
                          {formatCurrency(investment.total_roi_distributed)}
                        </span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(investment.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
            <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No Investments Yet</h3>
            <p className="text-slate-500">Choose a plan above to start your investment journey</p>
          </div>
        )}
      </div>

      {/* Investment Modal */}
      {showModal && selectedPlanData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Invest in {selectedPlanData.name}</h3>

            {/* Error in modal */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Daily ROI</p>
                    <p className="font-semibold text-emerald-600">{selectedPlanData.dailyROI}%</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Duration</p>
                    <p className="font-semibold text-slate-800">{selectedPlanData.durationDays} days</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Min Investment</p>
                    <p className="font-semibold text-slate-800">{formatCurrency(selectedPlanData.minAmount)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Max Investment</p>
                    <p className="font-semibold text-slate-800">{formatCurrency(selectedPlanData.maxAmount)}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Investment Amount (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    min={selectedPlanData.minAmount}
                    max={selectedPlanData.maxAmount}
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-medium"
                  />
                </div>
              </div>

              {/* Expected Returns */}
              {investmentAmount && parseFloat(investmentAmount) >= selectedPlanData.minAmount && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <h4 className="font-semibold text-emerald-800 mb-2">Expected Returns</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Daily ROI:</span>
                      <span className="font-semibold text-emerald-800">
                        {formatCurrency((parseFloat(investmentAmount) * selectedPlanData.dailyROI) / 100)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Total ROI ({selectedPlanData.durationDays} days):</span>
                      <span className="font-semibold text-emerald-800">
                        {formatCurrency(
                          ((parseFloat(investmentAmount) * selectedPlanData.dailyROI) / 100) *
                          selectedPlanData.durationDays
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-emerald-200">
                      <span className="text-emerald-700">Total Return:</span>
                      <span className="font-bold text-emerald-800">
                        {formatCurrency(
                          parseFloat(investmentAmount) +
                          ((parseFloat(investmentAmount) * selectedPlanData.dailyROI) / 100) *
                          selectedPlanData.durationDays
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedPlan(null);
                    setInvestmentAmount('');
                  }}
                  className="flex-1 py-3 px-4 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvest}
                  disabled={
                    isLoading ||
                    !investmentAmount ||
                    parseFloat(investmentAmount) < selectedPlanData.minAmount ||
                    parseFloat(investmentAmount) > selectedPlanData.maxAmount
                  }
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Confirm Investment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
