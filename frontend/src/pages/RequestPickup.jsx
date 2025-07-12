import React, { useState } from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  PhoneIcon, 
  TruckIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const RequestPickup = () => {
  const [wasteType, setWasteType] = useState('Paper and Cardboard');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [alternativeNumber, setAlternativeNumber] = useState('');
  const [additionalRequest, setAdditionalRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!pickupDate) newErrors.pickupDate = 'Pickup date is required';
    if (!pickupTime) newErrors.pickupTime = 'Pickup time is required';
    if (!pickupAddress.trim()) newErrors.pickupAddress = 'Pickup address is required';
    if (!contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (contactNumber && !/^\+?[\d\s-()]+$/.test(contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    alert('Request submitted successfully!');
  };

  const InputField = ({ label, icon: Icon, error, children, required = false }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon && <Icon className="w-4 h-4 text-green-600" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-sm text-red-600">
          <ExclamationCircleIcon className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <>



    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
     
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <img
                src="/src/assets/recycleimage.png"
                alt="Recycle icon"
                className="w-8 h-8"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Schedule a Pickup</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">Professional Waste Collection</p>
          <p className="text-green-600 font-semibold">🚚 Right at your doorstep</p>
        </div>

        {/* Enhanced Banner */}
        <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
          <img
            src="/src/assets/requestpickup.png"
            alt="Pickup truck with recyclables"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent"></div>
        </div>

        {/* Enhanced Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 space-y-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pickup Details</h2>
            <p className="text-gray-600">Please fill in all required information</p>
          </div>

          {/* Waste Type */}
          <InputField label="Waste Type" icon={null} required>
            <select
              id="wasteType"
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
            >
              <option>Paper and Cardboard</option>
              <option>Plastic</option>
              <option>Metal</option>
              <option>Glass</option>
              <option>Organic Waste</option>
              <option>Mixed Recyclables</option>
            </select>
          </InputField>

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-6">
            <InputField label="Pickup Date" icon={CalendarIcon} error={errors.pickupDate} required>
              <input
                id="pickupDate"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full border-2 rounded-lg p-3 focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                  errors.pickupDate ? 'border-red-500' : 'border-gray-300 focus:border-green-500'
                }`}
              />
            </InputField>
            
            <InputField label="Pickup Time" icon={ClockIcon} error={errors.pickupTime} required>
              <input
                id="pickupTime"
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className={`w-full border-2 rounded-lg p-3 focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                  errors.pickupTime ? 'border-red-500' : 'border-gray-300 focus:border-green-500'
                }`}
              />
            </InputField>
          </div>

          {/* Address */}
          <InputField label="Pickup Address" icon={MapPinIcon} error={errors.pickupAddress} required>
            <textarea
              id="pickupAddress"
              rows={3}
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="Enter your complete address with landmarks..."
              className={`w-full border-2 rounded-lg p-3 focus:ring-2 focus:ring-green-200 transition-all duration-200 resize-none ${
                errors.pickupAddress ? 'border-red-500' : 'border-gray-300 focus:border-green-500'
              }`}
            />
          </InputField>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <InputField label="Primary Contact" icon={PhoneIcon} error={errors.contactNumber} required>
                <input
                  id="contactNumber"
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={`w-full border-2 rounded-lg p-3 focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                    errors.contactNumber ? 'border-red-500' : 'border-gray-300 focus:border-green-500'
                  }`}
                />
              </InputField>
              
              <InputField label="Alternative Contact" icon={PhoneIcon}>
                <input
                  id="alternativeNumber"
                  type="tel"
                  value={alternativeNumber}
                  onChange={(e) => setAlternativeNumber(e.target.value)}
                  placeholder="+1 (555) 987-6543"
                  className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                />
              </InputField>
            </div>
          </div>

          {/* Additional Requests */}
          <InputField label="Additional Instructions">
            <textarea
              id="additionalRequest"
              rows={4}
              value={additionalRequest}
              onChange={(e) => setAdditionalRequest(e.target.value)}
              placeholder="Any special instructions or requests for the pickup team..."
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 resize-none"
            />
          </InputField>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-200 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing Request...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Schedule Pickup
                </>
              )}
            </button>
          </div>
        </form>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Important Notes</h3>
          <ul className="space-y-2 text-blue-700">
            <li>• Pickup requests should be made at least 24 hours in advance</li>
            <li>• Please ensure waste is properly sorted and accessible</li>
            <li>• Our team will contact you 30 minutes before arrival</li>
            <li>• Service available Monday-Saturday, 8 AM - 6 PM</li>
          </ul>
        </div>
      </main>
    </div> </>
  );
};

export default RequestPickup;
