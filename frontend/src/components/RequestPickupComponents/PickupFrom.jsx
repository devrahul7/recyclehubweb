import React, { useState } from 'react';

const Picku = () => {
  const [wasteType, setWasteType] = useState('Paper and Cardboard');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [alternativeNumber, setAlternativeNumber] = useState('');
  const [additionalRequest, setAdditionalRequest] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate submission logic (e.g., API call)
    alert('Request submitted!');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top navigation */}
      <nav className="bg-green-600 p-4 text-white flex justify-end space-x-6 rounded-b-lg">
        <a href="#" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">About</a>
        <a href="#" className="hover:underline">Contact</a>
        <a href="#" className="hover:underline">Register</a>
        <a href="#" className="hover:underline">Login</a>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <img
            src="https://img.icons8.com/ios-filled/50/000000/recycle.png"
            alt="Recycle icon"
            className="w-10 h-10"
          />
          <h1 className="text-3xl font-normal">Schedule a Pickup</h1>
        </div>
        <p className="text-center mb-4">At your DoorStep</p>

        {/* Banner image */}
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60"
          alt="Pickup truck with recyclables"
          className="w-full h-40 object-cover rounded-md mb-6"
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Waste Type selector */}
          <div>
            <label htmlFor="wasteType" className="block mb-2 font-medium">
              Waste Type
            </label>
            <select
              id="wasteType"
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option>Paper and Cardboard</option>
              <option>Plastic</option>
              <option>Metal</option>
              <option>Glass</option>
              <option>Organic Waste</option>
            </select>
          </div>

          {/* Date & Time inputs */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="pickupDate" className="block mb-2 font-medium">
                Pickup Date
              </label>
              <input
                id="pickupDate"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="pickupTime" className="block mb-2 font-medium">
                Pickup Time
              </label>
              <input
                id="pickupTime"
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="pickupAddress" className="block mb-2 font-medium">
              Pickup Address
            </label>
            <textarea
              id="pickupAddress"
              rows={3}
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Contact numbers */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="contactNumber" className="block mb-2 font-medium">
                Contact number
              </label>
              <input
                id="contactNumber"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="alternativeNumber" className="block mb-2 font-medium">
                Alternative Number
              </label>
              <input
                id="alternativeNumber"
                type="tel"
                value={alternativeNumber}
                onChange={(e) => setAlternativeNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Additional request */}
          <div>
            <label htmlFor="additionalRequest" className="block mb-2 font-medium">
              Additional Request (Optional)
            </label>
            <textarea
              id="additionalRequest"
              rows={5}
              value={additionalRequest}
              onChange={(e) => setAdditionalRequest(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Submit button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              Submit Request
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PickupForm;
