import { useNavigate } from "react-router-dom";

export default function Membership() {
  const navigate = useNavigate();

  const handleCheckout = (packageName) => {
    navigate(`/checkout/${packageName}`);
  };

  const packages = [
    {
      name: "Silver",
      price: "$10/month",
      description: "Basic plan with essential features.",
    },
    {
      name: "Gold",
      price: "$20/month",
      description: "Advanced plan with premium features.",
    },
    {
      name: "Platinum",
      price: "$30/month",
      description: "All-inclusive plan with exclusive benefits.",
    },
  ];

  return (
    <div className="flex flex-col items-center my-10">
      <h2 className="text-3xl font-bold mb-6">Upgrade to Premium</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="card w-80 bg-base-100 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow"
          >
            <div className="card-body text-center">
              <h3 className="text-2xl font-semibold">{pkg.name} Package</h3>
              <p className="text-xl font-bold text-primary">{pkg.price}</p>
              <p className="text-gray-600 my-4">{pkg.description}</p>
              <button
                className="btn btn-primary w-full"
                onClick={() => handleCheckout(pkg.name.toLowerCase())}
              >
                Select {pkg.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
