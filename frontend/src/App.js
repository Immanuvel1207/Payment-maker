import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import CreatePayment from './components/CreatePayment';
import Pay from './components/Pay';
import MyPayments from './components/MyPayments';
import PaymentDetails from './components/PaymentDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-payment" element={<CreatePayment />} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/my-payments" element={<MyPayments />} />
          <Route path="/payment-details/:paymentCode" element={<PaymentDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

