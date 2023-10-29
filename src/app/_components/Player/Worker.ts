import { GameBoard } from "../game_interface/GameBoard";
import { TypeCell } from "../game_interface/TypeCell";


let win = false;

// Listen for messages from the worker
self.onmessage = (e) => {
    const {response}= e.data;
    console.log("[worker] me llego algo:",response);
    // machinePlayer(game);
    setInterval(() => {
        
        postMessage(play(e.data.board, e.data.types));
    }, 100)
};

const  play = (board: any, types: any) => {
    const [r, c] = [board.length, board[0].length];
    let [i, j] = [0, 0];
    do{
        i = Math.floor(Math.random() * r);  // Generar fila aleatoria
        j = Math.floor(Math.random() * c);  // Generar columna aleatoria
    }
    while (types[i][j] !== TypeCell.INPUT)
    const value = Math.floor(Math.random() *8 + 1);
    return {i, j, value, response: "Hola soy el worker"};

}