import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { QuotationItems } from './pages/QuotationItems';
import { CustomerSelect } from './pages/CustomerSelect';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/quotations" element={<QuotationItems />} />
          <Route path="/quotations/customer-select" element={<CustomerSelect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;