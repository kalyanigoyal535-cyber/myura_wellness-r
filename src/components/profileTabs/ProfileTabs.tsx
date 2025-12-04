import React from "react";
import { Tabs } from "@mantine/core";
import ProfileOrders from "../profileOrders/ProfileOrders";
import ProfileAddreses from "../profileAddreses/ProfileAddreses";
import Coupons from "../coupons/Coupons";
import { Package, MapPin, Tag } from "lucide-react";

type Props = {};

const ProfileTabs = (props: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <Tabs
        color="#1F2839"
        variant="pills"
        orientation="vertical"
        defaultValue="Orders"
        className="premium-tabs"
      >
        <div className="flex flex-col lg:flex-row">
          <Tabs.List className="bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 p-4 lg:p-6 min-w-[200px] lg:min-w-[240px]">
            <Tabs.Tab 
              value="Orders" 
              className="mb-2 data-[active=true]:bg-gradient-to-r data-[active=true]:from-slate-900 data-[active=true]:to-slate-800 data-[active=true]:text-white data-[active=true]:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4" />
                <span className="font-semibold">Orders</span>
              </div>
            </Tabs.Tab>
            <Tabs.Tab 
              value="Addresses"
              className="mb-2 data-[active=true]:bg-gradient-to-r data-[active=true]:from-slate-900 data-[active=true]:to-slate-800 data-[active=true]:text-white data-[active=true]:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4" />
                <span className="font-semibold">Addresses</span>
              </div>
            </Tabs.Tab>
            <Tabs.Tab 
              value="Coupons"
              className="data-[active=true]:bg-gradient-to-r data-[active=true]:from-slate-900 data-[active=true]:to-slate-800 data-[active=true]:text-white data-[active=true]:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4" />
                <span className="font-semibold">Coupons</span>
              </div>
            </Tabs.Tab>
          </Tabs.List>

          <div className="flex-1 p-6 lg:p-8">
            <Tabs.Panel value="Orders">
              <ProfileOrders />
            </Tabs.Panel>

            <Tabs.Panel value="Addresses">
              <ProfileAddreses/>
            </Tabs.Panel>

            <Tabs.Panel value="Coupons">
              <Coupons/>
            </Tabs.Panel>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
