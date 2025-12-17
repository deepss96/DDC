import React, { useState, useEffect } from "react";
import { useTranslation } from "../services/translationService.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import apiService from "../services/api.js";
import { formatDateForDisplay } from "../utils/dateUtils.jsx";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Completed': 'bg-green-100 text-green-700',
      'Delayed': 'bg-yellow-100 text-yellow-700',
      'At Risk': 'bg-red-100 text-red-700',
      'Ongoing': 'bg-orange-100 text-orange-700',
      'Pending': 'bg-gray-100 text-gray-700',
      'In Progress': 'bg-blue-100 text-blue-700'
    };

    return statusConfig[status] || 'bg-gray-100 text-gray-700';
  };

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      // Wait for user to be loaded with role
      if (!user?.id || !user?.role) {
        console.log('DASHBOARD DEBUG: Waiting for user data - id:', user?.id, 'role:', user?.role);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Admin can see all tasks, other users see only their related tasks
        const isAdmin = user?.role?.toLowerCase() === 'admin';
        const params = isAdmin ? {} : { user_id: user.id };

        console.log('DASHBOARD DEBUG: User role:', user?.role, 'isAdmin:', isAdmin, 'params:', params);

        const taskData = await apiService.getTasks(params);

        console.log('DASHBOARD DEBUG: Fetched tasks:', taskData);

        setTasks(taskData);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user?.id, user?.role]);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-auto px-4 sm:px-6 py-4 space-y-4 md:pb-4 pb-24">

          {/* ===== SAME GRID – SIZE UNCHANGED ===== */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4">

            {/* ================= LEFT — OPEN LEADS (HIDDEN) ================= */}
            {/*
            <div className="bg-white rounded-xl border border-gray-400 p-3 sm:p-4 shadow-sm">
              Open Leads Card
            </div>
            */}

            {/* ================= MIDDLE — MY TASK (VISIBLE) ================= */}
            <div className="bg-white rounded-xl border border-gray-400 p-3 sm:p-4 shadow-sm hover:shadow-lg transition-shadow duration-300 h-96 flex flex-col">

              {/* Error Message */}
              {error && (
                <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-800">
                  {user?.role?.toLowerCase() === 'admin' ? 'All Tasks' : 'My Task'}
                </h2>
              </div>

              <div className="flex-1 overflow-hidden">
                <table className="w-full text-left text-xs sm:text-[13px]">
                  <thead className="bg-white">
                    <tr className="border-b">
                      <th className="py-2 px-1">Task Name</th>
                      <th className="py-2 px-1">Due Date</th>
                      <th className="py-2 px-1">Status</th>
                    </tr>
                  </thead>
                </table>

                <div className="overflow-y-auto max-h-72">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2 text-sm text-gray-500">Loading tasks...</span>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs sm:text-[13px]">
                      <tbody className="text-gray-700">
                        {tasks.length > 0 ? tasks.map((task, index) => (
                          <tr key={task.id} className={index < tasks.length - 1 ? "border-b" : ""}>
                            <td className="py-2 px-1">{task.name}</td>
                            <td className="py-2 px-1">{formatDateForDisplay(task.dueDate || task.due_date)}</td>
                            <td className="py-2 px-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadge(task.status)}`}>
                                {task.status}
                              </span>
                            </td>
                          </tr>
                        )) : (
                          // Empty state when no tasks
                          <tr>
                            <td colSpan="3" className="py-8 px-1 text-center text-gray-500">
                              <div className="text-sm">No tasks found</div>
                              <div className="text-xs mt-1">Tasks from the database will appear here</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* ================= RIGHT — PROJECT SUMMARY (HIDDEN) ================= */}
            {/*
            <div className="bg-white rounded-xl border border-gray-400 p-3 sm:p-4 shadow-sm">
              Project Summary Card
            </div>
            */}

          </div>

          {/* ===== नीचे वाले grids भी SAME SIZE के साथ HIDDEN ===== */}

          {/*
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
            Material Request
            Recent Transaction
          </div>
          */}

        </main>
      </div>
    </div>
  );
}
