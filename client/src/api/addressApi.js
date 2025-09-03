// client/src/api/addressApi.js
import axios from 'axios';

const BASE_URL = 'https://qwipo-interview-assignment.onrender.com/api';

// Create a new address for a customer
export const createAddress = (customerId, data) => {
  return axios.post(`${BASE_URL}/customers/${customerId}/addresses`, data);
};

// Get all addresses for a customer
export const getAddressesByCustomer = (customerId) => {
  return axios.get(`${BASE_URL}/customers/${customerId}/addresses`);
};

// Update a specific address
export const updateAddress = (addressId, data) => {
  return axios.put(`${BASE_URL}/addresses/${addressId}`, data);
};

// Delete a specific address
export const deleteAddress = (addressId) => {
  return axios.delete(`${BASE_URL}/addresses/${addressId}`);
};
