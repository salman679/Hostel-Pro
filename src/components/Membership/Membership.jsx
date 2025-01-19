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

  return (
    <div className="flex flex-col items-center my-10">
      <h2 className="text-3xl font-bold mb-6">Upgrade to Premium</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="card w-80 bg-base-100 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow"
          >
            <div className="card-body text-center">
              <h3 className="text-2xl font-semibold">{pkg.name} Package</h3>
              <p className="text-xl font-bold text-primary">{pkg.price}</p>
              <p className="text-gray-600 my-4">{pkg.description}</p>
              <Link
                className="btn btn-primary w-full"
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
