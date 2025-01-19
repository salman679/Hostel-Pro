import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";

export default function CheckoutPage() {
  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axiosPublic.get(`/packages/${id}`);
        setPackageDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch package details:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load package details. Please try again later.",
        });
      }
    };

    fetchPackageDetails();
  }, [id, axiosPublic]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);

    if (!card) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "Please enter valid card details.",
      });
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error.message,
      });
    } else {
      try {
        const response = await axiosPublic.post("/api/payment", {
          paymentMethodId: paymentMethod.id,
          packageId: packageDetails._id,
        });

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Payment Successful",
            text: "Your package has been activated successfully!",
          });

          // Optionally: Trigger user badge update here
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Payment Processing Error",
          text: "Something went wrong while processing your payment. Please try again.",
        });
      }
    }
  };

  if (!packageDetails) return <div>Loading package details...</div>;

  return (
    <div className="container mx-auto my-16 p-6 bg-white shadow-lg rounded-lg max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Checkout for <span className="text-primary">{packageDetails.name}</span>
      </h1>
      <p className="text-lg text-gray-700 text-center mb-4">
        Price: <span className="font-semibold">${packageDetails.price}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-gray-700">
              Card Details
            </span>
          </label>
          <div className="p-4 border rounded-lg bg-gray-100">
            <CardElement className="w-full focus:outline-none" />
          </div>
        </div>
        <button
          type="submit"
          disabled={!stripe}
          className={`btn btn-primary w-full ${!stripe && "btn-disabled"}`}
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}
