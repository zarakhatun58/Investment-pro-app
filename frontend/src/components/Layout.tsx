import { ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import {
  LayoutDashboard,
  Wallet,
  Users,
  History,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Coins,
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
    { id: 'roi-history', label: 'ROI History', icon: History },
    { id: 'referral-income', label: 'Level Income', icon: Coins },
    { id: 'referrals', label: 'My Referrals', icon: Users },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-slate-700" />
          ) : (
            <Menu className="w-6 h-6 text-slate-700" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">InvestPro</h1>
                <p className="text-xs text-slate-400">Wealth Building Platform</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{user?.fullName}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-700/50 rounded-xl">
              <p className="text-xs text-slate-400">Your Referral Code</p>
              <p className="text-emerald-400 font-mono font-bold text-lg">{user?.referralCode}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-slate-700">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-72 min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
