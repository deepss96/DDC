import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  FiFileText,
  FiMessageSquare,
  FiSend,
  FiEdit2,
  FiCheck,
  FiX,
  FiCalendar,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import io from 'socket.io-client';
import config from '../config/config';
import { formatDateForInput, formatDateForDisplay, parseDisplayDate } from "../utils/dateUtils.jsx";

// Add wave animation for back button
const waveStyles = `
  @keyframes wave {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    50% { transform: translateX(3px); }
    75% { transform: translateX(-3px); }
  }
`;

// Inject wave animation styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = waveStyles;
  document.head.appendChild(styleSheet);
}

// Form Components - Similar to ProfilePage and TaskFormPopup
const InputField = ({ label, required, type = "text", value, onChange, placeholder, error, ...rest }) => (
  <div className="relative" style={{ marginBottom: 'var(--form-margin-bottom)' }}>
    <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600 uppercase tracking-wider z-10" style={{ fontFamily: 'var(--font-family)' }}>
      <span>
        {label}{required && <span style={{ color: 'var(--secondary-color)' }} className="ml-1">*</span>}
      </span>
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
        paddingTop: '16px',
        fontSize: 'var(--placeholder-font-size)',
        fontFamily: 'var(--font-family)',
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
      <p style={{ color: 'var(--secondary-color)', fontFamily: 'var(--font-family)', fontSize: '12px', marginTop: '4px' }}>
        {error}
      </p>
    )}
  </div>
);

