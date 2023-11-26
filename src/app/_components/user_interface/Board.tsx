'use client'
import React, { useEffect, useRef, useState } from 'react'
import { GameBoard } from '../game_interface/GameBoard'
import { TypeCell, cell } from '../game_interface/TypeCell'
import { Subscription, fromEvent } from 'rxjs'
import { CellInput } from './CellComponets/CellInput'
import { CellBlocked } from './CellComponets/CellBlocked'
import { CellStack } from './CellComponets/CellStack'
import { action } from '../player/Actions'
import { StateMessage } from '../player/Message'
import Settings from './Settings/Settings'

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

  // create obserber and listen win
  useEffect(() => {
    const observer = {
      next: () => {
        setWin(game?.win() || false)
      }
    }
    if(game){
      const subject = game.change_subject
      const subscription = subject.subscribe(observer)
      return () => {
        // console.log("[board] unsubscribe")
        subscription.unsubscribe()
      }
    }
  })
  
  const pickCell = (i: number, j: number) => {
    if(selectedCell?.i == i && selectedCell?.j == j){
      setSelectedCell(undefined)
      return
    }
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
        }
    }
  }


  // machine player
  useEffect(() => {
    const worker = new Worker(new URL("../player/Worker.ts", import.meta.url ), { type: 'module' })
    workerRef.current = worker
    worker.onmessage = (e) => {
      const actions = e.data.actions
      actions.forEach((action: action) => {
        game?.setCell(action.i, action.j, action.value)
      });
      console.log('[MainThread]', e.data)
      const message: StateMessage = {board: game!.board, types: game!.types, state: game!.win(), response: "(Main thread)"}
      worker.postMessage(message)
    }
  })



  const  machinePlayer = async () => {
    const worker = workerRef.current
    if(worker){
      const message: StateMessage = {board: game!.board, types: game!.types, state: game!.win(), response: "(Main thread)"}
      worker.postMessage(message)
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
    <div className="board flex flex-col">
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

      {win && <h1 className="text-2xl m-2 italic font-sans text-sky-500 self-center hover:text-white cursor-pointer">You win!</h1>}
    </div>
    <Settings  play={machinePlayer}/>
    {/* <Image className='self-center' src="/bunny.gif" alt="logo" width={384/1.5} height={480/1.5} priority={false} /> */}
    </>
  )
}
