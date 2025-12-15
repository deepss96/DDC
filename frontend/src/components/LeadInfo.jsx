import React from "react";
import { FiMail, FiPhone, FiDollarSign, FiCalendar, FiList, FiHome, FiMapPin, FiBriefcase, FiTrendingUp, FiBarChart, FiClock, FiUser, FiFileText, FiCheckCircle } from "react-icons/fi";

const LeadInfo = ({ selectedLead, onClose }) => {
  if (!selectedLead) return null;

  const [activeTab, setActiveTab] = React.useState('overview');

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
   
  const getStatusColor = (status) => {
    switch (status) {
      case "Open - Not Converted": return "bg-green-100 text-green-700 border-green-200";
      case "Working - Completed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Close - Convert": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Close - Lost": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-400 pb-4">
      <div className="flex items-center justify-between mb-0 px-4 sm:px-2 pt-2 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-6">
          <nav className="flex bg-gray-100 rounded-lg p-1">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'tasks'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
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

      {/* TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="p-6">
          {/* Lead Basic Info */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{selectedLead.name}</h3>
            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(selectedLead.status)}`}>
              {selectedLead.status}
            </span>
          </div>

          {/* Contact Information Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">CONTACT NAME*</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.name}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">DATE</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(selectedLead.date)}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">EMAIL</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.email}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">PHONE NO.*</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.phone}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">COMPANY NAME</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.company || 'N/A'}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">ADDRESS</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.address || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">LEAD TYPE</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.leadType || 'N/A'}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">SOURCE</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.source || 'N/A'}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">LEAD STATUS</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.leadStatus || 'N/A'}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">LAST CONTACTED DATE</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.lastContactedDate ? formatDate(selectedLead.lastContactedDate) : 'N/A'}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">LEAD ASSIGNEE</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.leadAssignee || 'N/A'}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg py-2 px-4 border border-gray-200">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium mr-4">DESCRIPTION</span>
                  <span className="text-sm text-gray-900 flex-1">{selectedLead.description || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tasks for {selectedLead.name}</h3>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <FiList className="w-4 h-4" />
              Add Task
            </button>
          </div>

          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiCheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Send proposal</div>
                  <div className="text-xs text-gray-500">Due: Jan 20, 2025</div>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiClock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Follow up call</div>
                  <div className="text-xs text-gray-500">Due: Jan 18, 2025</div>
                </div>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">In Progress</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Send product brochure</div>
                  <div className="text-xs text-gray-500">Due: Jan 22, 2025</div>
                </div>
              </div>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Pending</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Schedule meeting</div>
                  <div className="text-xs text-gray-500">Due: Jan 25, 2025</div>
                </div>
              </div>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Pending</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadInfo;
