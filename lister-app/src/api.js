import axios from 'axios';

const API_BASE_URL = 'http://localhost:5049'; // Your backend base URL

// Get all work items
export const getWorkItems = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/workitems`);
  return response.data;
};

// Create a new work item
export const createWorkItem = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/api/workitems`, data);
  return response.data;
};

// Get a specific work item by ID
export const getWorkItem = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/api/workitems/${id}`);
  return response.data;
};

// Update a work item
export const updateWorkItem = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/api/workitems/${id}`, data);
  return response.data;
};

// Delete a work item
export const deleteWorkItem = async (id) => {
  await axios.delete(`${API_BASE_URL}/api/workitems/${id}`);
};

// Get all clients
export const getClients = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/clients`);
  return response.data;
};

// Create a new client
export const createClient = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/api/clients`, data);
  return response.data;
};

// Get a specific client by ID
export const getClient = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/api/clients/${id}`);
  return response.data;
};

// Update a client
export const updateClient = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/api/clients/${id}`, data);
  return response.data;
};

// Delete a client
export const deleteClient = async (id) => {
  await axios.delete(`${API_BASE_URL}/api/clients/${id}`);
};