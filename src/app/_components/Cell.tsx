import React, { use, useEffect, useState } from 'react'
import { TypeCell, cellValue } from './GameBoard/TypeCell'
import { cell } from './GameBoard/TypeCell'
import { Subject } from 'rxjs'


const general_styles = "border-solid border-2 border-sky-500 h-[16vw] sm:h-[12vw]  md:h-[9vw] lg:h-[7vw] w-[16vw] sm:w-[12vw]  md:w-[9vw] lg:w-[7vw] cursor-pointer select-none" 

const diagonal_styles = "after:absolute after:border-2 after:w-[calc(100%*1.4143)] after:border-sky-500 after:rotate-45 after:origin-[1.2%_0%]"

export const Cell = ({id, pickCell, selected, cell}: any) => {

    const [value, setValue] = useState<cellValue>(cell.value)
    
    useEffect(() => {
        if (cell.type === TypeCell.WHITE) {
            const subject = cell.subject
            const subscription = subject.subscribe(observer)
            return () => {
                console.log("cell unsubscribe")
                subscription.unsubscribe()
                // console.log("cell", cell)
            }
        }
    }, [selected])

    const observer = {
        next: (cell: cell) => {
            console.log("cell", cell)
            setValue(cell.value)
        }
    }


    const selectedStyes: string = "bg-sky-500"
    
    const Types: any = {
        [TypeCell.BLACK]: () => {
            const v = value as [number, number]
            return (

                <div className={`${general_styles} grid grid-rows-2 bg-sky-500/70 relative  ${diagonal_styles}   `}>
                    <p className="row-span font-bold text-3xl sm:text-4xl justify-self-end">{v[0]!= 0 && v[0]}</p>
                    <p className="font-bold text-3xl sm:text-4xl">{v[1]!= 0 && v[1]}</p>
                </div>
                )
        
        }
        ,
        [TypeCell.WHITE]: () => {
            const v = value as number
            return (
            <div onClick={handleClick} className={`${general_styles} ${selected ? selectedStyes : 'hover:bg-sky-500/50  bg-sky-500/20'} flex justify-center items-center`}>
                <p className="font-bold text-3xl sm:text-4xl">{v != 0 && v}</p>
            </div>
        
        )},
        [TypeCell.BLOCKED]: () => (
            <div className={`${general_styles} `}>
            </div>
        ),
    }
    const handleClick = () => {
        pickCell(cell.i,cell.j)
    }
    return (
        <>
            {Types[cell.type]()}
        </>
    )
}





