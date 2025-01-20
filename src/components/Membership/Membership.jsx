import { Link } from "react-router-dom";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

export default function Membership() {
  const axiosPublic = useAxiosPublic();

  const { data: packages = [] } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axiosPublic.get("/packages");
      return res.data;
    },
  });

  console.log(packages);

  return (
    <div className="flex flex-col items-center my-12 px-4">
      <h2 className="text-4xl font-bold mb-8 text-primary">
        Upgrade to Premium
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
        Select the plan that fits your needs and enjoy exclusive benefits and
        features.
      </p>
      <div className="grid gap-8 md:grid-cols-3 w-full max-w-7xl">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="card w-full bg-white shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow mx-auto"
          >
            <div className="card-body text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {pkg.name} Package
              </h3>
              <p className="text-4xl font-bold text-primary mb-2">
                ${pkg.price}
                <span className="text-base text-gray-600">
                  /{pkg.billingPeriod}
                </span>
              </p>
              <p className="text-gray-600 my-4">{pkg.description}</p>
              <Link
                className="btn btn-primary w-full hover:bg-primary-focus"
                to={`/checkout/${pkg._id}`}
              >
                Select {pkg.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
