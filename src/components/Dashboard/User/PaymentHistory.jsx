import { useEffect, useState } from "react";

export default function PaymentHistory() {
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    const fetchPaymentHistory = () => {
      setPaymentHistory([
        {
          id: 1,
          amount: "$25",
          date: "2025-01-01",
          description: "Meal Purchase",
        },
        {
          id: 2,
          amount: "$15",
          date: "2025-01-10",
          description: "Meal Purchase",
        },
      ]);
    };
    fetchPaymentHistory();
  }, []);
  return (
    <div className="card bg-white shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Payment History</h2>
      {paymentHistory.length > 0 ? (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.amount}</td>
                <td>{payment.date}</td>
                <td>{payment.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payment history found.</p>
      )}
    </div>
  );
}
