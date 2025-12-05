import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@mantine/core';
import { addressesApi, CreateAddressData } from '../../services/addresses';
import { Address } from '../../services/types';

interface AddressModalProps {
  address: Address | null; // null for new address, Address for editing
  onClose: () => void;
  onSave: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ address, onClose, onSave }) => {
  const [formData, setFormData] = useState<CreateAddressData>({
    address_type: 'home',
    full_name: '',
    phone_number: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with address data if editing
  useEffect(() => {
    if (address) {
      setFormData({
        address_type: address.address_type,
        full_name: address.full_name,
        phone_number: address.phone_number,
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2 || '',
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
        is_default: address.is_default,
      });
    }
  }, [address]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.phone_number.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.address_line_1.trim()) {
      setError('Address line 1 is required');
      return false;
    }
    if (!formData.city.trim()) {
      setError('City is required');
      return false;
    }
    if (!formData.state.trim()) {
      setError('State is required');
      return false;
    }
    if (!formData.postal_code.trim()) {
      setError('Postal code is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (address) {
        // Update existing address
        await addressesApi.updateAddress(address.id, formData);
      } else {
        // Create new address
        await addressesApi.createAddress(formData);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address');
      console.error('Error saving address:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1E2738]">
            {address ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium text-[#1E2738] mb-2">
              Address Type
            </label>
            <select
              name="address_type"
              value={formData.address_type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2738] focus:border-transparent"
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#1E2738] mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2738] focus:border-transparent"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-[#1E2738] mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2738] focus:border-transparent"
            />
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-sm font-medium text-[#1E2738] mb-2">
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2738] focus:border-transparent"
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-sm font-medium text-[#1E2738] mb-2">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              name="address_line_2"
              value={formData.address_line_2}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2738] focus:border-transparent"
            />
          </div>

          {/* City, State, Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1E2738] mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2738] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E2738] mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2738] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E2738] mb-2">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2738] focus:border-transparent"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-[#1E2738] mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2738] focus:border-transparent"
            />
          </div>

          {/* Set as Default */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_default"
              id="is_default"
              checked={formData.is_default}
              onChange={handleInputChange}
              className="w-4 h-4 text-[#1E2738] border-gray-300 rounded focus:ring-[#1E2738]"
            />
            <label htmlFor="is_default" className="ml-2 text-sm text-[#1E2738]">
              Set as default address
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              radius="md"
              className="flex-1 text-[#1E2738] border-[#1E2738] hover:bg-[#1E2738] hover:text-white"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              radius="md"
              className="flex-1 bg-[#1E2738] hover:bg-[#1E2738]/90 text-white"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {address ? 'Update Address' : 'Save Address'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;









