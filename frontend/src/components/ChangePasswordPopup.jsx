import React, { useState } from "react";
import { FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";

export default function ChangePasswordPopup({ user, onPasswordChanged }) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        setError("");

        if (!newPassword) {
            setError("Please enter a new password");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Update user in localStorage to remove temp password flag
                const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                storedUser.isTempPassword = false;
                localStorage.setItem("user", JSON.stringify(storedUser));

                if (onPasswordChanged) {
                    onPasswordChanged();
                }
            } else {
                setError(data.error || "Failed to change password");
            }
        } catch (err) {
            console.error("Error changing password:", err);
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Blur backdrop */}
            <div
                className="fixed inset-0 z-40"
                style={{
                    backdropFilter: 'blur(6px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                }}
            />

            {/* Password Change Card - positioned at center */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                    className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                    style={{
                        border: '1px solid rgba(0,0,0,0.1)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                >
                    {/* Header */}
                    <div
                        className="px-5 py-4 flex items-center gap-3"
                        style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                    >
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <FiShield className="text-white" size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-base" style={{ fontFamily: 'var(--font-family)' }}>
                                Change Your Password
                            </h3>
                            <p className="text-white/80 text-sm" style={{ fontFamily: 'var(--font-family)' }}>
                                You're using a temporary password
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 sm:p-6">
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800" style={{ fontFamily: 'var(--font-family)' }}>
                                <strong>Welcome, {user?.firstName || 'User'}!</strong> Please create a new password to secure your account.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700" style={{ fontFamily: 'var(--font-family)' }}>{error}</p>
                            </div>
                        )}

                        {/* New Password Field */}
                        <div className="mb-4">
                            <label className="block text-xs text-gray-500 uppercase font-medium mb-2 tracking-wide" style={{ fontFamily: 'var(--font-family)' }}>
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FiLock size={16} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 transition-colors text-sm"
                                    style={{ fontFamily: 'var(--font-family)' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="mb-6">
                            <label className="block text-xs text-gray-500 uppercase font-medium mb-2 tracking-wide" style={{ fontFamily: 'var(--font-family)' }}>
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FiLock size={16} />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 transition-colors text-sm"
                                    style={{ fontFamily: 'var(--font-family)' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleChangePassword}
                            disabled={loading}
                            className="w-full py-3 text-white rounded-xl transition-all hover:opacity-90 font-medium text-sm sm:text-base disabled:opacity-50"
                            style={{
                                backgroundColor: 'var(--primary-color)',
                                fontFamily: 'var(--font-family)'
                            }}
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4" style={{ fontFamily: 'var(--font-family)' }}>
                            Password must be at least 6 characters long
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
