import React from 'react'

export const Keyboard = () => {
    const a = Array.from(Array(9).keys())
    return (
        <section>
            <h1>Keyboard</h1>
            <div  className='grid grid-cols-3 gap-2'>
                {a.map((i) => {
                    return (
                        <div key={i} className="bg-sky-500/50 hover:bg-sky-500/20 flex justify-center items-center border-sky-500">
                            <p className="font-bold text-3xl sm:text-4xl">{i+1}</p>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
