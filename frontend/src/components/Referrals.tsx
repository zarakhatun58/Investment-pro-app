import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import {
  Users,
  Copy,
  Share2,
  ChevronRight,
  ChevronDown,
  Check,
  Gift,
  TrendingUp,
} from 'lucide-react';

export default function Referrals() {
  const { user } = useAuthStore();
  const { directReferrals, referralTree, fetchDirectReferrals, fetchReferralTree, isLoading } = useDataStore();
  const [copied, setCopied] = useState(false);
  const [expandedNodes, setExpandedNodes] =
useState<Set<string>>(new Set([user?._id || '']));

  useEffect(() => {
    if (user?._id) {
  fetchDirectReferrals();
  fetchReferralTree();
}
  }, [user?._id]);

  const referralLink =`${window.location.origin}/register?ref=${user?.referralCode}`;

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderTreeNode = (node: typeof referralTree, depth: number = 0) => {
    if (!node) return null;

    const hasChildren = node.children && node.children.length > 0;
 const isExpanded =
expandedNodes.has(node._id);

    return (
      <div key={node._id} className="relative">
        <div
          className={`flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer ${
            depth === 0 ? 'bg-emerald-50 border border-emerald-100' : 'bg-white'
          }`}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren ? (
            <button className="p-1 hover:bg-slate-200 rounded transition-colors">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-600" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
              depth === 0
                ? 'bg-gradient-to-br from-emerald-500 to-cyan-500'
                : 'bg-gradient-to-br ' + getNodeGradient(depth)
            }`}
          >
            {node.fullName.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-slate-800 truncate">{node.fullName}</p>
              {depth === 0 && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  You
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 truncate">{node.email}</p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400">Code: {node.referralCode}</p>
            <p className="text-xs text-slate-400">{formatDate(node.createdAt)}</p>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-8 pl-4 border-l-2 border-slate-200 space-y-2 mt-2">
            {node.children!.map((child:any) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const getNodeGradient = (depth: number): string => {
    const gradients = [
      'from-blue-400 to-blue-500',
      'from-cyan-400 to-cyan-500',
      'from-violet-400 to-violet-500',
      'from-amber-400 to-amber-500',
      'from-rose-400 to-rose-500',
    ];
    return gradients[depth % gradients.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">My Referrals</h1>
        <p className="text-slate-500 mt-1">Manage and grow your referral network</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6" />
            <span className="text-emerald-100">Direct Referrals</span>
          </div>
          <p className="text-3xl font-bold">{directReferrals.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <span className="text-slate-500">Network Size</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {referralTree ? countNodes(referralTree) : 0}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-6 h-6 text-amber-500" />
            <span className="text-slate-500">Level Income Rates</span>
          </div>
          <p className="text-lg font-bold text-slate-800">10 levels active</p>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Share Your Referral Link</h3>
            <p className="text-sm text-slate-500">Earn level income when your referrals invest</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="w-full px-4 py-3 pr-24 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-sm"
              />
              <button
                onClick={() => handleCopy(referralLink)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <Gift className="w-6 h-6 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">Your Referral Code</p>
              <p className="text-lg font-bold text-amber-600 font-mono">{user?.referralCode}</p>
            </div>
            <button
              onClick={() => handleCopy(user?.referralCode || '')}
              className="px-3 py-2 bg-white border border-amber-200 rounded-lg text-amber-700 text-sm font-medium hover:bg-amber-50 transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <h4 className="font-semibold text-slate-800 mb-2">How it works</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <span>Share your unique referral link with friends</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <span>They register and invest using your referral</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <span>You earn level income up to 10 levels deep</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <span>Income is credited daily to your wallet</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <h4 className="font-semibold text-slate-800 mb-2">Level Income Rates</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                  <div key={level} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-slate-600">Level {level}</span>
                    <span className="font-semibold text-emerald-600">
                      {[10, 5, 3, 2, 1.5, 1, 0.75, 0.5, 0.25, 0.1][level - 1]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Referrals */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Direct Referrals ({directReferrals.length})</h3>
          <p className="text-sm text-slate-500">Users who joined using your referral code</p>
        </div>

        {isLoading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-500">Loading...</span>
            </div>
          </div>
        ) : directReferrals.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {directReferrals.map((referral) => (
              <div key={referral.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  {referral.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{referral.full_name}</p>
                  <p className="text-sm text-slate-500 truncate">{referral.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Code: {referral.referral_code}</p>
                  <p className="text-xs text-slate-400">{formatDate(referral.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No direct referrals yet</p>
            <p className="text-sm text-slate-400 mt-1">Share your referral link to start growing your network</p>
          </div>
        )}
      </div>

      {/* Referral Tree */}
      {referralTree && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800">Referral Network Tree</h3>
            <p className="text-sm text-slate-500">Your complete referral hierarchy</p>
          </div>
          <div className="p-4">{renderTreeNode(referralTree)}</div>
        </div>
      )}
    </div>
  );
}

function countNodes(node: any): number {
  if (!node) return 0;
  let count = 1;
  if (node.children) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  return count;
}
