import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useAuth } from "../../../contexts/AuthContext";
import moment from "moment";

export default function PaymentHistory() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: paymentHistory = [] } = useQuery({
    queryKey: ["paymentHistory"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payment-history/${user?.email}`);
      return res.data;
    },
  });

  return (
    <div className="card bg-white shadow-lg p-6">
      <h2 className="text-xl font-bold  text-center mb-6">Payment History</h2>

      <table className="table w-full">
        <thead className="bg-gray-200 text-center">
          <tr>
            <th>Package Name</th>
            <th>Amount</th>
            <th>Transaction ID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {paymentHistory.length > 0 ? (
            paymentHistory.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.subscription}</td>
                <td>${payment.price}</td>
                <td>{payment.transactionId}</td>
                <td>{moment(payment.date).format("MMMM D, YYYY")}</td>
              </tr>
            ))
          ) : (
            <p>No payment history found.</p>
          )}
        </tbody>
      </table>
    </div>
  );
}
