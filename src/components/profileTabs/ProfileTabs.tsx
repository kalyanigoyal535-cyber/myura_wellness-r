import React from "react";
import { Tabs } from "@mantine/core";
import ProfileOrders from "../profileOrders/ProfileOrders";
import ProfileAddreses from "../profileAddreses/ProfileAddreses";
import Coupons from "../coupons/Coupons";
import ReferAndEarn from "../referAndEarn/ReferAndEarn";

type Props = {};

const ProfileTabs = (props: Props) => {
  return (
    <div>
      <Tabs
        color="#1F2839"
        variant="pills"
        orientation="vertical"
        defaultValue="Orders"
      >
        <Tabs.List>
          <Tabs.Tab value="Orders">Orders</Tabs.Tab>
          <Tabs.Tab value="Addresses">Addresses</Tabs.Tab>
          {/* <Tabs.Tab value="Coupons">Coupons </Tabs.Tab> */}
          <Tabs.Tab value="Refer">Refer & Earn  </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Orders">
          <ProfileOrders />
        </Tabs.Panel>

        <Tabs.Panel value="Addresses">
        <ProfileAddreses/>
        </Tabs.Panel>

        <Tabs.Panel value="Coupons">
          <Coupons/>
        </Tabs.Panel>
        <Tabs.Panel value="Refer">
      <ReferAndEarn/>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
