import { ProfileAddressesCard } from "../profileAddressesCard/ProfileAddressesCard";
const ProfileAddresses = () => {
  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 md:gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-[#1E2738]">
          Saved Addresses
        </h1>
        <button className="border border-[#1E2738] hover:bg-[#1E2738] hover:text-white transition-all px-4 py-2 rounded-md text-sm text-[#1E2738]">
          + Add New Address
        </button>
      </div>

      {/* Cards Section */}
      <div className="mt-6">
        <ProfileAddressesCard />
      </div>
    </div>
  );
};

export default ProfileAddresses;