const SelectField = ({ label, required, value, onChange, options, placeholder, error, ...rest }) => (
  <div className="relative" style={{ marginBottom: 'var(--form-margin-bottom)' }}>
    <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600 uppercase tracking-wider z-10" style={{ fontFamily: 'var(--font-family)' }}>
      <span>
        {label}{required && <span style={{ color: 'var(--secondary-color)' }} className="ml-1">*</span>}
      </span>
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          height: 'var(--input-height)',
          padding: 'var(--input-padding)',
          paddingTop: '16px',
          paddingRight: '40px',
          fontSize: 'var(--placeholder-font-size)',
          fontFamily: 'var(--font-family)',
          border: `1px solid ${error ? 'var(--secondary-color)' : 'var(--input-border-color)'}`,
          borderRadius: 'var(--input-border-radius)',
          backgroundColor: 'var(--input-bg-color)',
          color: 'var(--input-text-color)',
          outline: 'none',
          appearance: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => e.target.style.borderColor = error ? 'var(--secondary-color)' : 'var(--input-focus-border-color)'}
        onBlur={(e) => e.target.style.borderColor = error ? 'var(--secondary-color)' : 'var(--input-border-color)'}
        {...rest}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    {error && (
      <p style={{ color: 'var(--secondary-color)', fontFamily: 'var(--font-family)', fontSize: '12px', marginTop: '4px' }}>
        {error}
      </p>
    )}
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, ...rest }) => (
  <div className="relative" style={{ marginBottom: 'var(--form-margin-bottom)' }}>
    <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600 uppercase tracking-wider z-10" style={{ fontFamily: 'var(--font-family)' }}>
      <span>{label}</span>
    </label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      style={{
        width: '100%',
        padding: 'var(--input-padding)',
        paddingTop: '16px',
        fontSize: 'var(--placeholder-font-size)',
        fontFamily: 'var(--font-family)',
        border: '1px solid var(--input-border-color)',
        borderRadius: 'var(--input-border-radius)',
        backgroundColor: 'var(--input-bg-color)',
        color: 'var(--input-text-color)',
        outline: 'none',
        resize: 'vertical',
        minHeight: '80px',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => e.target.style.borderColor = 'var(--input-focus-border-color)'}
      onBlur={(e) => e.target.style.borderColor = 'var(--input-border-color)'}
      {...rest}
    />
  </div>
);

const DateInputField = ({ label, required, value, onChange, placeholder, error, readOnly = false }) => {
  const hiddenDateRef = useRef(null);

  const handleTextChange = (e) => {
    if (readOnly) return;
    const inputValue = e.target.value;
    const parsedValue = parseDisplayDate(inputValue);
    onChange({ target: { value: parsedValue } });
  };

  const handleDateChange = (e) => {
    if (readOnly) return;
    const selectedDate = e.target.value;
    onChange({ target: { value: selectedDate } });
  };

  const openDatePicker = () => {
    if (!readOnly && hiddenDateRef.current) {
      hiddenDateRef.current.showPicker();
    }
  };

  return (
    <div className="relative" style={{ marginBottom: 'var(--form-margin-bottom)' }}>
      <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600 uppercase tracking-wider z-10" style={{ fontFamily: 'var(--font-family)' }}>
        <span>
          {label}{required && <span style={{ color: 'var(--secondary-color)' }} className="ml-1">*</span>}
        </span>
      </label>

      {!readOnly && (
        <input
          ref={hiddenDateRef}
          type="date"
          value={value}
          onChange={handleDateChange}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px' }}
        />
      )}

      <div className="relative">
        <input
          type="text"
          value={formatDateForDisplay(value)}
          onChange={handleTextChange}
          placeholder={placeholder}
          readOnly={readOnly}
          style={{
            width: '100%',
            height: 'var(--input-height)',
            padding: 'var(--input-padding)',
            paddingTop: '16px',
            paddingRight: '40px',
            fontSize: 'var(--placeholder-font-size)',
            fontFamily: 'var(--font-family)',
            border: `1px solid ${error ? 'var(--secondary-color)' : 'var(--input-border-color)'}`,
            borderRadius: 'var(--input-border-radius)',
            backgroundColor: readOnly ? '#f9fafb' : 'var(--input-bg-color)',
            color: 'var(--input-text-color)',
            outline: 'none',
            transition: 'border-color 0.2s',
            cursor: readOnly ? 'default' : 'text',
          }}
          onFocus={(e) => e.target.style.borderColor = error ? 'var(--secondary-color)' : 'var(--input-focus-border-color)'}
          onBlur={(e) => e.target.style.borderColor = error ? 'var(--secondary-color)' : 'var(--input-border-color)'}
        />

        <div
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${readOnly ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}
          style={{ color: 'var(--input-text-color)' }}
          onClick={readOnly ? undefined : openDatePicker}
          title={readOnly ? "Auto-selected date" : "Select date"}
        >
          <FiCalendar size={16} />
        </div>
      </div>

      {error && (
        <p style={{ color: 'var(--secondary-color)', fontFamily: 'var(--font-family)', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </p>
      )}
    </div>
  );
};

const TaskInfo = ({ selectedTask, onClose }) => {
  if (!selectedTask) return null;

  const { user, token } = useAuth();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("overview");
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [postingComment, setPostingComment] = useState(false);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Map());

  // Task editing state
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editedTaskData, setEditedTaskData] = useState({});
  const [savingTask, setSavingTask] = useState(false);

  // PERFECT SCROLL REFS
  const chatContainerRef = useRef(null);
  const isUserScrollingRef = useRef(false);
  const wasNearBottomRef = useRef(true);
  const typingTimeoutRef = useRef(null);

  // ====== Utils ======
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDate = (dateString) => formatDateForDisplay(dateString);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-light-green-bg text-green-text border-green-200";
      case "Working":
        return "bg-light-primary-bg text-primary border-blue-200";
      case "New":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "On Hold":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-light-gray-bg text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Low":
        return "bg-light-green-bg text-green-text border-green-200";
      default:
        return "bg-light-gray-bg text-gray-700 border-gray-200";
    }
  };

  // oldest first (top), newest last (bottom)
  const sortByCreatedAt = (data) =>
    [...data].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

  // Check navigation state for comment notifications
  useEffect(() => {
    console.log('TaskInfo location state changed:', location.state);
    if (location.state?.activeTab === 'comments') {
      console.log('Setting active tab to comments from navigation state');
      setActiveTab('comments');
    } else if (location.state?.activeTab === 'overview' || !location.state?.activeTab) {
      console.log('Setting active tab to overview (default)');
      setActiveTab('overview');
    }
  }, [location.state]);

  // ====== PERFECT AUTO-SCROLL FUNCTIONS =====
  const scrollToBottom = useCallback(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  const isNearBottom = useCallback((threshold = 100) => {
    const el = chatContainerRef.current;
    if (!el) return false;
    return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

  const handleScroll = useCallback(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    
    // User upar scroll kiya hai
    isUserScrollingRef.current = !isNearBottom(200);
    
    // Previous state update karo
    wasNearBottomRef.current = isNearBottom(100);
  }, [isNearBottom]);

  // ====== Comments fetch (sirf initial / tab change par) ======
  const fetchComments = async () => {
    if (!selectedTask?.id) return;
    setLoadingComments(true);
    try {
      const data = await apiService.getCommentsByTask(selectedTask.id);
      setComments(sortByCreatedAt(data));
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Task change / comments tab open hone par load
  useEffect(() => {
    if (selectedTask?.id && activeTab === "comments") {
      fetchComments();
      // Reset scroll state for new task
      isUserScrollingRef.current = false;
      wasNearBottomRef.current = true;
    }
  }, [selectedTask?.id, activeTab]);

  // SCROLL LISTENER: Tab open hone par
  useEffect(() => {
    if (activeTab !== "comments") return;
    
    const el = chatContainerRef.current;
    if (!el) return;
    
    el.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial scroll to bottom
    requestAnimationFrame(() => {
      scrollToBottom();
      wasNearBottomRef.current = true;
      isUserScrollingRef.current = false;
    });
    
    return () => {
      el.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab, handleScroll, scrollToBottom]);

  // AUTO-SCROLL: Jab comments change ho (NEW MESSAGE)
  useEffect(() => {
    if (activeTab !== "comments" || !chatContainerRef.current) return;
    
    // Sirf tab auto-scroll karo jab:
    // - User bottom pe tha PEHLE
    // - Ya user manual scroll nahi kar raha
    if (wasNearBottomRef.current || !isUserScrollingRef.current) {
      requestAnimationFrame(() => {
        scrollToBottom();
        wasNearBottomRef.current = true;
        isUserScrollingRef.current = false;
      });
    }
  }, [comments, activeTab, scrollToBottom, isNearBottom]);

  // Socket.IO connection for real-time comments
  useEffect(() => {
    if (user && user.id && selectedTask?.id && activeTab === "comments") {
      console.log('🔌 Initializing Socket.IO connection for TaskInfo comments:', selectedTask.id);

      const socketConnection = io(config.socket.url, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      setSocket(socketConnection);

      socketConnection.on('connect', () => {
        console.log('✅ TaskInfo Socket.IO connected successfully:', socketConnection.id);
        // Join task-specific room for comments
        socketConnection.emit('join-task-room', selectedTask.id);
      });

      socketConnection.on('connect_error', (error) => {
        console.error('❌ TaskInfo Socket.IO connection error:', error);
      });

      socketConnection.on('disconnect', (reason) => {
        console.log('🔌 TaskInfo Socket.IO disconnected:', reason);
      });

      // Listen for real-time new comments
      socketConnection.on('new-comment', (data) => {
        console.log('💬 New comment received via Socket.IO:', data);
        const { comment, taskId } = data;

        // Only add if it's for this task and not from current user (to avoid duplicates)
        if (taskId === selectedTask.id && comment.user_id !== user.id) {
          setComments(prev => sortByCreatedAt([...prev, comment]));
        }
      });

      // Listen for typing indicators
      socketConnection.on('user-typing', (data) => {
        const { userId, userName, taskId, isTyping } = data;

        // Only show typing for this task and not for current user
        if (taskId === selectedTask.id && userId !== user.id) {
          setTypingUsers(prev => {
            const newMap = new Map(prev);
            if (isTyping) {
              newMap.set(userId, { userName, timestamp: Date.now() });
            } else {
              newMap.delete(userId);
            }
            return newMap;
          });
        }
      });

      // Cleanup on unmount or task change
      return () => {
        console.log('🔌 Cleaning up TaskInfo Socket.IO connection');
        socketConnection.emit('leave-task-room', selectedTask.id);
        socketConnection.disconnect();
      };
    }
  }, [user, selectedTask?.id, activeTab]);

  // Handle typing indicators
  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewComment(value);

    // Send typing start/stop events
    if (socket && selectedTask?.id) {
      if (value.trim() && !typingTimeoutRef.current) {
        // Start typing
        socket.emit('typing-start', {
          taskId: selectedTask.id,
          userId: user.id,
          userName: `${user.firstName} ${user.lastName}`
        });
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing after 1 second of no input
      typingTimeoutRef.current = setTimeout(() => {
        if (socket && selectedTask?.id) {
          socket.emit('typing-stop', {
            taskId: selectedTask.id,
            userId: user.id
          });
        }
        typingTimeoutRef.current = null;
      }, 1000);
    }
  };

  // Clean up typing indicators that are too old
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => {
        const newMap = new Map();
        for (const [userId, data] of prev) {
          if (now - data.timestamp < 5000) { // Remove after 5 seconds
            newMap.set(userId, data);
          }
        }
        return newMap;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ====== Send comment (local append, no refetch) ======
  const handleSendComment = async () => {
    if (!newComment.trim() || !token || !user) return;

    setPostingComment(true);
    try {
      // API call
      const saved = await apiService.createComment({
        task_id: selectedTask.id,
        message: newComment.trim(),
        parent_comment_id: replyingTo || null,
      });

      // Local state me smooth append (UI reload nahi hoga)
      const newItem = {
        id: saved?.id ?? Date.now(),
        userName: user ? `${user.firstName} ${user.lastName}`.trim() : 'Unknown User',
        message: newComment.trim(),
        created_at: saved?.created_at ?? new Date().toISOString(),
        replies: [],
      };

      setComments((prev) =>
        sortByCreatedAt([...prev, newItem])
      );

      setNewComment("");
      setReplyingTo(null);
      
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setPostingComment(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  // Task editing functions
  const startEditingTask = () => {
    setEditedTaskData({
      name: selectedTask.name,
      description: selectedTask.description,
      status: selectedTask.status,
      priority: selectedTask.priority,
      assignTo: selectedTask.assignTo,
      projectName: selectedTask.projectName,
      leadName: selectedTask.leadName,
      dueDate: selectedTask.dueDate
    });
    setIsEditingTask(true);
  };

  const cancelEditingTask = () => {
    setIsEditingTask(false);
    setEditedTaskData({});
  };

  const saveTask = async () => {
    setSavingTask(true);
    try {
      const updatedTask = {
        name: editedTaskData.name,
        description: editedTaskData.description,
        status: editedTaskData.status,
        priority: editedTaskData.priority,
        assignTo: editedTaskData.assignTo,
        assignBy: selectedTask.assignBy,
        projectName: editedTaskData.projectName,
        leadName: editedTaskData.leadName,
        dueDate: editedTaskData.dueDate
      };

      await apiService.updateTask(selectedTask.id, updatedTask);

      setIsEditingTask(false);
      setEditedTaskData({});

      console.log('Task updated successfully');

    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setSavingTask(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiFileText },
    { id: "comments", label: "Comments", icon: FiMessageSquare },
  ];

  return (
    <div className="bg-white rounded-xl overflow-hidden h-full sm:h-[calc(100vh-90px)] flex flex-col relative">
      {/* Tab Navigation - Top */}
      <div className="border-b-[2px] border-primary bg-white">
        <nav className="flex">
          <button
            onClick={onClose}
            className="flex items-center justify-center px-2 sm:px-3 py-1 text-sm font-medium text-white hover:text-gray-100 bg-gray-400 hover:bg-gray-450 transition-all duration-300"
            title="Go back"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-md animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                animation: 'wave 2.5s ease-in-out infinite'
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1 text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-white bg-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-light-gray-bg">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
            {selectedTask.name}
          </h2>
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
            Assigned to: {selectedTask.assignToName || selectedTask.assignTo}
          </span>
        </div>
        {!isEditingTask ? (
          <button
            onClick={startEditingTask}
            className="flex items-center gap-1 px-2 py-1 bg-primary text-white rounded hover:bg-blue-600 transition-colors text-xs"
            style={{ fontFamily: 'var(--font-family)' }}
          >
            <FiEdit2 size={12} />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={saveTask}
              disabled={savingTask}
              className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors text-xs"
              style={{ fontFamily: 'var(--font-family)' }}
            >
              {savingTask ? (
                <div className="animate-spin rounded-full h-2.5 w-2.5 border-b border-white"></div>
              ) : (
                <FiCheck size={12} />
              )}
              <span>{savingTask ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              onClick={cancelEditingTask}
              disabled={savingTask}
              className="flex items-center gap-1 px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition-colors text-xs"
              style={{ fontFamily: 'var(--font-family)' }}
            >
              <FiX size={12} />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className={`flex-1 overflow-hidden ${activeTab === "comments" ? "pb-20" : ""}`}>
        {activeTab === "overview" && (
          <div className="p-4 sm:p-6 overflow-auto h-full">
            {/* Mobile View - Vertical Card Stack */}
            <div className="block sm:hidden space-y-2" style={{ fontFamily: 'var(--font-family)' }}>
              {/* Task Name Card */}
              <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                <div className="flex flex-col space-y-2">
                  {isEditingTask ? (
                    <InputField
                      label="TASK NAME"
                      required
                      value={editedTaskData.name}
                      onChange={(e) => setEditedTaskData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter task name"
                    />
                  ) : (
                    <>
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Task Name
                      </span>
                      <span className="text-sm font-medium text-gray-900 break-words">
                        {selectedTask.name}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Status + Priority Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                  <div className="flex flex-col space-y-2">
                    {isEditingTask ? (
                      <SelectField
                        label="STATUS"
                        required
                        value={editedTaskData.status}
                        onChange={(value) => setEditedTaskData(prev => ({ ...prev, status: value }))}
                        options={[
                          { value: "New", label: "New" },
                          { value: "Working", label: "Working" },
                          { value: "Completed", label: "Completed" },
                          { value: "On Hold", label: "On Hold" },
                          { value: "Cancelled", label: "Cancelled" }
                        ]}
                        placeholder="Select status"
                      />
                    ) : (
                      <>
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          Status
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full w-fit ${getStatusColor(
                            selectedTask.status
                          )}`}
                        >
                          {selectedTask.status}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                  <div className="flex flex-col space-y-2">
                    {isEditingTask ? (
                      <SelectField
                        label="PRIORITY"
                        required
                        value={editedTaskData.priority}
                        onChange={(value) => setEditedTaskData(prev => ({ ...prev, priority: value }))}
                        options={[
                          { value: "Low", label: "Low" },
                          { value: "Medium", label: "Medium" },
                          { value: "High", label: "High" }
                        ]}
                        placeholder="Select priority"
                      />
                    ) : (
                      <>
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          Priority
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full w-fit ${getPriorityColor(
                            selectedTask.priority
                          )}`}
                        >
                          {selectedTask.priority}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Assigned By + Assigned To Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                  <div className="flex flex-col space-y-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Assigned By
                    </span>
                    <span className="text-sm font-medium text-gray-900 break-words">
                      {selectedTask.assignByName || selectedTask.assignBy}
                    </span>
                  </div>
                </div>

                <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                  <div className="flex flex-col space-y-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Assigned To
                    </span>
                    <span className="text-sm font-medium text-gray-900 break-words">
                      {selectedTask.assignToName || selectedTask.assignTo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Name + Lead Name Row - Only show if they have values */}
              {(selectedTask.projectName && selectedTask.projectName !== "N/A") ||
               (selectedTask.leadName && selectedTask.leadName !== "N/A") ? (
                <div className="grid grid-cols-2 gap-3">
                  {selectedTask.projectName && selectedTask.projectName !== "N/A" && (
                    <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                      <div className="flex flex-col space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          Project Name
                        </span>
                        <span className="text-sm font-medium text-gray-900 break-words">
                          {selectedTask.projectName}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedTask.leadName && selectedTask.leadName !== "N/A" && (
                    <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                      <div className="flex flex-col space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          Lead Name
                        </span>
                        <span className="text-sm font-medium text-gray-900 break-words">
                          {selectedTask.leadName}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Due Date + Created Date Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                  <div className="flex flex-col space-y-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Due Date
                    </span>
                    <span className="text-sm font-medium text-gray-900 break-words">
                      {formatDate(selectedTask.dueDate)}
                    </span>
                  </div>
                </div>

                <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                  <div className="flex flex-col space-y-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Created Date
                    </span>
                    <span className="text-sm font-medium text-gray-900 break-words">
                      {formatDate(selectedTask.createdDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Card - Full Width */}
              <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                <div className="flex flex-col space-y-2">
                  {isEditingTask ? (
                    <TextAreaField
                      label="DESCRIPTION"
                      value={editedTaskData.description}
                      onChange={(e) => setEditedTaskData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter task description"
                    />
                  ) : (
                    <>
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Description
                      </span>
                      <span className="text-sm text-gray-900 break-words">
                        {selectedTask.description || "N/A"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop/Tablet View - Custom Grid Layout */}
            <div className="hidden sm:block" style={{ fontFamily: 'var(--font-family)' }}>
              <div className="space-y-2 sm:space-y-3">
                {/* Row 1: Task Name + Description (side by side) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                    {isEditingTask ? (
                      <InputField
                        label="TASK NAME"
                        required
                        value={editedTaskData.name}
                        onChange={(e) => setEditedTaskData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter task name"
                      />
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          Task Name
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedTask.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                    {isEditingTask ? (
                      <TextAreaField
                        label="DESCRIPTION"
                        value={editedTaskData.description}
                        onChange={(e) => setEditedTaskData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter task description"
                      />
                    ) : (
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium mr-4">
                          Description
                        </span>
                        <span className="text-sm text-gray-900 flex-1">
                          {selectedTask.description || "N/A"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2: Status + Priority */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                    {isEditingTask ? (
                      <SelectField
                        label="STATUS"
                        required
                        value={editedTaskData.status}
                        onChange={(value) => setEditedTaskData(prev => ({ ...prev, status: value }))}
                        options={[
                          { value: "New", label: "New" },
                          { value: "Working", label: "Working" },
                          { value: "Completed", label: "Completed" },
                          { value: "On Hold", label: "On Hold" },
                          { value: "Cancelled", label: "Cancelled" }
                        ]}
                        placeholder="Select status"
                      />
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          Status
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            selectedTask.status
                          )}`}
                        >
                          {selectedTask.status}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                    {isEditingTask ? (
                      <SelectField
                        label="PRIORITY"
                        required
                        value={editedTaskData.priority}
                        onChange={(value) => setEditedTaskData(prev => ({ ...prev, priority: value }))}
                        options={[
                          { value: "Low", label: "Low" },
                          { value: "Medium", label: "Medium" },
                          { value: "High", label: "High" }
                        ]}
                        placeholder="Select priority"
                      />
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          Priority
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                            selectedTask.priority
                          )}`}
                        >
                          {selectedTask.priority}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 3: Assigned By + Assigned To */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Assigned By
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedTask.assignByName || selectedTask.assignBy}
                      </span>
                    </div>
                  </div>

                  <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Assigned To
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedTask.assignToName || selectedTask.assignTo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 4: Project Name + Lead Name */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Project Name
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedTask.projectName || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Lead Name
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedTask.leadName || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 5: Due Date + Created Date */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Due Date
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(selectedTask.dueDate)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-light-gray-bg rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Created Date
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(selectedTask.createdDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="flex flex-col h-full min-h-0 relative">
            {/* Chat Messages - PERFECT SCROLL CONTAINER */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50"
              style={{
                scrollBehavior: "smooth",
                paddingBottom: "4rem",
              }}
            >
              {loadingComments ? (
                <div className="flex justify-center items-center py-6 sm:py-8">
                  <div className="text-sm text-gray-500">Loading comments...</div>
                </div>
              ) : comments.length === 0 ? (
                <div className="flex justify-center items-center py-6 sm:py-8">
                  <div className="text-sm text-gray-500 text-center px-4">
                    No comments yet. Start the conversation!
                  </div>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    {/* Main Comment */}
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium flex-shrink-0">
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {comment.userName}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatTime(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 break-words">
                            {comment.message}
                          </p>
                        </div>
                        <button
                          onClick={() => setReplyingTo(comment.id)}
                          className="text-xs text-primary hover:text-blue-600 mt-1 ml-2 sm:ml-3"
                        >
                          Reply
                        </button>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies &&
                      comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2 sm:gap-3 ml-8 sm:ml-11">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                            {reply.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="bg-gray-100 rounded-lg p-2 shadow-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-900 truncate">
                                  {reply.userName}
                                </span>
                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                  {formatTime(reply.created_at)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 break-words">
                                {reply.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat Input - Fixed at bottom when comments tab is active */}
      {activeTab === "comments" && (
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
          {/* Typing Indicators */}
          {typingUsers.size > 0 && (
            <div className="px-3 sm:px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
              {Array.from(typingUsers.values()).map((user, index) => (
                <span key={index} className="inline-flex items-center">
                  <span className="font-medium">{user.userName}</span>
                  <span className="ml-1">is typing</span>
                  {index < typingUsers.size - 1 && <span className="mx-1">,</span>}
                </span>
              ))}
              <span className="ml-1 animate-pulse">...</span>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 sm:p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={handleSendComment}
                disabled={!newComment.trim() || postingComment}
                className="px-3 sm:px-4 py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <FiSend size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskInfo;
