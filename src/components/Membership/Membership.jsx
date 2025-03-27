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
    // <div className="flex flex-col items-center my-12 px-4">
    //   <h2 className="text-4xl font-bold mb-8 ">Upgrade to Premium</h2>
    //   <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
    //     Select the plan that fits your needs and enjoy exclusive benefits and
    //     features.
    //   </p>
    //   <div className="grid gap-8 md:grid-cols-3 w-full max-w-7xl">
    //     {packages.map((pkg) => (
    //       <div
    //         key={pkg._id}
    //         className="card w-full bg-white shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow mx-auto"
    //       >
    //         <div className="card-body text-center">
    //           <h3 className="text-2xl font-semibold text-gray-800 mb-2">
    //             {pkg.name} Package
    //           </h3>
    //           <p className="text-4xl font-bold text-green-500 mb-2">
    //             ${pkg.price}
    //             <span className="text-base text-gray-600">
    //               /{pkg.billingPeriod}
    //             </span>
    //           </p>
    //           <p className="text-gray-600 my-4">{pkg.description}</p>
    //           <Link
    //             className="btn btn-green w-full hover:bg-green-600 hover:text-white focus:bg-green-600 focus:shadow-focus"
    //             to={`/checkout/${pkg._id}`}
    //           >
    //             Select {pkg.name}
    //           </Link>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>

    <section className="py-10 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Meal Plans
        </h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-2">
          Choose a plan that fits your needs and enjoy hassle-free meals every
          day
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {packages.map((pkg, index) => (
            <div
              key={pkg._id}
              className={`rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md ${
                index === 1 ? "md:transform md:scale-105 md:shadow-md" : ""
              }`}
            >
              <div
                className={`p-4 sm:p-6 ${
                  index === 1
                    ? "bg-primary text-white"
                    : "bg-secondary text-primary"
                }`}
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-1">
                  {pkg.name}
                </h3>
                <div className="flex items-end">
                  <span className="text-2xl sm:text-3xl font-bold">
                    ${pkg.price}
                  </span>
                  <span className="ml-1 text-xs sm:text-sm opacity-80">
                    /{pkg.period}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-white">
                <ul className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
                  {pkg?.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-sm sm:text-base text-gray-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/checkout/${pkg._id}`}
                  className={`block w-full text-center py-2 sm:py-3 rounded-md font-medium text-sm sm:text-base ${
                    index === 1
                      ? "bg-primary hover:bg-green-700 text-white"
                      : "bg-secondary hover:bg-green-100 text-primary"
                  }`}
                >
                  Choose Plan
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
