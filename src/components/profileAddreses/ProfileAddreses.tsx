import React, { useState, useEffect } from 'react';
import { ProfileAddressesCard } from "../profileAddressesCard/ProfileAddressesCard";
import { addressesApi } from '../../services/addresses';
import { Address } from '../../services/types';
import AddressModal from './AddressModal';
import { Loader2 } from 'lucide-react';

const ProfileAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Fetch addresses from API
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressesApi.getAddresses();
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load addresses');
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle add new address
  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  // Handle edit address
  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  // Handle delete address
  const handleDeleteAddress = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await addressesApi.deleteAddress(id);
      // Refresh addresses list
      await fetchAddresses();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete address');
      console.error('Error deleting address:', err);
    }
  };

  // Handle set default address
  const handleSetDefault = async (id: number) => {
    try {
      await addressesApi.setDefaultAddress(id);
      // Refresh addresses list
      await fetchAddresses();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to set default address');
      console.error('Error setting default address:', err);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  // Handle modal save
  const handleModalSave = async () => {
    await fetchAddresses();
    handleModalClose();
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 md:gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-[#1E2738]">
          Saved Addresses
        </h1>
        <button 
          onClick={handleAddAddress}
          className="border border-[#1E2738] hover:bg-[#1E2738] hover:text-white transition-all px-4 py-2 rounded-md text-sm text-[#1E2738]"
        >
          + Add New Address
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-6 flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#1E2738]" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchAddresses}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && addresses.length === 0 && (
        <div className="mt-6 p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No addresses saved yet.</p>
          <button
            onClick={handleAddAddress}
            className="border border-[#1E2738] hover:bg-[#1E2738] hover:text-white transition-all px-4 py-2 rounded-md text-sm text-[#1E2738]"
          >
            + Add Your First Address
          </button>
        </div>
      )}

      {/* Cards Section */}
      {!loading && !error && addresses.length > 0 && (
        <div className="mt-6 space-y-4">
          {addresses.map((address) => (
            <ProfileAddressesCard
              key={address.id}
              address={address}
              onEdit={() => handleEditAddress(address)}
              onDelete={() => handleDeleteAddress(address.id)}
              onSetDefault={() => handleSetDefault(address.id)}
            />
          ))}
        </div>
      )}

      {/* Address Modal */}
      {isModalOpen && (
        <AddressModal
          address={editingAddress}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default ProfileAddresses;