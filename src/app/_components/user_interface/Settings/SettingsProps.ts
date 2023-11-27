export type SettingsProps = {
    setBoard: (r: number, c: number) => void,
    setBoardFromFile: (file: File) => void,
    play: (mode: string) => void,
    pause: () => void,
}