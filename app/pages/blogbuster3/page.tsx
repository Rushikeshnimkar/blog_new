import Image from 'next/image'
import React from 'react'
import "../../globals.css";
const Blog3 = () => {
  return (
    <>
      <div className='h-auto w-full flex flex-col md:flex-row justify-between items-start '>
        <div className='flex-1 mt-10 ml-10'>
          <div className='text-6xl  mb-10 font-rationale'>Discover and Connect</div>
          
          <div className='  text-xl'>
          Immerse yourself in a world of diverse voices and perspectives. Explore blogs that resonate with your <br/>
          passions—be it tech insights, travel adventures, lifestyle tips, or personal growth stories. Engage with <br/>thought-provoking
           content,leave heartfelt comments, and connect with like-minded souls who share your enthusiasm.
          </div>
        </div>
        <div className='flex-shrink-0 p-1 bg-orange-700 clip-top-right-bottom-left mr-10'>
          <Image src={'/scream.jpeg'} alt='starry night' width={500} height={500} className='object-cover clip-top-right-bottom-left' />
        </div>
      </div>
    </>
  )
}

export default Blog3
