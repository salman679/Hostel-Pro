import { useNavigate, useParams } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useAuth } from "../../contexts/AuthContext";

export default function CheckoutPage() {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientSecret] = useState("");
  const { user } = useAuth();
  const { id } = useParams();
  const stripe = useStripe();
  const elements = useElements();

  const Navigate = useNavigate();

  const { data: packageData = {} } = useQuery({
    queryKey: ["packages", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/packages/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    axiosSecure
      .post("/create-payment-intent", {
        price: packageData.price,
      })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      });
  }, [packageData, axiosSecure]);

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

    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error.message,
      });

      return;
    }
    //confirm payment
    const { paymentIntent, error: paymentError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email,
            name: user?.displayName,
          },
        },
      });

    if (paymentError) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: paymentError.message,
      });
    } else if (paymentIntent.status === "succeeded") {
      const payment = {
        price: packageData.price,
        subscription: packageData.name,
        transactionId: paymentIntent.id,
        email: user?.email,
        name: user?.displayName,
        date: new Date(),
        packageId: id,
      };

      await axiosSecure.post("/payments", payment).then((res) => {
        if (res.data.insertedId) {
          Navigate("/");
          Swal.fire({
            icon: "success",
            title: "Payment Successful",
            text: "Your payment has been processed successfully!",
          });
        }
      });
    }
  };

  if (!packageData) {
    return <span className="loading loading-dots loading-md"></span>;
  }

  return (
    <div className="container mx-auto my-16 p-6 bg-white shadow-lg rounded-lg max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Checkout for <span className="text-primary">{packageData.name}</span>
      </h1>
      <p className="text-lg text-gray-700 text-center mb-4">
        Price: <span className="font-semibold">${packageData.price}</span>
        <span className="font-semibold">/{packageData.billingPeriod}</span>
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
          disabled={!stripe || !elements || !clientSecret}
          className={`btn btn-primary w-full ${!stripe && "btn-disabled"}`}
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}
