import React from "react";
import { FiMail, FiUser, FiCalendar, FiShield } from "react-icons/fi";

const UserInfo = ({ selectedUser, onClose }) => {
    if (!selectedUser) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getRoleColor = (role) => {
        switch (role) {
            case "Admin": return "bg-purple-100 text-purple-700 border-purple-200";
            case "HR": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Site Head": return "bg-orange-100 text-orange-700 border-orange-200";
            case "Field": return "bg-green-100 text-green-700 border-green-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Active": return "bg-green-100 text-green-700 border-green-200";
            case "Inactive": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-400 pb-4">
            <div className="flex items-center justify-between mb-0 px-4 sm:px-2 pt-2 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-6">
                    <nav className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 bg-white text-blue-700 shadow-sm"
                        >
                            Overview
                        </button>
                    </nav>
                </div>
                <div className="flex items-center justify-end gap-2 w-full sm:w-auto py-0">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1 pl-2 pr-2 pt-1.5 pb-1.5 text-white text-sm font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-gray-400 active:shadow-md transition-all shadow-sm whitespace-nowrap"
                        style={{
                            backgroundColor: 'var(--primary-color)',
                            minWidth: 'fit-content'
                        }}
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                </div>
            </div>

            {/* OVERVIEW CONTENT */}
            <div className="p-6">
                {/* User Basic Info */}
                <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(selectedUser.role)}`}>
                            {selectedUser.role}
                        </span>
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedUser.status)}`}>
                            {selectedUser.status}
                        </span>
                    </div>
                </div>

                {/* User Information Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">FIRST NAME</span>
                                <span className="text-sm font-medium text-gray-900">{selectedUser.firstName}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">LAST NAME</span>
                                <span className="text-sm font-medium text-gray-900">{selectedUser.lastName}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">EMAIL</span>
                                <span className="text-sm font-medium text-gray-900">{selectedUser.email}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">USERNAME</span>
                                <span className="text-sm font-medium text-gray-900">@{selectedUser.username}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">ROLE</span>
                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getRoleColor(selectedUser.role)}`}>
                                    {selectedUser.role}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">STATUS</span>
                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(selectedUser.status)}`}>
                                    {selectedUser.status}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">CREATED DATE</span>
                                <span className="text-sm font-medium text-gray-900">{formatDate(selectedUser.createdAt)}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">USER ID</span>
                                <span className="text-sm font-medium text-gray-900">#{selectedUser.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
