// src/App.js
import { Routes, Route } from 'react-router-dom';
import CustomerListPage from './pages/CustomerListPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CustomerFormPage from './pages/CustomerFormPage';
import './App.css';

const App =()=> {
  return (
    <Routes>
      <Route path="/" element={<CustomerListPage />} />
      {/*<Route path="/customers/:id" element={<CustomerDetailPage />} />
      <Route path="/customers/new" element={<CustomerFormPage />} />
      <Route path="/customers/:id/edit" element={<CustomerFormPage />}/>*/}
    </Routes>
  );
}

export default App;
