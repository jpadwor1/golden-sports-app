import Image from 'next/image'
import React from 'react'

const AdobeIcon = () => {
  return (
    <div className='flex items-center justify-center mr-2'>
      <Image src='/icons/document/pdf.png' alt='Image Icon' width={24} height={24} />
    </div>
  )
}

export default AdobeIcon
