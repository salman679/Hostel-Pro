import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useAuth } from "../../../contexts/AuthContext";
import moment from "moment";
import { useState } from "react";

export default function PaymentHistory() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: paymentHistory = [] } = useQuery({
    queryKey: ["paymentHistory"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payment-history/${user?.email}`);
      return res.data;
    },
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = paymentHistory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
            {currentPayments.length > 0 ? (
              currentPayments.map((payment) => (
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

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            className="btn btn-primary btn-sm mr-2"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`btn btn-sm ${
                currentPage === index + 1 ? "btn-active" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="btn btn-primary btn-sm ml-2"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
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
