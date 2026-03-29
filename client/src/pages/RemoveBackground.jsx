import { Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

const RemoveBackground = () => {

   // Tip: When handling files instead of text, it's best practice to initialize state as 'null' instead of an empty string ''
   const [input, setInput] = useState(null)
    
   const onSubmitHandler = async (e) => {
     e.preventDefault();
   }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
        
        {/* Left Col */}
        <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-6 bg-white rounded-lg border border-gray-200'>
            <div className='flex items-center gap-3'>
                <Sparkles className='w-6 text-[#FF4938]'/>
                <h1 className='text-xl font-semibold'>Background Removal</h1>
            </div>
            
            <p className='mt-6 text-sm font-medium'>Upload image</p>
            <input 
              onChange={(e)=>setInput(e.target.files[0])} 
              type="file" 
              accept='image/*' 
              className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
              required
            />
            
            <p className='text-xs text-gray-500 font-light mt-1'>Supports JPG, PNG, and other image formats</p>
            
            <button className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-3 mt-6 text-sm font-medium rounded-lg cursor-pointer hover:opacity-90 transition'>
              <Eraser className='w-5' />
              Remove Background
            </button>
        </form>

        {/* Right Col */}
        <div className='flex-1 min-w-[300px] p-6 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
          <div className='flex items-center gap-3 pb-4 border-b border-gray-100'>
            <Eraser className='w-6 text-[#FF4938]'/>
            {/* FIX: Added text-xl and font-semibold to match the left side */}
            <h1 className='text-xl font-semibold'>Processed Image</h1>
          </div>
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Eraser className='w-16 h-16 opacity-50' />
              <p className='text-center max-w-xs'>Upload an image and click "Remove background" to get started</p>
            </div>
           </div>
        </div>
        
    </div> 
  )
}

export default RemoveBackground