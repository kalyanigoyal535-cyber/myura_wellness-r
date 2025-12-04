import { Button } from "@mantine/core";
import { Address } from "../../services/types";

interface ProfileAddressesCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

export const ProfileAddressesCard = ({ address, onEdit, onDelete, onSetDefault }: ProfileAddressesCardProps) => {
  // Format address for display
  const formatAddress = () => {
    const parts = [
      address.address_line_1,
      address.address_line_2,
      address.city,
      address.state,
      address.postal_code,
      address.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  // Get address type label
  const getAddressTypeLabel = () => {
    switch (address.address_type) {
      case 'home':
        return 'Home';
      case 'work':
        return 'Work';
      case 'other':
        return 'Other';
      default:
        return 'Address';
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 md:p-6 bg-[#F8F8F8] shadow-sm hover:shadow-md transition-all">
      
      <div className="flex justify-between items-start md:items-center">
        <div className="text-sm md:text-base text-[#1E2738] flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-medium text-base md:text-lg">{address.full_name}</h2>
            {address.is_default && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#1E2738]/10 text-[#1E2738] border border-[#1E2738]/20">
                Default
              </span>
            )}
            <span className="text-xs text-gray-500">({getAddressTypeLabel()})</span>
          </div>
          <p className="mt-1 leading-relaxed">
            {formatAddress()}
          </p>
          <p className="mt-1 font-medium">{address.phone_number}</p>
        </div>

        {/* Default badge for larger screens */}
        {address.is_default && (
          <span className="hidden md:inline-block text-[11px] px-3 py-1 rounded-full bg-[#1E2738]/10 text-[#1E2738] border border-[#1E2738]/20">
            Default
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-col sm:flex-row sm:gap-3 gap-2">
        <Button
          variant="outline"
          radius="md"
          className="text-[#1E2738] border-[#1E2738] hover:bg-[#1E2738] hover:text-white"
          fullWidth
          onClick={onEdit}
        >
          EDIT
        </Button>
        {!address.is_default && (
          <Button
            variant="outline"
            radius="md"
            className="text-[#1E2738] border-[#1E2738] hover:bg-[#1E2738] hover:text-white"
            fullWidth
            onClick={onSetDefault}
          >
            SET DEFAULT
          </Button>
        )}
        <Button
          variant="outline"
          radius="md"
          className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
          fullWidth
          onClick={onDelete}
        >
          REMOVE
        </Button>
      </div>
    </div>
  );
};
  