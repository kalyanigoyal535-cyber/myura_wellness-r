import React from 'react'
import ProfileTabs from '../components/profileTabs/ProfileTabs'
import { Divider } from '@mantine/core'
import { User, Shield, Heart } from 'lucide-react'
type Props = {}

const Profile = (props: Props) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        <ProfileHeader/>
        <Divider my="xl" className="border-slate-200" />
        <ProfileTabs/>
      </div>
    </div>
  )
}

export default Profile


export const ProfileHeader = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg">
          <User className="h-6 w-6 text-white" />
        </div>
        <h1 className='text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight'>
          My Account
        </h1>
      </div>
      <p className="text-slate-600 text-sm sm:text-base ml-14">
        Manage your orders, addresses, and preferences
      </p>
    </div>
  )
}
