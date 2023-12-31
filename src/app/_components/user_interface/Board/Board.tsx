'use client'
import React, { useEffect, useRef, useState } from 'react'
import { GameBoard } from '../../game_interface/GameBoard'
import { cell } from '../../game_interface/TypeCell'
import { action } from '../../player/Actions'
import { StateMessage } from '../../player/Message'
import Settings from '../Settings/Settings'
import MatrixComponent from './MatrixComponent'
import Loading from '../Loading'

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
    



  // machine player
  useEffect(() => {
    const worker = new Worker(new URL("../../player/Worker.ts", import.meta.url ), { type: 'module' })
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
  // For settings component
  const setBoard = (r: number, c: number) => {
    setGame(undefined)
    setGame(new GameBoard(r, c))
  }
  // For settings component
  const setBoardFromFile = (file: File) => {
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setGame(new GameBoard(0,0,content))
    };
    reader.readAsText(file);
  }


  return (
      <>
    <div className="board flex flex-col">
      { game ?
        <MatrixComponent game={game} selectedCell={selectedCell} setSelectedCell={setSelectedCell} />
        : <Loading />
      }
      {win && <h1 className="text-2xl m-2 italic font-sans text-sky-500 self-center hover:text-white cursor-pointer">You win!</h1>}
    </div>
    {game && <Settings pause={() => {console.log("TODO")}} setBoard={setBoard} setBoardFromFile={setBoardFromFile}  play={machinePlayer}/>}
    {/* <Image className='self-center' src="/bunny.gif" alt="logo" width={384/1.5} height={480/1.5} priority={false} /> */}
    </>
  )
}
