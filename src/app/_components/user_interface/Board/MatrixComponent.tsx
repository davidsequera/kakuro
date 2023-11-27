import React, { useEffect } from 'react'
import { TypeCell } from '../../game_interface/TypeCell'
import { CellInput } from '../CellComponets/CellInput'
import { CellBlocked } from '../CellComponets/CellBlocked'
import { CellStack } from '../CellComponets/CellStack'
import { Subscription, fromEvent } from 'rxjs'

export default function MatrixComponent({game, selectedCell, setSelectedCell}: any) {

    // listen keydown
    useEffect(() => {
        const subscription = listenKey()
        return () => {
        // console.log("unsubscribe")
        subscription.unsubscribe()
        }
    })
    const listenKey = (): Subscription =>{
        const keydown = fromEvent(document, 'keydown')
        // console.log("listen", game, selectedCell)
        return keydown.subscribe(handleKeyDown)
      }
      
      const handleKeyDown = (e: any ) => {
        const key = e.key as string
          const regex = RegExp('[0-9]')
          // console.log("key", key, selectedCell)
          if (game && selectedCell) {
            if (key === 'Backspace') {
              game.setCell(selectedCell.i, selectedCell.j, 0)
              return
            }
            if (regex.test(key)) {
              game.setCell(selectedCell.i, selectedCell.j, parseInt(key))
            }
        }
      }
    
    
    
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
