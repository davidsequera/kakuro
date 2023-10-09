import { Board } from './_components/Board'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <Board r={3} c={3} />
    </main>
  )
}
