import { Scissors, Sparkles } from 'lucide-react'
import React, {useState} from 'react'

const RemoveObject = () => {

  const [input, setInput] = useState('')
  const [object, setObject] = useState('')
      
     const onSubmitHandler = async (e) => {
       e.preventDefault();
     }
  
  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
        
        {/* Left Col */}
        <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-6 bg-white rounded-lg border border-gray-200'>
            <div className='flex items-center gap-3'>
                <Sparkles className='w-6 text-[#4A7AFF]'/>
                <h1 className='text-xl font-semibold'>Object Removal</h1>
            </div>
            
            <p className='mt-6 text-sm font-medium'>Upload image</p>
            <input 
              onChange={(e)=>setInput(e.target.files[0])} 
              type="file" 
              accept='image/*' 
              className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
              required
            />

            <p className='mt-6 text-sm font-medium'>Describe object name to remove</p>
            
             <textarea 
                    onChange={(e) => setObject(e.target.value)} 
                    value={object}
                    rows={4} 
                    className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:border-[#0BB0D7] transition' 
                    placeholder='e.g., watch or spoon , Only single object name'
                     
                    required 
                />

            <button className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-3 mt-6 text-sm font-medium rounded-lg cursor-pointer hover:opacity-90 transition'>
              <Scissors className='w-5' />
              Remove Object
            </button>
        </form>

        {/* Right Col */}
        <div className='flex-1 min-w-[300px] p-6 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
          <div className='flex items-center gap-3 pb-4 border-b border-gray-100'>
            <Scissors className='w-6 text-[#4A7AFF]'/>
            
            <h1 className='text-xl font-semibold'>Processed Image</h1>
          </div>
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Scissors className='w-16 h-16 opacity-50' />
              <p className='text-center max-w-xs'>Upload an image and click "Remove Object" to get started</p>
            </div>
           </div>
        </div>
        
    </div> 
  )
}

export default RemoveObject
