import { Board } from './_components/user_interface/Board/Board'
import { Keyboard } from './_components/user_interface/Keyboard/Keyboard'
import Image from 'next/image'
export default function Home() {
  const props = {
    r: 4,
    c: 4,
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-5">
      <h1 className="text-6xl m-5 font-sans ">Kakuro</h1>
      <p>By David Sequera</p>
      {/* <Image src="logo.svg" width={150} height={150} alt="logo kakuro"/> */}
      <Board {...props} />
      {/* <Keyboard /> */}
    </main>
  )
}
