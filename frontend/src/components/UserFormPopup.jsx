import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

// InputField component moved outside to prevent re-creation on each render
const InputField = ({ label, required, type = "text", value, onChange, placeholder, error, ...rest }) => (
  <div className="relative" style={{ marginBottom: 'var(--form-margin-bottom)' }}>
    <label className="absolute -top-2 left-3 bg-white px-1 text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--label-font-size)', fontWeight: 'var(--label-font-weight)' }}>
      {label}{required && <span style={{ color: 'var(--secondary-color)', fontFamily: 'var(--font-family)' }} className="ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        height: 'var(--input-height)',
        padding: 'var(--input-padding)',
        paddingTop: '16px', // Extra top padding to accommodate the label
        fontSize: 'var(--placeholder-font-size)',
        fontFamily: 'var(--font-family)',
        fontWeight: 'normal',
        border: `1px solid ${error ? 'var(--secondary-color)' : 'var(--input-border-color)'}`,
        borderRadius: 'var(--input-border-radius)',
        backgroundColor: 'var(--input-bg-color)',
        color: 'var(--input-text-color)',
        outline: 'none',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => e.target.style.borderColor = error ? 'var(--secondary-color)' : 'var(--input-focus-border-color)'}
      onBlur={(e) => e.target.style.borderColor = error ? 'var(--secondary-color)' : 'var(--input-border-color)'}
      {...rest}
    />
    {error && (
      <p style={{ color: 'var(--secondary-color)', fontFamily: 'var(--font-family)', fontSize: 'var(--error-font-size)', marginTop: '4px' }}>
        {error}
      </p>
    )}
  </div>
);

  const SelectField = ({ label, options = [], value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = React.useRef(null);

    React.useEffect(() => {
      const handleClickOutside = (e) => {
        if (isOpen && selectRef.current && !selectRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleSelect = (option) => {
      onChange(option);
      setIsOpen(false);
    };

    return (
      <div ref={selectRef} className="relative" style={{ marginBottom: 'var(--form-margin-bottom)' }}>
        <label className="absolute -top-2 left-3 bg-white px-1 text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--label-font-size)', fontWeight: 'var(--label-font-weight)' }}>
          {label}
        </label>
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            height: 'var(--input-height)',
            padding: 'var(--input-padding)',
            paddingTop: '16px', // Extra top padding to accommodate the label
            fontSize: 'var(--input-font-size)',
            fontFamily: 'var(--font-family)',
            border: '1px solid var(--input-border-color)',
            borderRadius: 'var(--input-border-radius)',
            backgroundColor: 'var(--input-bg-color)',
            color: value ? 'var(--input-text-color)' : 'var(--input-placeholder-color)',
            outline: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--input-focus-border-color)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--input-border-color)'}
        >
          <span style={{
            color: value ? 'var(--input-text-color)' : 'var(--input-placeholder-color)',
            fontSize: 'var(--placeholder-font-size)',
            fontFamily: 'var(--font-family)',
          }}>
            {value || placeholder}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto mt-1 w-full">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                style={{
                  padding: '4px 12px',
                  fontSize: 'var(--input-font-size)',
                  fontFamily: 'var(--font-family)',
                  color: option === value ? 'var(--input-placeholder-color)' : 'var(--input-text-color)',
                  cursor: 'pointer',
                  backgroundColor: option === value ? '#f3f4f6' : '#f8fafc',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = option === value ? '#f3f4f6' : '#f8fafc'}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

export default function UserFormPopup({ isOpen, onClose, onSubmit, editUser }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("Active");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Populate form when editing
    useEffect(() => {
        if (editUser) {
            setFirstName(editUser.first_name || editUser.firstName || "");
            setLastName(editUser.last_name || editUser.lastName || "");
            setEmail(editUser.email || "");
            setUsername(editUser.username || "");
            setRole(editUser.role || "");
            setStatus(editUser.status || "Active");
        } else {
            resetForm();
        }
    }, [editUser, isOpen]);

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setUsername("");
        setRole("");
        setStatus("Active");
    };

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
        if (!role) {
            alert('Please select a role');
            return;
        }

        try {
            const userData = {
                first_name: firstName,
                last_name: lastName,
                email,
                username,
                role,
                status
            };

            if (typeof onSubmit === "function") {
                const result = await onSubmit(userData);

                // Show success message
                setSuccessMessage(editUser ? 'User updated successfully!' : 'User created successfully!');
                setShowSuccessMessage(true);

                // Hide success message and close form after 2 seconds
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    resetForm();
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error saving user. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100] p-4 sm:p-6 overflow-auto">
            <div className="w-full max-w-5xl bg-white rounded-xl flex flex-col max-h-[95vh] task-modal">
                {/* Success Message */}
                {showSuccessMessage && (
                    <div className="fixed top-4 right-4 z-[1200] bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                        <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-family)' }}>
                            {successMessage}
                        </p>
                    </div>
                )}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 sticky top-0 bg-white z-10 border-b-2 rounded-t-xl" style={{ borderBottomColor: 'var(--primary-color)' }}>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        >
                            <FiX size={20} />
                        </button>
                        <h2 className="text-base sm:text-lg font-bold" style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-family)' }}>
                            {editUser ? 'EDIT USER' : 'CREATE USER'}
                        </h2>
                    </div>
                    <button
                        onClick={handleSave}
                        className="text-white px-3 sm:px-4 py-2 rounded-xl shadow-md hover:opacity-90 text-sm sm:text-base"
                        style={{ backgroundColor: 'var(--primary-color)', fontFamily: 'var(--font-family)' }}
                    >
                        Save
                    </button>
                </div>
                <div className="p-4 sm:p-6 flex-1 overflow-y-auto rounded-b-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 'var(--form-gap)' }}>
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
                            <SelectField
                                label="ROLE"
                                options={["Admin", "HR", "Site Manager", "Office Staff"]}
                                value={role}
                                onChange={setRole}
                                placeholder="Select role"
                            />
                        </div>
                        <div>
                            <SelectField
                                label="STATUS"
                                options={["Active", "Inactive"]}
                                value={status}
                                onChange={setStatus}
                                placeholder="Select status"
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
                    </div>

                    {/* Info message for new users - moved to bottom */}
                    {!editUser && (
                        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs sm:text-sm text-blue-700">
                                <strong>Note:</strong> A temporary password will be generated automatically.
                                You'll see the login credentials after saving.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
