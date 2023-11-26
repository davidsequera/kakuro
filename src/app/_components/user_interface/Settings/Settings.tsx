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
    // <section className="rounded-2xl font-Raleway shadow-md m-2">
    //   <input type="checkbox" id="toggle" className="hidden" />
    //   <label
    //     htmlFor="toggle"
    //     className="lbl-toggle text-xl block py-3.5 px-12 bg-sky-500 cursor-pointer rounded-t-lg transition-all duration-250 ease-out hover:bg-white hover:text-sky-500"
    //     onClick={handleToggle}
    //   >Settings
    //   </label>
    //   <label htmlFor="toggle" className="lbl-toggle-after"></label>
    //   <section
    //     className={`collapsible-content max-h-0 overflow-hidden transition-max-h duration-250 ease-in-out ${
    //       toggle ? 'max-h-screen' : ''
    //     }`}
    //   >
    //   <section className=''>
    //       <h1 className='text-xl font-[Arial] font-semibold'>Create board</h1>
    //       <FileUploader />
    //     </section>
    //     <section>
    //       <h1 className='text-xl font-[Arial] font-semibold'>Machine Player</h1>
    //       <p>Create board 3 x 3</p>
    //       <button className=" p-5 m-10 bg-sky-400 rounded-full self-center" onClick={play}>
    //         Machine player
    //       </button>
    //     </section>
    //   </section>
    // </section>
    <div className='bg-sky-950 p-5 m-5 rounded-lg'>
     <section className=''>
       <h1 className='text-2xl font-[Arial] font-bold'>Create board</h1>
       <div>
        <h2></h2>
        <div>
          <div className="w-72">
            <div className="relative h-10 w-full min-w-[200px]">
              <input
                type='number'
                className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-sky-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                placeholder=" "
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-sky-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-sky-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-sky-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Rows
              </label>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="number_columns">Columns</label>
          <input className="text-sky-300"type="number" name="number_columns" id="number_row" />
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


// export default function Menu({play}: any) {
//   const [toggle, setToggle] = useState(false);

//   const handleToggle = () => {
//     setToggle(!toggle);
//   };
//   return (
//     <div className="w-full px-4 pt-16">
//       <div className="mx-auto w-full max-w-md rounded-2xl bg-blue p-2">
//         <Disclosure>
//           {({ open }) => (
//             <>
//               <Disclosure.Button className="transition ease-in-out delay-150 flex w-full justify-between rounded-lg bg-sky-500 px-4 py-2 text-left text-sm font-medium text-white-100 hover:bg-white hover:text-sky-500 focus:outline-none focus-visible:ring focus-visible:ring-sky-500/75">
//                 <span>Settings</span>
//                 <ChevronUpIcon
//                   className={`${
//                     open ? 'rotate-180 transform' : ''
//                   } h-5 w-5 text-white-500 hover:text-sky`}
//                 />
//               </Disclosure.Button>
//               <Transition
//                 enter="transition-all duration-250 ease-in-out"
//                 enterFrom="max-h-0"
//                 enterTo="max-h-screen"
//                 leave="transition-all duration-250 ease-in-out"
//                 leaveFrom="max-h-screen"
//                 leaveTo="max-h-0 block	"
//               >
//                 <Disclosure.Panel static className="px-4 pb-2 pt-4 text-white-100">
//                   <section className=''>
//                     <h1>Create board</h1>
//                     <FileUploader />
//                   </section>
//                   <section>
//                     <h1>Machine Player</h1>
//                     <p>Create board 3 x 3</p>
//                     <button className=" p-5 m-10 bg-sky-400 rounded-full self-center" onClick={play}>
//                       Machine player
//                     </button>
//                   </section>
//                 </Disclosure.Panel>
//               </Transition>
//             </>
//           )}
//         </Disclosure>
//       </div>
//     </div>
//   )
// }