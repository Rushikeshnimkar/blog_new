import Image from 'next/image'
import React from 'react'
import "../../globals.css";
const Blog1 = () => {
  return (
    <>
      <div className='h-auto w-full flex flex-col md:flex-row justify-between items-start '>
        <div className='flex-1 mt-10 ml-10'>
          <div className='text-6xl  mb-10 font-rationale'>Welcome to Blog Buster</div>
          <div className=' mb-10 text-3xl'>Create. Share. Inspire.</div>
          <div className='  text-xl'>
            Welcome to Blog Buster, your digital haven for storytelling, creativity, and connection.<br/>
            Here, every voice matters, and every story finds its audience. Whether you’re a <br/>
            seasoned blogger or just starting out, Blog Buster is where your journey begins.
          </div>
        </div>
        <div className='flex-shrink-0 p-1 bg-yellow-500 clip-top-right-bottom-left mr-10'>
          <Image src={'/namaste.jpeg'} alt='starry night' width={500} height={500} className='object-cover clip-top-right-bottom-left' />
        </div>
      </div>
    </>
  )
}

export default Blog1
