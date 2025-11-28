import React from 'react'
import ProfileTabs from '../components/profileTabs/ProfileTabs'
import { Divider } from '@mantine/core'
type Props = {}

const Profile = (props: Props) => {
  return (
    <div className='w-11/12 flex  flex-col  mx-auto'>
        <ProfileHeader/>
        <Divider my="md" />
        <ProfileTabs/>
    </div>
  )
}

export default Profile


export const ProfileHeader = () => {
  return (
    <div>
        <h1 className='text-2xl font-semibold' >
            Account 
        </h1>
    </div>
  )
}
