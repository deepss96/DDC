import config from '../config/config';

// API Service with centralized configuration
class ApiService {
  constructor() {
    this.timeout = config.api.timeout;
  }

  // Dynamic baseUrl method for runtime evaluation
  getBaseUrl() {
    const apiUrl = config.api.baseUrl;
    console.log('API URL:', apiUrl);
    return apiUrl;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Generic fetch method with error handling
  async request(endpoint, options = {}) {
    const url = `${this.getBaseUrl()}${endpoint}`;
    console.log('API Request URL:', url); // Debug logging

    const defaultOptions = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        // Try to get error data from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorData = null;

        try {
          errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          // If we can't parse the error response, use status-based messages
          switch (response.status) {
            case 400:
              errorMessage = 'Invalid request. Please check your input.';
              break;
            case 401:
              errorMessage = 'Invalid credentials. Please check your username and password.';
              break;
            case 403:
              errorMessage = 'Access denied. You do not have permission to perform this action.';
              break;
            case 404:
              errorMessage = 'The requested resource was not found.';
              break;
            case 409:
              errorMessage = 'This action conflicts with existing data.';
              break;
            case 422:
              errorMessage = 'Validation failed. Please check your input.';
              break;
            case 429:
              errorMessage = 'Too many requests. Please try again later.';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            default:
              errorMessage = 'An unexpected error occurred. Please try again.';
          }
        }

        // Create error with response data attached
        const error = new Error(errorMessage);
        error.response = { data: errorData, status: response.status };
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async forgotPassword(emailData) {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(emailData)
    });
  }

  async getProfile() {
    return this.request('/api/auth/profile');
  }

  // Task endpoints
  async getTasks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/api/tasks?${queryString}` : '/api/tasks';
    return this.request(endpoint);
  }

  async getTaskById(id) {
    return this.request(`/api/tasks/${id}`);
  }

  async createTask(taskData) {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  async updateTask(id, taskData) {
    return this.request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  }

  async deleteTask(id) {
    return this.request(`/api/tasks/${id}`, {
      method: 'DELETE'
    });
  }

  async getNextTaskNumber() {
    return this.request('/api/tasks/next-number');
  }

  // Comment endpoints
  async getCommentsByTask(taskId) {
    return this.request(`/api/comments/task/${taskId}`);
  }

  async createComment(commentData) {
    return this.request('/api/comments', {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  async updateComment(id, commentData) {
    return this.request(`/api/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(commentData)
    });
  }

  async deleteComment(id) {
    return this.request(`/api/comments/${id}`, {
      method: 'DELETE'
    });
  }

  // User endpoints
  async getUsers() {
    return this.request('/api/users');
  }

  async createUser(userData) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(id, userData) {
    return this.request(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id) {
    return this.request(`/api/users/${id}`, {
      method: 'DELETE'
    });
  }

  // Lead endpoints
  async getLeads() {
    return this.request('/api/leads');
  }

  async createLead(leadData) {
    return this.request('/api/leads', {
      method: 'POST',
      body: JSON.stringify(leadData)
    });
  }

  async updateLead(id, leadData) {
    return this.request(`/api/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData)
    });
  }

  async deleteLead(id) {
    return this.request(`/api/leads/${id}`, {
      method: 'DELETE'
    });
  }

  // Notification endpoints
  async getNotifications() {
    return this.request('/api/notifications');
  }

  async getUnreadNotificationCount() {
    return this.request('/api/notifications/unread-count');
  }

  async markNotificationAsRead(notificationId) {
    return this.request(`/api/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/api/notifications/mark-all-read', {
      method: 'PUT'
    });
  }

  async deleteNotification(notificationId) {
    return this.request(`/api/notifications/${notificationId}`, {
      method: 'DELETE'
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
