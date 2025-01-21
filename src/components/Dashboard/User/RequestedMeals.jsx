import { useEffect, useState } from "react";

export default function RequestedMeals() {
  const [requestedMeals, setRequestedMeals] = useState([]);

  useEffect(() => {
    fetchRequestedMeals();
  }, []);

  const fetchRequestedMeals = () => {
    setRequestedMeals([
      {
        id: 1,
        title: "Pizza",
        likes: 120,
        reviews_count: 15,
        status: "Pending",
      },
      {
        id: 2,
        title: "Burger",
        likes: 50,
        reviews_count: 5,
        status: "Approved",
      },
    ]);
  };

  const cancelMeal = (id) => {
    setRequestedMeals((prev) => prev.filter((meal) => meal.id !== id));
  };

  return (
    <div className="card bg-white shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Requested Meals</h2>
      {requestedMeals.length > 0 ? (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Meal Title</th>
              <th>Likes</th>
              <th>Reviews Count</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requestedMeals.map((meal) => (
              <tr key={meal.id}>
                <td>{meal.title}</td>
                <td>{meal.likes}</td>
                <td>{meal.reviews_count}</td>
                <td>{meal.status}</td>
                <td>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => cancelMeal(meal.id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No requested meals found.</p>
      )}
    </div>
  );
}
