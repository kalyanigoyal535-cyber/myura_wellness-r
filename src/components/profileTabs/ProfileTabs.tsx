import React from "react";
import { Tabs } from "@mantine/core";
import ProfileOrders from "../profileOrders/ProfileOrders";

type Props = {};

const ProfileTabs = (props: Props) => {
  return (
    <div>
      <Tabs
        color="#1F2839"
        variant="pills"
        orientation="vertical"
        defaultValue="gallery"
      >
        <Tabs.List>
          <Tabs.Tab value="Orders">Orders</Tabs.Tab>
          <Tabs.Tab value="Addresses">Addresses</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Orders">
          <ProfileOrders />
        </Tabs.Panel>

        <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>

        <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
