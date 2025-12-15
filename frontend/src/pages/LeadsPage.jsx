import React, { useState, useRef, useEffect } from "react";
import { FiUserPlus, FiMail, FiPhone, FiCalendar, FiDollarSign, FiEdit, FiTrash2, FiSearch, FiFilter, FiPlus, FiSliders, FiList, FiCheck, FiUpload, FiUser, FiHome, FiMapPin, FiBriefcase, FiTrendingUp, FiBarChart, FiClock, FiFileText } from "react-icons/fi";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import TableActionButton from "../components/TableActionButton";
import LeadFormPopup from "../components/LeadFormPopup";
import LeadInfo from "../components/LeadInfo";
import Table from "../components/Table";

export default function LeadsPage({ searchTerm = '' }) {
  const [leadsData, setLeadsData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const filterDropdownRef = useRef(null);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched leads:', data);
        const mappedData = data.map(lead => ({
          id: lead.id,
          name: lead.contact_name,
          email: lead.email || '',
          phone: lead.phone,
          status: lead.lead_status || 'New Lead',
          value: '', // Not in DB, so empty
          date: lead.date,
          company: lead.company_name || '',
          address: lead.address || '',
          leadType: lead.lead_type || '',
          source: lead.source || '',
          leadStatus: lead.lead_status || '',
          lastContactedDate: lead.last_contacted_date || '',
          leadAssignee: lead.lead_assignee || '',
          description: lead.description || ''
        }));
        console.log('Mapped data:', mappedData);
        setLeadsData(mappedData);
      } else {
        console.error('Failed to fetch leads:', response.status);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Handle clicks outside the filter dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterPopupOpen(false);
      }
    };

    if (isFilterPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterPopupOpen]);

  const filteredLeads = leadsData.filter(lead => {
    const matchesSearch = searchTerm === '' ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);

    const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteLead = (id) => {
    setLeadsData(leadsData.filter(lead => lead.id !== id));
  };

  const handleEditRow = (id) => {
    const leadToEdit = leadsData.find(lead => lead.id === id);
    if (leadToEdit) {
      setEditLead(leadToEdit);
      setIsEdit(true);
      setIsLeadFormOpen(true);
    }
  };

  const handleDeleteRow = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        const response = await fetch(`/api/leads/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchLeads();
        } else {
          alert('Failed to delete lead');
        }
      } catch (error) {
        alert('Error deleting lead');
      }
    }
  };

  const handleCreateLead = () => {
    setIsEdit(false);
    setEditLead(null);
    fetchLeads();
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMobileStatusDisplay = (status) => {
    switch (status) {
      case "Open - Not Converted": return "Open";
      case "Working - Completed": return "Working";
      case "Close - Convert": return "Close";
      case "Close - Lost": return "Lost";
      default: return status;
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000); // Auto-dismiss after 4 seconds
  };

  // Table configuration
  const leadColumns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Phone' },
    { key: 'status', title: 'Status' },
    { key: 'date', title: 'Date' },
    { key: 'actions', title: 'Actions', align: 'center' }
  ];

  const renderLeadCell = (key, lead) => {
    switch (key) {
      case 'name':
        return (
          <div className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setSelectedLead(lead)}>
            {lead.name}
          </div>
        );
      case 'status':
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-normal rounded-full ${getStatusColor(lead.status)}`}>
            {lead.status}
          </span>
        );
      case 'date':
        return formatDate(lead.date);
      default:
        return lead[key];
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-auto px-4 sm:px-6 py-4 space-y-4 md:pb-4 pb-24 ">
          {selectedLead ? (
            <LeadInfo selectedLead={selectedLead} onClose={() => setSelectedLead(null)} />
          ) : (
            <div className="bg-white rounded-xl border border-gray-400 pb-4 sm:h-[calc(100vh-90px)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-0 px-4 sm:px-2 pt-2 pb-2 border-b border-gray-200">
                <div className="hidden sm:flex items-center gap-3 mb-3 sm:mb-0">
                </div>
                <div className="flex items-center justify-end gap-2 w-full sm:w-auto py-0">
                  <button
                    onClick={() => setIsUploadPopupOpen(true)}
                    className="flex items-center gap-0 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 active:shadow-md transition-all shadow-sm"
                    style={{ height: '30px' }}
                    title="Upload Excel File"
                  >
                    <div className="flex items-center justify-center w-7 h-full bg-gray-100 rounded-l-lg border-r border-gray-300">
                      <FiUpload size={14} />
                    </div>
                    <span style={{ fontWeight: '400', fontSize: '12px', lineHeight: '18px', padding: '0 8px' }}>
                      Upload
                    </span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setIsFilterPopupOpen(!isFilterPopupOpen)}
                      className="flex items-center gap-0 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 active:shadow-md transition-all shadow-sm"
                      style={{ height: '30px' }}
                      title="Filter by status"
                    >
                      <div className="flex items-center justify-center w-7 h-full bg-gray-100 rounded-l-lg border-r border-gray-300">
                        <FiFilter size={14} />
                      </div>
                      <span style={{ fontWeight: '400', fontSize: '12px', lineHeight: '18px', padding: '0 8px' }}>
                        {selectedStatus === "All" ? "All Status" :
                         selectedStatus === "Open - Not Converted" ? "Open - Not Converted" :
                         selectedStatus === "Working - Completed" ? "Working - Completed" :
                         selectedStatus === "Close - Convert" ? "Close - Convert" :
                         selectedStatus === "Close - Lost" ? "Close - Lost" : "All Status"}
                      </span>
                    </button>
                    {isFilterPopupOpen && (
                      <div ref={filterDropdownRef} className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-40 py-1">
                        {[
                          { value: "All", label: "All Status" },
                          { value: "Open - Not Converted", label: "Open - Not Converted" },
                          { value: "Working - Completed", label: "Working - Completed" },
                          { value: "Close - Convert", label: "Close - Convert" },
                          { value: "Close - Lost", label: "Close - Lost" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSelectedStatus(option.value);
                              setIsFilterPopupOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-gray-50 transition-colors ${
                              selectedStatus === option.value
                                ? "text-blue-600 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            <span>{option.label}</span>
                            {selectedStatus === option.value && (
                              <FiCheck className="text-blue-600" size={14} />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setIsEdit(false);
                      setEditLead(null);
                      setIsLeadFormOpen(true);
                    }}
                    className="flex items-center gap-1 pl-2 pr-2 pt-1.5 pb-1.5 text-white text-sm font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-gray-400 active:shadow-md transition-all shadow-sm whitespace-nowrap"
                    style={{
                      backgroundColor: 'var(--primary-color)',
                      minWidth: 'fit-content'
                    }}
                  >
                    <FiPlus size={17} color="#ffffff" />
                    <span style={{ fontWeight: '400', fontSize: '12px', lineHeight: '18px' }}>New</span>
                  </button>
                </div>
              </div>

              {/* MOBILE CARD VIEW */}
              <div className="block sm:hidden mt-4">
                {filteredLeads.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <FiUserPlus className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No leads found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new lead.</p>
                  </div>
                ) : (
                  <div className="space-y-2 px-2">
                    {filteredLeads.map((lead) => (
                      <div key={lead.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
                        {/* Row 1: Name and Status with Actions */}
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex-1 min-w-0 flex items-center gap-3">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">{lead.name}</h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </div>
                          <div className="flex gap-2 ml-3">
                            <TableActionButton
                              icon={FaPencilAlt}
                              type="edit"
                              title="Edit"
                              onClick={() => handleEditRow(lead.id)}
                              mobileSize={true}
                            />
                            <TableActionButton
                              icon={FaTrash}
                              type="delete"
                              title="Delete"
                              onClick={() => handleDeleteRow(lead.id)}
                              mobileSize={true}
                            />
                          </div>
                        </div>

                        {/* Row 2: Company and Email */}
                        <div className="flex justify-between items-center mb-2 text-xs text-gray-600">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="font-medium text-gray-900">{lead.company}</span>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <FiMail size={12} className="text-blue-500 flex-shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                        </div>

                        {/* Row 3: Phone and Date */}
                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <FiPhone size={12} className="text-green-500 flex-shrink-0" />
                            <span>{lead.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiCalendar size={12} className="text-gray-500 flex-shrink-0" />
                            <span>{formatDate(lead.date)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DESKTOP TABLE VIEW */}
              <Table
                data={filteredLeads}
                columns={leadColumns}
                loading={false}
                emptyMessage="No leads found"
                emptyDescription="Get started by adding a new lead."
                onEdit={handleEditRow}
                onDelete={handleDeleteRow}
                renderCell={renderLeadCell}
                loadingMessage="Loading leads..."
                keyField="id"
              />
            </div>
          )}
        </main>
      </div>

      {/* POPUPS AND NOTIFICATIONS - keep inside the outermost div so JSX has a single root */}
      <>
        <LeadFormPopup
          isOpen={isLeadFormOpen}
          onClose={() => setIsLeadFormOpen(false)}
          onSubmit={handleCreateLead}
          isEdit={isEdit}
          editLead={editLead}
        />

        {/* EXCEL UPLOAD POPUP */}
        {isUploadPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload Excel File</h3>
                <button
                  onClick={() => {
                    setIsUploadPopupOpen(false);
                    setIsUploading(false);
                    setUploadProgress(0);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!isUploading ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Select Excel file to upload</p>
                    <p className="text-xs text-gray-500 mb-4">Only .xlsx and .xls files are supported</p>
                    <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                      <div className="flex items-center">
                        <FiUpload className="w-4 h-4 mr-2" />
                        <span>Choose File</span>
                      </div>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            // Start upload process
                            setIsUploading(true);
                            setUploadProgress(0);

                            // Simulate upload progress
                            const interval = setInterval(() => {
                              setUploadProgress(prev => {
                                if (prev >= 100) {
                                  clearInterval(interval);
                                  setTimeout(() => {
                                    setIsUploading(false);
                                    setIsUploadPopupOpen(false);
                                    setUploadProgress(0);
                                    displayToast('Excel file uploaded successfully!');
                                  }, 500);
                                  return 100;
                                }
                                return prev + 10;
                              });
                            }, 200);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setIsUploadPopupOpen(false);
                        setIsUploading(false);
                        setUploadProgress(0);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Uploading Excel File</h4>
                    <p className="text-sm text-gray-600 mb-4">Please wait while we process your file...</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUCCESS TOAST NOTIFICATION */}
        {showToast && (
          <div className="fixed top-4 right-4 z-[1001] animate-in slide-in-from-top-2 duration-300">
            <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{toastMessage}</p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="flex-shrink-0 text-green-200 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </>
    </div>
  );
}
