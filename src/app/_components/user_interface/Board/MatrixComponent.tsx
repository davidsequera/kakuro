import React from 'react'
import { TypeCell } from '../../game_interface/TypeCell'
import { CellInput } from '../CellComponets/CellInput'
import { CellBlocked } from '../CellComponets/CellBlocked'
import { CellStack } from '../CellComponets/CellStack'

export default function MatrixComponent({game, selectedCell, setSelectedCell}: any) {
    const pickCell = (i: number, j: number) => {
        if(selectedCell?.i == i && selectedCell?.j == j){
          setSelectedCell(undefined)
          return
        }
        setSelectedCell(game.getCell(i,j))
        
    }

    const gridStyles = {
        gridTemplateColumns: `repeat(${game.c}, auto)`,
        gridTemplateRows: `repeat(${game.r}, auto)`
    }
  return (
    <div className={`grid`} style={gridStyles}> {game.board?.flatMap((row: any, i: number) =>
        (row.map((_: any, j: any) =>
             {
               const cell = game.getCell(i,j)
               if(cell.type === TypeCell.INPUT){
                 return <CellInput key={`${i}-${j} `} selected={ selectedCell?.i == i &&  selectedCell?.j == j } pickCell={pickCell}  cell={cell}/>
               }
               if(cell.type === TypeCell.BLOCKED){
                 return <CellBlocked key={`${i}-${j}`} />
               }                    
               if(cell.type === TypeCell.STACK){
                 return <CellStack key={`${i}-${j}`} cell={cell} game={game} />
               }                   
             }
           )
         )
       )
     }</div>
  )
}
