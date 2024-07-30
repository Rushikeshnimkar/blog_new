import Image from 'next/image'
import React from 'react'
import "../../globals.css";

const  Blog2= () => {
  return (
    <>
     <div className='h-auto w-full flex flex-col md:flex-row justify-between items-start'>
     <div className=' p-1 flex-1   ml-10'>
      <div className=' w-fit bg-blue-700 p-1 clip-top-right-bottom-left'>
          <Image src={'/scream.jpeg'} alt='starry night' width={500} height={500} className='object-cover clip-top-right-bottom-left ' />
          </div>
        </div>
        <div className=' mt-10 ml-10 flex-shrink-0'>
          <div className='text-6xl  mb-10 font-rationale'>Create Effortlessly</div>
          
          <div className='  text-xl mr-10 '>
          Pour your heart into your words with our elegant, user-friendly editor. Whether you’re sharing <br/> a personal triumph, 
          a life lesson, or a creative piece, our platform makes it easy to bring your <br/> vision to life. 
          Add vivid images, embed engaging videos, and let your story captivate the world.
          </div>
        </div>
        
      </div>
 </>
  )
}

export default Blog2