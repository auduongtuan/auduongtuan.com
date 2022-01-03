import React from 'react'
import { FiChevronLeft, FiChevronRight, FiPlus, FiGrid } from "react-icons/fi";

const BrowserFrame: React.FC<{url?: string}> = ({children, url}) => {
  return (
    <div className='flex flex-col border-solid border border-black/20 rounded-xl overflow-hidden translate-z-0 shadow-lg'>
      <header className='flex items-center justify-between bg-slate-800 px-2 py-1.5 rounded-t-[11px]'>
        <div className="flex gap-2 flex-grow basis-0 items-center">
        <span className="w-2 h-2 bg-slate-400 rounded block"></span>
        <span className="w-2 h-2 bg-slate-400 rounded block"></span>
        <span className="w-2 h-2 bg-slate-400 rounded block"></span>
        <FiChevronLeft className="ml-3 text-slate-400" />
        <FiChevronRight className="text-slate-600" />
        </div>
        <div className='bg-white/20 text-xs text-white/80 text-center px-4 py-[2px] rounded-md inline-block justify-self-center w-1/2'>
          {url && <a href={url} target="_blank" rel="noreferrer">{url.replace(/(^\w+:|^)\/\//, '')}</a>}
          </div>
        <div className='flex-grow gap-2 basis-0 justify-self-end flex items-center justify-end'>
        <FiGrid className="text-slate-400" />
        <FiPlus className="text-slate-400" />
        </div>
      </header>
      <main className="flex-grow-0 leading-[0]">
      {children}
      </main>
    </div>
  )
}

export default BrowserFrame;