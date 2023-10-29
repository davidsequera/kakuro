'use client'
import React, { useEffect, useRef, useState } from 'react'
import { GameBoard } from '../game_interface/GameBoard'
import { TypeCell, cell } from '../game_interface/TypeCell'
import { Subscription, fromEvent } from 'rxjs'
import { CellInput } from './CellComponets/CellInput'
import { CellBlocked } from './CellComponets/CellBlocked'
import { CellStack } from './CellComponets/CellStack'
import Image from 'next/image'

export const Board = ({r, c}: any) => {
  const workerRef = useRef<Worker>();
  const [game, setGame] = useState<GameBoard>()
  const [win, setWin] = useState(false)
  const [selectedCell, setSelectedCell] = useState<cell>()

  // create game
  useEffect(() => {
    setGame(new GameBoard(r, c))
    return () => {
      setGame(undefined)
    }
  }, [r, c])
  
  // listen keydown
  useEffect(() => {
    const subscription = listenKey()
    return () => {
      // console.log("unsubscribe")
      subscription.unsubscribe()
    }
  })

  
  const pickCell = (i: number, j: number) => {
    setSelectedCell(game?.getCell(i,j))
    
  }
  
  function listenKey(): Subscription{
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
          setWin(game.win())
        }
    }
  }


  // machine player
  useEffect(() => {
    const worker = new Worker(new URL("../player/Worker.ts", import.meta.url ), { type: 'module' })
    workerRef.current = worker
    worker.onmessage = (e) => {
      game?.setCell(e.data.i, e.data.j, e.data.value)
      console.log('Message received from worker', e.data)
    }
  })



  const  machinePlayer = async () => {
    const worker = workerRef.current
    if(worker){
      worker.postMessage({board: game?.board, types: game?.types, response: "hola soy el hilo principal"})
    }else{
      console.log("no worker")
    }
  }






  const gridStyles = {
    gridTemplateColumns: `repeat(${c}, auto)`,
    gridTemplateRows: `repeat(${r}, auto)`
  }
  const table = game?.board

  return (
      <>
      <Image className='self-center' src="/bunny.gif" alt="logo" width={384/1.5} height={480/1.5} priority={false} />

    <div className="board flex flex-col">
        <h1 className="text-6xl m-5 font-sans ">Kakuro</h1>
        <p>By David Sequera</p>
        <div className={`grid`} style={gridStyles}>
          {table?.flatMap((row, i) =>
             (row.map((_, j) =>
                  {
                    const cell = game!.getCell(i,j)
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
          }
      </div>
      <button className=" p-5 m-10 bg-sky-400 rounded-full self-center" onClick={machinePlayer}>
        Machine player
      </button>
      {win && <h1 className="text-2xl m-5 font-sans sky-500 ">You win!</h1>}
    </div>
    </>
  )
}
