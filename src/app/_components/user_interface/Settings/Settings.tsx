import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline'
import FileUploader from './FileUploader'
import { useState } from 'react'

const settings = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: "Your customers' data will be safe and secure", href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
export default function Settings({play}: any) {
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
  };
  return (
    <section className="rounded-lg m-5">
      <input type="checkbox" id="toggle" className="toggle hidden" />
      <label
        htmlFor="toggle"
        className="lbl-toggle text-xl block rounded-[inherit] font-bold py-1 px-3 cursor-pointer transition-all duration-500 ease-out bg-sky-500  hover:bg-white hover:text-sky-500  "
        onClick={handleToggle}
      >Settings
      </label>
      <label htmlFor="toggle" className="lbl-toggle-after"></label>
      <section
        className={`collapsible-content max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          toggle ? 'max-h-screen' : ''
        }`}
      >
        <Menu play={play}/>

      </section>
    </section>

  )
}


const Menu = ({play}: any) => {
  return (
    <div className='bg-sky-100 dark:bg-sky-950 p-5 my-2 rounded-lg'>
    <section className=''>
      <h1 className='text-2xl font-[Arial] font-bold'>Create board</h1>
      <div>
       <h2>Generate Board</h2>
       <div>
        <NumberInput name="Rows" />
       </div>
       <div>
        <NumberInput name="Columns" />
       </div>
       <button className=" p-4 m-5 bg-sky-400 rounded-full">
        Generate Board
      </button>

      </div>
      <FileUploader />
      
    </section>
    <section>
      <h1 className='text-2xl font-[Arial] font-bold'>Machine Player</h1>
      <button className=" p-4 m-5 bg-sky-400 rounded-full" onClick={play}>
        BruteForce
      </button>
      <button className=" p-4 m-5 bg-sky-400 rounded-full" onClick={play}>
        Play
      </button>
      <button className=" p-4 m-5 bg-sky-400 rounded-full" >
        Stop
      </button>
    </section>
   </div>
  )
}


const NumberInput = ({name}: any) => {


  return (
    <section className='flex  justify-between items-center'>
      <h1>{name}</h1>
      <div className="py-2 px-3 inline-block bg-white border border-sky-200 rounded-lg dark:bg-slate-900 dark:border-sky-700" data-hs-input-number><div className="flex items-center gap-x-1.5">
        <button type="button" className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-sky-200 bg-white text-sky-800 shadow-sm hover:bg-sky-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-sky-700 dark:text-white dark:hover:bg-sky-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-sky-600">
          <svg className="flex-shrink-0 w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
        </button>            
        <input name="number_columns" id="number_row" className="p-0 w-6 outline-none bg-transparent border-0 text-sky-800 text-center focus:ring-0 dark:text-white" type="number" />
        <button type="button" className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-sky-200 bg-white text-sky-800 shadow-sm hover:bg-sky-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-sky-700 dark:text-white dark:hover:bg-sky-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-sky-600">
            <svg className="flex-shrink-0 w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
        </div>
      </div>
    </section>
  )
}