// api.js or a similar file where your API calls are defined

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5049'; // Ensure this matches your backend URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = async (data) => {
  try {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  } catch (error) {
    console.error("Error registering user: ", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const login = async (data) => {
  try {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  } catch (error) {
    console.error("Error logging in: ", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getWorkItems = async () => {
  try {
    const response = await apiClient.get('/api/workitems');
    return response.data;
  } catch (error) {
    console.error("Error fetching work items: ", error);
    throw error;
  }
};

export const createWorkItem = async (data) => {
  try {
    const response = await apiClient.post('/api/workitems', data);
    return response.data;
  } catch (error) {
    console.error("Error creating work item: ", error);
    throw error;
  }
};

export const getClients = async () => {
  try {
    const response = await apiClient.get('/api/auth/users');
    return response.data;
  } catch (error) {
    console.error("Error fetching clients: ", error);
    throw error;
  }
};

export const getWorkItem = async (id) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/api/workitems/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching work item: ", error);
    throw error;
  }
};

export const updateWorkItem = async (id, data) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/api/workitems/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating work item: ", error);
    throw error;
  }
};

export const deleteWorkItem = async (id) => {
  try {
    await apiClient.delete(`${API_BASE_URL}/api/workitems/${id}`);
  } catch (error) {
    console.error("Error deleting work item: ", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/api/auth/currentuser');
    return response.data;
  } catch (error) {
    console.error("Error fetching current user: ", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await apiClient.post('/api/auth/logout');
    localStorage.removeItem('token');
  } catch (error) {
    console.error("Error logging out: ", error);
    throw error;
  }
};