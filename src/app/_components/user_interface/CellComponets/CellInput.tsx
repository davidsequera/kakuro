import React, { useEffect, useState } from 'react'
import { cell_border_color, cell_general_styles, cell_selectedStyes } from '../styles'
import { TypeCell, cellValue, cell } from '../../game_interface/TypeCell'

export const CellInput = ({pickCell, selected, cell, gsize}: any) => {

    const [value, setValue] = useState<cellValue>(cell.value)
    
    useEffect(() => {
        if (cell.type === TypeCell.INPUT) {
            const subject = cell.subject
            const subscription = subject.subscribe(observer)
            return () => {
                // console.log("[cell input] unsubscribe")
                subscription.unsubscribe()
                // console.log("cell", cell)
            }
        }
    })

    const observer = {
        next: (cell: cell) => {
            // console.log("[obserbable] cell", cell)
            setValue(cell.value)
        }
    }

    const handleClick = () => {
        pickCell(cell.i,cell.j)
    }
    return (
        <div onClick={handleClick} className={`${cell_general_styles} ${cell_border_color} ${selected ? cell_selectedStyes : 'hover:bg-sky-500/50  bg-sky-500/20'} flex justify-center items-center`}>
            <p className="font-bold text-3xl sm:text-4xl">{value != 0 && value}</p>
        </div>
    )
}
