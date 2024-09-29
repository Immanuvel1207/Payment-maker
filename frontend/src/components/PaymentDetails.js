import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const PaymentDetails = ({ token }) => {
    const [code, setCode] = useState('');
    const [paymentDetails, setPaymentDetails] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`http://localhost:5000/api/payments/details/${code}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPaymentDetails(res.data);
        } catch (err) {
            alert('Error fetching payment details');
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Payment Details', 10, 10);
        doc.text(`Amount: ${paymentDetails.amount}`, 10, 20);
        doc.text(`Status: ${paymentDetails.status}`, 10, 30);
        doc.text(`Received Payments: ${paymentDetails.paidUsers.length}`, 10, 40);
        paymentDetails.paidUsers.forEach((user, index) => {
            doc.text(`${index + 1}. ${user.name} (Roll No: ${user.rollno}) - Paid on: ${new Date(user.paymentTime).toLocaleString()}`, 10, 50 + index * 10);
        });
        doc.save('payment-details.pdf');
    };

    return (
        <div className="container">
            <h2>Enter Payment Code</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter Payment Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <button type="submit">Get Details</button>
            </form>

            {paymentDetails && (
                <div className="payment-details">
                    <h3>Payment Details</h3>
                    <p>Amount: {paymentDetails.amount}</p>
                    <p>Status: {paymentDetails.status}</p>
                    <p>Received: {paymentDetails.paidUsers.length} Payments</p>
                    <ul>
                        {paymentDetails.paidUsers.map((user, index) => (
                            <li key={index}>
                                {user.name} (Roll No: {user.rollno}) - Paid on: {new Date(user.paymentTime).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                    <button onClick={downloadPDF}>Download PDF</button>
                </div>
            )}
        </div>
    );
};

export default PaymentDetails;
