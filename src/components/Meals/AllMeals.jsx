import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";

const MealsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const axiosPublic = useAxiosPublic();

  // Using useInfiniteQuery for handling pagination
  const { data, fetchNextPage, refetch, hasNextPage } = useInfiniteQuery({
    queryKey: ["meals", searchQuery, category, priceRange],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosPublic.get("/all-meals", {
        params: {
          search: searchQuery,
          category,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          page: pageParam,
          limit: 5,
        },
      });

      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);

    refetch();
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  };

  const allMeals = data?.pages?.[0]?.map((meal) => meal) || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Meals Page</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search meals..."
          className="input input-bordered"
          value={searchQuery}
          onChange={handleSearch}
        />

        <select
          className="select select-bordered"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          <option value="dessert">Dessert</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Dinner">Dinner</option>
          <option value="Lunch">Lunch</option>
        </select>

        <div className="flex gap-2">
          <input
            type="number"
            name="min"
            placeholder="Min Price"
            className="input input-bordered"
            value={priceRange.min}
            onChange={handlePriceRangeChange}
          />
          <input
            type="number"
            name="max"
            placeholder="Max Price"
            className="input input-bordered"
            value={priceRange.max}
            onChange={handlePriceRangeChange}
          />
        </div>
      </div>

      {/* Meals List */}
      <InfiniteScroll
        dataLength={allMeals.length} // Total number of loaded meals
        next={() => {
          console.log("loading more meals");
          fetchNextPage();
        }} // Function to load more meals
        hasMore={!!hasNextPage} // Check if more data is available
        loader={
          <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        }
        endMessage={<p className="text-center">No more meals to show.</p>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allMeals ? (
            allMeals.map((meal) => (
              <div key={meal?._id} className="card bg-base-100 shadow-md">
                <figure>
                  <img
                    src={meal?.image}
                    alt={meal?.title}
                    className="w-full h-48 object-cover"
                  />
                </figure>
                <div className="card-body p-4">
                  <h2 className="card-title text-lg font-semibold">
                    {meal?.title}
                  </h2>
                  <p className="text-sm">{meal?.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold">${meal?.price}</span>
                    <span className="badge badge-secondary">
                      {meal?.category}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm">Rating: {meal?.rating}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-lg font-semibold text-gray-600">
              No meals found
            </p>
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default MealsPage;
