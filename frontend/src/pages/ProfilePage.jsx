import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiX, FiCalendar, FiHash, FiCheckCircle, FiLock } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const InputField = ({ label, required, type = "text", value, onChange, placeholder, error, disabled = false, ...rest }) => (
  <div className="relative" style={{ marginBottom: 'var(--form-margin-bottom)' }}>
    <label className="absolute -top-2 left-3 bg-white px-1 text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--label-font-size)', fontWeight: 'var(--label-font-weight)' }}>
      {label}{required && <span style={{ color: 'var(--secondary-color)', fontFamily: 'var(--font-family)' }} className="ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: '100%',
        height: 'var(--input-height)',
        padding: 'var(--input-padding)',
        paddingTop: '16px',
        fontSize: 'var(--placeholder-font-size)',
        fontFamily: 'var(--font-family)',
        fontWeight: 'normal',
        border: `1px solid ${error ? 'var(--secondary-color)' : 'var(--input-border-color)'}`,
        borderRadius: 'var(--input-border-radius)',
        backgroundColor: disabled ? '#f9f9f9' : 'var(--input-bg-color)',
        color: disabled ? '#666' : 'var(--input-text-color)',
        outline: 'none',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => !disabled && (e.target.style.borderColor = error ? 'var(--secondary-color)' : 'var(--input-focus-border-color)')}
      onBlur={(e) => !disabled && (e.target.style.borderColor = error ? 'var(--secondary-color)' : 'var(--input-border-color)')}
      {...rest}
    />
    {error && (
      <p style={{ color: 'var(--secondary-color)', fontFamily: 'var(--font-family)', fontSize: 'var(--error-font-size)', marginTop: '4px' }}>
        {error}
      </p>
    )}
  </div>
);

const DisplayField = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
    {Icon && <Icon size={16} className="text-gray-500" />}
    <div className="flex-1">
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      <p className="text-sm text-gray-900 font-medium">{value || 'N/A'}</p>
    </div>
  </div>
);

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  // Fetch full profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        setProfileData(response.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setFetchLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Populate form with profile data
  useEffect(() => {
    if (profileData) {
      setFirstName(profileData.first_name || "");
      setLastName(profileData.last_name || "");
      setEmail(profileData.email || "");
      setUsername(profileData.username || "");
      setPhone(profileData.phone || "");
    }
  }, [profileData]);

  const handleSave = async () => {
    if (!firstName.trim()) {
      alert('First name is required');
      return;
    }
    if (!lastName.trim()) {
      alert('Last name is required');
      return;
    }
    if (!email.trim()) {
      alert('Email is required');
      return;
    }
    if (!username.trim()) {
      alert('Username is required');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        phone
      };

      // Update user via API
      await api.updateUser(user.id, userData);

      // Update local user data
      const updatedUser = {
        ...user,
        firstName: firstName,
        lastName: lastName,
        email,
        username,
        phone
      };
      updateUser(updatedUser);

      // Refresh profile data
      const response = await api.getProfile();
      setProfileData(response.user);

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (profileData) {
      setFirstName(profileData.first_name || "");
      setLastName(profileData.last_name || "");
      setEmail(profileData.email || "");
      setUsername(profileData.username || "");
      setPhone(profileData.phone || "");
    }
    setIsEditing(false);
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last || 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (fetchLoading) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto px-4 sm:px-6 py-4">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto px-4 sm:px-6 py-4">
            <div className="text-center py-20">
              <p className="text-gray-600">Unable to load profile data.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-auto px-4 sm:px-6 py-4">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-family)' }}>
                {successMessage}
              </p>
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(profileData.first_name, profileData.last_name)}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profileData.first_name} {profileData.last_name}
                  </h1>
                  <p className="text-gray-600">{profileData.role}</p>
                  <p className="text-sm text-gray-500">@{profileData.username}</p>
                </div>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FiEdit2 size={16} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        <FiSave size={16} />
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <FiX size={16} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

              {isEditing ? (
                // Edit Mode
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <InputField
                      label="FIRST NAME"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <InputField
                      label="LAST NAME"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <InputField
                      label="EMAIL"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <InputField
                      label="USERNAME"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <InputField
                      label="PHONE"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              ) : (
                // View Mode - Display all fields
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DisplayField
                      label="USER ID"
                      value={profileData.id}
                      icon={FiHash}
                    />
                    <DisplayField
                      label="FIRST NAME"
                      value={profileData.first_name}
                      icon={FiUser}
                    />
                    <DisplayField
                      label="LAST NAME"
                      value={profileData.last_name}
                      icon={FiUser}
                    />
                    <DisplayField
                      label="EMAIL"
                      value={profileData.email}
                      icon={FiMail}
                    />
                    <DisplayField
                      label="USERNAME"
                      value={profileData.username}
                      icon={FiUser}
                    />
                    <DisplayField
                      label="PHONE"
                      value={profileData.phone}
                      icon={FiPhone}
                    />
                    <DisplayField
                      label="PASSWORD"
                      value={profileData.password}
                      icon={FiLock}
                    />
                    <DisplayField
                      label="ROLE"
                      value={profileData.role}
                      icon={FiCheckCircle}
                    />
                    <DisplayField
                      label="STATUS"
                      value={profileData.status}
                      icon={FiCheckCircle}
                    />
                    <DisplayField
                      label="REGISTRATION DATE"
                      value={formatDate(profileData.created_at)}
                      icon={FiCalendar}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
