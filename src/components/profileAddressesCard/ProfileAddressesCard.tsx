
import { Button } from "@mantine/core";


export const ProfileAddressesCard = () => {
    return (
      <div className="border border-gray-200 rounded-xl p-4 md:p-6 bg-[#F8F8F8] shadow-sm hover:shadow-md transition-all">
        
        <div className="flex justify-between items-start md:items-center">
          <div className="text-sm md:text-base text-[#1E2738]">
            <h2 className="font-medium text-base md:text-lg">Atul Kumar Tiwari</h2>
            <p className="mt-1 leading-relaxed">
              Plot No. 15C, IT Park, Sector 22,<br />
              Panchkula, Haryana, 134109
            </p>
            <p className="mt-1 font-medium">+91 7827720481</p>
          </div>
  
          {/* Optional default badge */}
          <span className="hidden md:inline-block text-[11px] px-3 py-1 rounded-full bg-[#1E2738]/10 text-[#1E2738] border border-[#1E2738]/20">
            Default
          </span>
        </div>
  
        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row sm:gap-3 gap-2">
          <Button
            variant="outline"
            radius="md"
            className="text-[#1E2738] border-[#1E2738]"
            fullWidth
          >
            EDIT
          </Button>
          <Button
            variant="outline"
            radius="md"
            className="text-[#1E2738] border-[#1E2738]"
            fullWidth
          >
            REMOVE
          </Button>
        </div>
      </div>
    );
  };
  