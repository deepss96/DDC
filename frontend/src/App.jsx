import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import TopNavbar from './components/TopNavbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import MobileBottomNavbar from './components/MobileBottomNavbar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LeadsPage from './pages/LeadsPage.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import LoginSignupPage from './pages/LoginSignupPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { useTranslation } from './services/translationService.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';

function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Get current page from URL path
  const getCurrentPageFromPath = (pathname) => {
    if (pathname === '/' || pathname === '/dashboard') return 'dashboard';
    if (pathname === '/lead-management') return 'lead-management';
    if (pathname === '/clients-management') return 'clients-management';
    if (pathname === '/my-tasks') return 'my-tasks';
    if (pathname === '/projects-management') return 'projects-management';
    if (pathname === '/users-management') return 'users-management';
    if (pathname === '/profile') return 'profile';
    if (pathname === '/employee-management') return 'employee-management';
    if (pathname === '/site-expenses') return 'site-expenses';
    if (pathname === '/site-received') return 'site-received';
    if (pathname === '/reports') return 'reports';
    if (pathname === '/settings') return 'settings';
    if (pathname === '/help-support') return 'help-support';
    return 'dashboard';
  };

  const [currentPage, setCurrentPage] = useState(getCurrentPageFromPath(location.pathname));

  // Redirect to auth if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated()) {
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleNavigate = (path) => {
    setCurrentPage(path);
    navigate(`/${path}`);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return t('Dashboard');
      case 'lead-management':
        return t('Lead Management');
      case 'clients-management':
        return t('Clients Management');
      case 'my-tasks':
        return t('My Tasks');
      case 'projects-management':
        return t('Projects Management');
      case 'users-management':
        return t('User Management');
      case 'profile':
        return t('Profile');
      case 'employee-management':
        return t('Employee Management');
      case 'site-expenses':
        return t('Site Expenses');
      case 'site-received':
        return t('Site Received');
      case 'reports':
        return t('Reports');
      case 'settings':
        return t('Settings');
      case 'help-support':
        return t('Help & Support');
      default:
        return t('Dashboard');
    }
  };

  const getPageSubtitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return t('Manage Everything from a single place');
      case 'lead-management':
        return t('Track and manage your potential clients');
      case 'clients-management':
        return t('Manage your client relationships');
      case 'my-tasks':
        return t('Manage and track your tasks effectively');
      case 'projects-management':
        return t('Oversee all your projects');
      case 'users-management':
        return t('Manage system users');
      case 'profile':
        return t('View and manage your profile information');
      case 'employee-management':
        return t('Manage your team effectively');
      case 'site-expenses':
        return t('Track construction expenses');
      case 'site-received':
        return t('Monitor received payments');
      case 'reports':
        return t('View detailed analytics and reports');
      case 'settings':
        return t('Configure your preferences');
      case 'help-support':
        return t('Get assistance and support');
      default:
        return t('Manage Everything from a single place');
    }
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-gray-700">
      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold">Menu</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              {/* Mobile menu items would go here */}
              <div className="space-y-4">
                <button
                  onClick={() => { handleNavigate('dashboard'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100"
                >
                  <span className="text-primary">📊</span>
                  <span className="text-gray-700 font-medium">Dashboard</span>
                </button>
                <button
                  onClick={() => { handleNavigate('lead-management'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100"
                >
                  <span className="text-primary">👥</span>
                  <span className="text-gray-700 font-medium">Lead Management</span>
                </button>
                <button
                  onClick={() => { handleNavigate('clients-management'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100"
                >
                  <span className="text-primary">🤝</span>
                  <span className="text-gray-700 font-medium">Clients Management</span>
                </button>
                <button
                  onClick={() => { handleNavigate('my-tasks'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100"
                >
                  <span className="text-primary">✅</span>
                  <span className="text-gray-700 font-medium">My Tasks</span>
                </button>
                <button
                  onClick={() => { handleNavigate('projects-management'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100"
                >
                  <span className="text-primary">📁</span>
                  <span className="text-gray-700 font-medium">Projects Management</span>
                </button>
                <button
                  onClick={() => { handleNavigate('users-management'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100"
                >
                  <span className="text-primary">👤</span>
                  <span className="text-gray-700 font-medium">User Management</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen max-h-screen overflow-hidden">
        {/* SIDEBAR - HIDDEN ON MOBILE */}
        <Sidebar activeItem={currentPage} onNavigate={handleNavigate} />

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-auto">
          <div>
            <TopNavbar
              title={getPageTitle()}
              subtitle={getPageSubtitle()}
              onMobileMenuToggle={handleMobileMenuToggle}
              onSearch={setSearchTerm}
            />
          </div>

          {/* PAGE CONTENT */}
          <div className="pt-16 md:pt-14" style={{ minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/lead-management" element={<LeadsPage searchTerm={searchTerm} />} />
              {/* Placeholder routes for other pages */}
              <Route path="/clients-management" element={<ClientsPage searchTerm={searchTerm} />} />
              <Route path="/my-tasks" element={<TasksPage searchTerm={searchTerm} />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/projects-management" element={
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex-1 flex overflow-hidden">
                    <main className="flex-1 overflow-auto px-4 sm:px-6 py-4">
                      <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Projects Management</h2>
                        <p className="text-gray-600">This page is under development.</p>
                      </div>
                    </main>
                  </div>
                </div>
              } />
              <Route path="/users-management" element={<UsersPage searchTerm={searchTerm} />} />
            </Routes>
          </div>

          {/* MOBILE BOTTOM NAVIGATION */}
          <MobileBottomNavbar
            activePage={currentPage}
            onNavigate={handleNavigate}
            onMenuToggle={() => setMobileMenuOpen(true)}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/auth" element={<LoginSignupPage />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
