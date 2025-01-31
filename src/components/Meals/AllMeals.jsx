import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";
import InfiniteScroll from "react-infinite-scroller";

const MealsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const axiosPublic = useAxiosPublic();

  // Fetch meals with pagination using infiniteQuery
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ["meals", searchQuery, category, priceRange],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosPublic("/all-meals", {
          params: {
            search: searchQuery,
            category: category,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            page: pageParam, // New: Pagination
            limit: 6, // Load 6 meals per request
          },
        });

        return response.data;
      },
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 6 ? allPages.length + 1 : undefined;
      },
    });

  // Flatten paginated meals data
  const meals = data?.pages.flat() || [];

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-gray-700 mb-8">
        Meals Page
      </h1>

      {/* Filters Section */}
      <div className="mb-8 space-y-4">
        <div className="form-control">
          <label htmlFor="search" className="label font-semibold">
            Search Meals
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search meals..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="flex justify-center space-x-4">
          <div className="form-control w-1/3">
            <label htmlFor="category" className="label font-semibold">
              Category
            </label>
            <select
              id="category"
              className="select select-bordered w-full"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              <option value="dessert">Dessert</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Dinner">Dinner</option>
              <option value="Lunch">Lunch</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <div className="form-control w-3/6">
              <label htmlFor="min-price" className="label font-semibold">
                Min Price
              </label>
              <input
                id="min-price"
                type="number"
                name="min"
                value={priceRange.min}
                onChange={handlePriceRangeChange}
                className="input input-bordered w-full"
                min={0}
              />
            </div>

            <div className="form-control w-3/6">
              <label htmlFor="max-price" className="label font-semibold">
                Max Price
              </label>
              <input
                id="max-price"
                type="number"
                name="max"
                value={priceRange.max}
                onChange={handlePriceRangeChange}
                className="input input-bordered w-full"
                min={0}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meals List with Infinite Scroll */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner loading-lg text-gray-700"></span>
        </div>
      ) : isError ? (
        <p className="text-center text-lg font-semibold text-red-600">
          Failed to load meals
        </p>
      ) : (
        <InfiniteScroll
          pageStart={0}
          loadMore={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <div className="text-center my-4">
              <span className="loading loading-spinner text-gray-700"></span>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.length > 0 ? (
              meals.map((meal) => (
                <div
                  key={meal?._id}
                  className="card bg-white hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <figure>
                    <img
                      src={meal?.image}
                      alt={meal?.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </figure>
                  <div className="card-body p-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {meal?.title}
                    </h2>
                    <p className="text-sm text-gray-600">{meal?.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold text-gray-800">
                        ${meal?.price}
                      </span>
                      <span className="badge badge-secondary">
                        {meal?.category}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm mt-2 text-gray-600">
                        Rating: {meal?.rating}
                      </p>
                    </div>
                    <Link
                      to={`/meals/${meal?._id}`}
                      className="right-4 bottom-2 absolute"
                    >
                      <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                        View Details
                      </button>
                    </Link>
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
      )}
    </div>
  );
};

export default MealsPage;
