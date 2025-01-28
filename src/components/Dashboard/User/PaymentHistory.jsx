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
      <h2 className="text-xl font-bold text-center mb-6">Payment History</h2>

      <div className="overflow-x-auto hidden md:block">
        <table className="table w-full border-collapse">
          <thead className="bg-gray-200 text-center">
            <tr>
              <th className="p-4">Package Name</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Transaction ID</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {paymentHistory.length > 0 ? (
              paymentHistory.map((payment) => (
                <tr
                  key={payment._id}
                  className="hover:bg-gray-100 transition-all duration-200"
                >
                  <td className="p-4">{payment.subscription}</td>
                  <td className="p-4">${payment.price}</td>
                  <td className="p-4">{payment.transactionId}</td>
                  <td className="p-4">
                    {moment(payment.date).format("MMMM D, YYYY")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-gray-500 text-center">
                  No payment history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile-friendly view */}
      <div className="md:hidden">
        {paymentHistory.length > 0 ? (
          paymentHistory.map((payment) => (
            <div
              key={payment._id}
              className="p-4 border rounded-lg mb-4 shadow-md bg-gray-50"
            >
              <p>
                <span className="font-bold">Package:</span>{" "}
                {payment.subscription}
              </p>
              <p>
                <span className="font-bold">Amount:</span> ${payment.price}
              </p>
              <p>
                <span className="font-bold">Transaction ID:</span>{" "}
                {payment.transactionId}
              </p>
              <p>
                <span className="font-bold">Date:</span>{" "}
                {moment(payment.date).format("MMMM D, YYYY")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No payment history found.</p>
        )}
      </div>
    </div>
  );
}
