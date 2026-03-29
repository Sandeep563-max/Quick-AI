import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

const ReviewResume = () => {
    const [file, setFile] = useState(null);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
    };

    return (
        <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
            
            <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-6 bg-white rounded-lg border border-gray-200'>
                <div className='flex items-center gap-3'>
                    <Sparkles className='w-6 text-[#00B47D]' />
                    <h1 className='text-xl font-semibold'>Resume Review</h1>
                </div>

                <p className='mt-6 text-sm font-medium'>Upload Resume</p>
                <input 
                    onChange={(e) => setFile(e.target.files[0])} 
                    type="file" 
                    accept='.pdf, image/*' 
                    className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
                    required
                />
                <p className='text-xs text-gray-500 font-light mt-1'>Supports PDF, PNG, JPG formats</p>

                <button className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00B47D] to-[#008E9B] text-white px-4 py-3 mt-8 text-sm font-medium rounded-lg cursor-pointer hover:opacity-90 transition'>
                    <FileText className='w-5 h-5' />
                    Review Resume
                </button>
            </form>

            <div className='flex-1 min-w-[300px] p-6 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
                <div className='flex items-center gap-3 pb-4 border-b border-gray-100'>
                    <FileText className='w-6 text-[#00B47D]' />
                    <h1 className='text-xl font-semibold'>Analysis Results</h1>
                </div>

                <div className='flex-1 flex justify-center items-center'>
                    <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                        <FileText className='w-16 h-16 opacity-50' />
                        <p className='text-sm max-w-xs text-center leading-relaxed'>Upload your resume and click "Review Resume" to get started</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ReviewResume;