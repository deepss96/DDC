import React, { useState } from "react";
import { FiSearch, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import LanguageSelector from "./LanguageSelector";
import NotificationDropdown from "./NotificationDropdown";
import { useAuth } from "../contexts/AuthContext";
import "../assets/CSS/TopNavbar.css";

export default function TopNavbar({ title, subtitle, onMobileMenuToggle, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    // Redirect to auth page will happen automatically due to auth check in App.jsx
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last || 'U';
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="top-navbar-container">
      {/* TOP BAR - DESKTOP */}
      <header className="top-navbar-desktop">
        <div className="flex flex-col">
          <h1 className="top-navbar-title">{title}</h1>
          <h6 className="top-navbar-subtitle">{subtitle}</h6>
        </div>

        <div className="flex items-center gap-3">
          <div className="top-navbar-search">
            <FiSearch size={14} />
            <input
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <NotificationDropdown />

          {/* LANGUAGE SELECTOR COMPONENT */}
          <LanguageSelector title={title} subtitle={subtitle} />

          {/* USER MENU */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="top-navbar-avatar">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-gray-500">
                  {user?.username}
                </span>
              </div>
              <FiChevronDown
                size={16}
                className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* USER DROPDOWN MENU */}
            {showUserMenu && (
              <div className="user-dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="user-info px-4 py-3 border-b border-gray-200">
                  <p className="user-name">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="user-email">{user?.email}</p>
                  <p className="user-phone">{user?.phone}</p>
                </div>

                <button
                  onClick={() => {
                    // Navigate to profile page
                    window.location.href = '/profile';
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiUser size={16} />
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE HEADER - SIMPLIFIED */}
      <header className="top-navbar-mobile">
        <div className="flex flex-col">
          <h1 className="top-navbar-title text-sm">{title}</h1>
          {/* Subtitle hidden on mobile for cleaner look */}
        </div>
        <div className="flex items-center gap-3">
          <NotificationDropdown />

          {/* LANGUAGE SELECTOR COMPONENT - MOBILE */}
          <LanguageSelector title={title} subtitle={subtitle} />

          {/* USER MENU - MOBILE */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1"
            >
              <div className="top-navbar-avatar">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <FiChevronDown
                size={14}
                className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* USER DROPDOWN MENU - MOBILE */}
            {showUserMenu && (
              <div className="user-dropdown-menu absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="user-info px-4 py-3 border-b border-gray-200">
                  <p className="user-name">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="user-email">{user?.username}</p>
                </div>

                <button
                  onClick={() => {
                    // Navigate to profile page
                    window.location.href = '/profile';
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiUser size={16} />
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
