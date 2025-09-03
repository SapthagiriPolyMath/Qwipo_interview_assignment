// customerApi.js
import axios from 'axios';
const BASE_URL = 'https://qwipo-interview-assignment.onrender.com/api';

// Get all customers with optional query parameters
export const getCustomers = (params = {}) => {
    return axios.get(`${BASE_URL}/customers`, { params });
  };

// Get a customer by ID
export const getCustomerById = (id) => axios.get(`${BASE_URL}/customers/${id}`);

// Create a new customer
export const createCustomer = (data) => axios.post(`${BASE_URL}/customers`, data);

// Update an existing customer
export const updateCustomer = (id, data) => axios.put(`${BASE_URL}/customers/${id}`, data);

// Delete a customer by ID
export const deleteCustomer = (id) => axios.delete(`${BASE_URL}/customers/${id}`);
