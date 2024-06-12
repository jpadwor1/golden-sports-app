import Image from 'next/image'
import React from 'react'

const ImageIcon = () => {
  return (
    <div className='mr-2'>
      <Image src='/icons/document/imageIcon.png' alt='Image Icon' width={24} height={24} />
    </div>
  )
}

export default ImageIcon
