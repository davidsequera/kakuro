import { Board } from './_components/user_interface/Board'
import { Keyboard } from './_components/user_interface/Keyboard/Keyboard'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <Board r={5} c={5} />
      {/* <Keyboard /> */}
    </main>
  )
}
