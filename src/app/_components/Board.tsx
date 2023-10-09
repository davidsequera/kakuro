'use client'
import React, { useEffect, useState } from 'react'
import { Cell } from './Cell'
import { GameBoard } from './GameBoard/GameBoard'
import { cell } from './GameBoard/TypeCell'
import { Subscription, fromEvent } from 'rxjs'

export const Board = ({r, c}: any) => {

  const [game, setGame] = useState<GameBoard>()
  const [selectedCell, setSelectedCell] = useState<cell>()

  useEffect(() => {
    setGame(new GameBoard(r, c))
    return () => {
      setGame(undefined)
    }
  }, [r, c])
  
  useEffect(() => {
    const subscription = listenKey()
    return () => {
      console.log("unsubscribe")
      subscription.unsubscribe()
    }
  }, [game, selectedCell])

  const table = game?.board

  const gridStyles = {
    gridTemplateColumns: `repeat(${c}, auto)`,
    gridTemplateRows: `repeat(${r}, auto)`
  }

  const pickCell = (i: number, j: number) => {
    setSelectedCell(game?.getCell(i,j))
  }

  function listenKey(): Subscription{
    const keydown = fromEvent(document, 'keydown')
    console.log("listen", game, selectedCell)
    return keydown.subscribe(handleKeyDown)
  }

  const handleKeyDown = (e: any ) => {
      const key = e.key as string
      const regex = RegExp('[0-9]')
      console.log("key", key, selectedCell)
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


  return (
    <div className="board">
        <h1 className="text-6xl m-5 font-sans ">Kakuro</h1>
        <p>By David Sequera</p>
        <div className={`grid`} style={gridStyles}>
          {table?.flatMap((_, i) => (table[i].map((_, j) => <Cell selected={ selectedCell?.i == i &&  selectedCell?.j == j } pickCell={pickCell} key={`${i}-${j}`} id={`${i}-${j}`} cell={game?.getCell(i,j)} />)))}
      </div>
    </div>
  )
}
