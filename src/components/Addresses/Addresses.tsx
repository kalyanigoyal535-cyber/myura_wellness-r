import React from 'react'
import DefaultAddressCard from '../defaultAddressCard/DefaultAddressCard'
type Props = {}

const Addresses = (props: Props) => {
  return (
    <div>
      <div className='flex items-center w-[80vh] justify-between'>
        <h1 className='font-semibold'>
          Saved Addresses 
        </h1>
        <button className='border p-2 text-[#1A2336] font-semibold border-[#1A2336]'>
          + ADD NEW ADDRESS 
        </button>
      </div>
      <div className='mt-4'>
        <p>
        Default Address
        </p>
        <DefaultAddressCard/>
      </div>
    </div>
  )
}

export default Addresses