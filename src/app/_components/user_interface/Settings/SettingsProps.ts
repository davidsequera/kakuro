export type SettingsProps = {
    setBoard: (r: number, c: number) => void,
    setBoardFromFile: (file: File) => void,
    setBoardFromText: (text: string) => void,
    play: () => void,
    pause: () => void,
}