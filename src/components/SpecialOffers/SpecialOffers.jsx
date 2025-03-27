import SpecialOffer from "../../assets/SpecialOffers.webp";

export default function SpecialOffers() {
  return (
    <section className="py-10 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Today&apos;s Special
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Limited time offers you don&apos;t want to miss
        </p>

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center">
          <div className="w-full md:w-1/2">
            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] rounded-lg overflow-hidden">
              <img
                src={SpecialOffer}
                alt="Special offer"
                className="object-cover"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Weekend Brunch Special
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Enjoy our exclusive weekend brunch menu featuring a variety of
                international cuisines, freshly baked pastries, and refreshing
                beverages. Perfect for a relaxing weekend morning with friends
                or family.
              </p>
              <ul className="mb-4 sm:mb-6 space-y-1 sm:space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  <span className="text-sm sm:text-base">
                    Available every Saturday and Sunday
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  <span className="text-sm sm:text-base">
                    9:00 AM to 1:00 PM
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  <span className="text-sm sm:text-base">
                    Special price: $15.99 per person
                  </span>
                </li>
              </ul>
              <button className="bg-primary hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base">
                Reserve Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
