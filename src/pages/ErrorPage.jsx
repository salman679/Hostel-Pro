import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      {/* Error Image */}
      {/* <img
        src="https://via.placeholder.com/400x300?text=Error+Image"
        alt="Error Illustration"
        className="w-80 mb-6"
      /> */}
      {/* Error Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Oops! Something Went Wrong
      </h1>
      {/* Error Description */}
      <p className="text-lg text-gray-600 mb-6">
        We couldn’t find the page you’re looking for, or something went wrong.
        Please try again later.
      </p>
      {/* Back to Home Button */}
      <Link to="/" className="btn btn-primary">
        Go Back to Home
      </Link>
    </div>
  );
}
