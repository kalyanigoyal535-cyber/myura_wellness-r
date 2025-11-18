import React from "react";
import { Tabs } from "@mantine/core";
import Addresses from "../Addresses/Addresses";
type Props = {};

const ProfileTabs = (props: Props) => {
  return (
    <div className="flex h-[60vh] mt-10">
      <Tabs orientation="vertical" color="#1F4169" defaultValue="profile" className="f">
        <Tabs.List>
          <Tabs.Tab value="profile">Profile </Tabs.Tab>
          <Tabs.Tab value="Addresses">Addresses</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="gallery">Profile tab content</Tabs.Panel>

        <Tabs.Panel value="Addresses" className="w-92">
            <Addresses/>
        </Tabs.Panel>

        <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
