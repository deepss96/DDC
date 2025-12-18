import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isLoggingOutTempUser, setIsLoggingOutTempUser] = useState(false);

  // Check for existing token and user data on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);

        // If user has temp password during initial load, don't show popup yet
        // fetchFullProfile will handle logout if needed
        if (!userData.isTempPassword) {
          // Only show password change popup if user doesn't have temp password
          // (this shouldn't happen, but safety check)
          setShowPasswordChange(false);
        }

        // Fetch full profile to ensure we have complete user data including role
        fetchFullProfile(storedToken, true);
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const fetchFullProfile = async (authToken, isInitialLoad = false) => {
    try {
      // Temporarily set the token for the API call
      const originalToken = localStorage.getItem('token');
      if (!originalToken) {
        localStorage.setItem('token', authToken);
      }

      console.log('AUTH DEBUG: Fetching full profile, isInitialLoad:', isInitialLoad);
      const response = await apiService.getProfile();
      console.log('AUTH DEBUG: Profile response:', response);

      const fullUserData = {
        id: response.user.id,
        firstName: response.user.first_name,
        lastName: response.user.last_name,
        email: response.user.email,
        username: response.user.username,
        role: response.user.role,
        status: response.user.status,
        phone: response.user.phone,
        profile_image: response.user.profile_image,
        isTempPassword: response.user.is_temp_password
      };

      console.log('AUTH DEBUG: Setting full user data:', fullUserData);
      setUser(fullUserData);
      localStorage.setItem('user', JSON.stringify(fullUserData));

      // Check if user needs to change password
      if (fullUserData.isTempPassword) {
        // If this is initial app load and user still has temp password, they refreshed without changing
        if (isInitialLoad) {
          console.log('TEMP PASSWORD: User refreshed without changing password, logging out');
          setIsLoggingOutTempUser(true);
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsLoggingOutTempUser(false);
          return;
        } else {
          // This is after login, show password change popup
          console.log('TEMP PASSWORD: Showing password change popup after login');
          setShowPasswordChange(true);
        }
      } else {
        // User has changed password, hide any password change popup
        setShowPasswordChange(false);
      }
    } catch (error) {
      console.error('Error fetching full profile:', error);
      // If profile fetch fails, keep the basic user data
    }
  };

  const login = async (token, userData) => {
    console.log('LOGIN DEBUG: Login response userData:', userData);
    setToken(token);
    localStorage.setItem('token', token);

    // Set initial user data
    const basicUserData = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      username: userData.username,
      isTempPassword: userData.isTempPassword || false
    };
    console.log('LOGIN DEBUG: basicUserData.isTempPassword:', basicUserData.isTempPassword);
    setUser(basicUserData);
    localStorage.setItem('user', JSON.stringify(basicUserData));

    // Check if password change is needed immediately
    if (basicUserData.isTempPassword) {
      console.log('TEMP PASSWORD: Showing password change popup immediately');
      setShowPasswordChange(true);
    } else {
      console.log('TEMP PASSWORD: No popup needed, isTempPassword is false');
    }

    // Fetch full profile to get role and other details
    await fetchFullProfile(token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const hidePasswordChange = () => {
    setShowPasswordChange(false);
  };

  const isAuthenticated = () => {
    return !!token && !!user && !user.isTempPassword;
  };

  const requiresPasswordChange = () => {
    // Don't show password change popup during initial load if user has temp password
    // This prevents the popup from showing briefly before logout during refresh
    if (loading && !!user && !!user.isTempPassword) {
      return false;
    }
    return !!token && !!user && !!user.isTempPassword;
  };

  const value = {
    user,
    token,
    loading,
    showPasswordChange,
    login,
    logout,
    updateUser,
    hidePasswordChange,
    isAuthenticated,
    requiresPasswordChange
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
