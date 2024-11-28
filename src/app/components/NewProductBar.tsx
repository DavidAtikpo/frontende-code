import React from 'react'
// import Link from 'next/link'
import Image from 'next/image'

const NewProductBar = () => {
  return (
    <div className="w-100 h-20 bg-gray-100 flex items-center justify-center shadow-lg ">
    <Image
      src="/dubon service.jpg" // Remplacez par votre URL publicitaire
      alt="Bannière publicitaire"
      width={250}
      height={250}
      className="h-14 w-full"
    />
  </div>
  )
}

export default NewProductBar