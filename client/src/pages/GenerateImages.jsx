import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react'; 

const GenerateImages = () => {

    const styles = [
        'Realistic', 
        'Ghibli Style', 
        'Anime Style',
        'Cartoon style',
        'Fantasy style',
        'Realistic style',
        '3D style',
        'Potrait style'
    ];

    const [input, setInput] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('Realistic');
    const [publish, setPublish] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
    }

    return (
        <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
            
            <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-6 bg-white rounded-lg border border-gray-200'>
                
                <div className='flex items-center gap-3'>
                    <Sparkles className='w-6 text-[#00AD25]' />
                    <h1 className='text-xl font-semibold'>AI Image Generator</h1>
                </div>

                <p className='mt-6 text-sm font-medium'>Describe your Image</p>
                <textarea 
                    onChange={(e) => setInput(e.target.value)} 
                    value={input}
                    rows={4} 
                    className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:border-[#0BB0D7] transition' 
                    placeholder='Describe what you want to see in the image' 
                    required 
                />

                <p className='mt-6 text-sm font-medium'>Style</p>
                <div className='mt-3 flex gap-3 flex-wrap'>
                    {styles.map((style) => (
                        <span 
                            key={style}
                            onClick={() => setSelectedStyle(style)}
                            className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition ${selectedStyle === style ? 'bg-green-50 text-green-700 border-green-200 font-medium' : 'text-gray-500 border-gray-300 hover:bg-gray-50'}`}
                        >
                            {style}
                        </span>
                    ))}
                </div>

                <div className='my-6 flex items-center gap-2'>
                  <label className='relative flex items-center cursor-pointer'>
                    {/* Fixed: Removed the '=' before sr-only to properly hide the square checkbox */}
                    <input type="checkbox" onChange={(e)=>setPublish(e.target.checked)}
                    checked={publish} className='sr-only peer' />
                    
                    <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>
                    
                    {/* Fixed: Removed the space after peer-checked: so the toggle circle slides */}
                    <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
                  </label>

                  <p className='text-sm'>Make this image public</p>
                </div>

                <button className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-3 mt-8 text-sm font-medium rounded-lg cursor-pointer hover:bg-[#0999bc] transition'>
                    <ImageIcon className='w-5 h-5' />
                    Generate image
                </button>
            </form>

            <div className='flex-1 min-w-[300px] p-6 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
                <div className='flex items-center gap-3 pb-4 border-b border-gray-100'>
                    <ImageIcon className='w-6 text-[#00AD25]' />
                    <h1 className='text-xl font-semibold'>Generated image</h1>
                </div>

                <div className='flex-1 flex justify-center items-center'>
                    <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                        <ImageIcon className='w-16 h-16 opacity-50' />
                        <p className='text-sm max-w-xs text-center leading-relaxed'>Describe an image and click "Generate image" to get started</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default GenerateImages;