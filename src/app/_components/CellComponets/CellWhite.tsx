import React, { useEffect, useState } from 'react'
import { general_styles, selectedStyes } from './styles'
import { TypeCell, cellValue, cell } from '../GameBoard/TypeCell'

export const CellWhite = ({pickCell, selected, cell}: any) => {

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

    const handleClick = () => {
        pickCell(cell.i,cell.j)
    }
    return (
        <div onClick={handleClick} className={`${general_styles} ${selected ? selectedStyes : 'hover:bg-sky-500/50  bg-sky-500/20'} flex justify-center items-center`}>
            <p className="font-bold text-3xl sm:text-4xl">{value != 0 && value}</p>
        </div>
    )
}
