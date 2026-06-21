import { useState, useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Investments from './components/Investments';
import RoiHistory from './components/RoiHistory';
import ReferralIncome from './components/ReferralIncome';
import Referrals from './components/Referrals';
import Wallet from './components/Wallet';

function App() {
  const { user, fetchUser, token } = useAuthStore();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      setIsInitialized(true);
    };
    init();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return <Auth onSuccess={() => setCurrentPage('dashboard')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'investments':
        return <Investments />;
      case 'roi-history':
        return <RoiHistory />;
      case 'referral-income':
        return <ReferralIncome />;
      case 'referrals':
        return <Referrals />;
      case 'wallet':
        return <Wallet />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
