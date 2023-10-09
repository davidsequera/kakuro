import React from 'react'
import { diagonal_styles, general_styles } from './styles'

export const CellBlack = ({cell}: any) => {
    const v = cell.value as [number, number]
    return (
        <div className={`${general_styles} grid grid-rows-2 bg-sky-500/70 relative  ${diagonal_styles}   `}>
            <p className="font-bold text-3xl sm:text-4xl justify-self-end">{v[0]!= 0 && v[0]}</p>
            <p className="font-bold text-3xl sm:text-4xl">{v[1]!= 0 && v[1]}</p>
        </div>
    )
}
