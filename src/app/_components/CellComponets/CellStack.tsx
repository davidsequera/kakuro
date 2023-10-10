import React, { useEffect, useState } from 'react'
import { border_color, diagonal_color, diagonal_styles, general_styles, incorrect_diagonal_color } from './styles'
import { Subject } from 'rxjs'
import { cell } from '../GameBoard/TypeCell'

export const CellStack = ({cell, game}: any) => {
    const v = cell.value as [number, number]
    const [correct, setCorrect ] = useState(true)


    useEffect(() => {
        const subject = cell.subject as [Subject<cell>, Subject<cell>]
        const subscription_row = subject[0].subscribe(observer)
        const subscription_col = subject[1].subscribe(observer)
        return () => {
            // console.log("[cell stack] unsubscribe")
            subscription_row.unsubscribe()
            subscription_col.unsubscribe()
        }
    })

    const observer = {
        next: (c: cell) => {
            // console.log("[obserbable] cell", c)
            setCorrect(game.winStackCell(cell))
        }
    }

    return (
        <div className={`${general_styles} ${diagonal_styles}  ${correct? border_color : 'border-red-500' } ${correct? 'bg-sky-500/70':'bg-red-500/70'} ${correct? diagonal_color : incorrect_diagonal_color}  relative grid grid-rows-2   `}>
            <p className="font-bold text-3xl sm:text-4xl justify-self-end">{v[0]!= 0 && v[0]}</p>
            <p className="font-bold text-3xl sm:text-4xl">{v[1]!= 0 && v[1]}</p>
        </div>
    )
}
