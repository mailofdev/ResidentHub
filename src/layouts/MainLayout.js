import React from 'react';
import layoutConfig from '../config/layout';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import SocietyTopbar from '../components/layout/SocietyTopbar';
import MobileNavigation from '../components/layout/MobileNavigation';
import Footer from '../components/layout/Footer';
import ThemeSwitch from '../components/display/ThemeSwitch';
import OfflineIndicator from '../components/common/OfflineIndicator';
import SkipLink from '../components/common/SkipLink';
import { useSelector } from 'react-redux';
// import { useAuth } from '../features/auth/hooks/useAuth';

const MainLayout = ({ children, config }) => {
  const { user: societyUser } = useSelector(state => state.societyAuth);
  const cfg = { ...layoutConfig, ...config };

  const handleLogout = () => {
    // logout();
  };

  const handleProfile = () => {

  };

  return (
    <div className="d-flex flex-column min-vh-100 theme-transition">
      <SkipLink />
      <OfflineIndicator />
      {cfg.showTopbar && (
        societyUser ? (
          <SocietyTopbar 
            showSearch={false} 
            showNavMenu={true} 
            showUserMenu={true} 
            showThemeToggle={true} 
            showIcons={true}
          />
        ) : (
          <Topbar 
            showSearch={false} 
            showNavMenu={true} 
            showUserMenu={true} 
            showThemeToggle={false} 
            showIcons={true} 
            onLogout={handleLogout}
            onProfile={handleProfile}
          />
        )
      )}
      <div className="container-fluid flex-grow-1">
        <div className="row">
          {cfg.showSidebar && (
            <Sidebar showIcons={true} />
          )}
          <main id="main-content" className={`${cfg.showSidebar ? "col-md-10 ms-sm-auto px-4" : "col-12 px-2"} ${societyUser ? "pb-5 pb-md-0" : ""}`} tabIndex="-1">
            {children}
          </main>
        </div>
      </div>
      {cfg.showFooter && <Footer />}
      
      {/* Mobile Navigation - only show for authenticated users */}
      {societyUser && <MobileNavigation />}
    </div>
  );
};

export default MainLayout; 