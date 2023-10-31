import { re } from "mathjs";
import { TypeCell } from "../game_interface/TypeCell";
import { findPermutations } from "../lib/utils";
import { action } from "./Actions";
import { StateMessage, ActionMessage } from "./Message";

let win = false;

let tries = 0;

const LIMIT = 1000;

const memory = new Map<string, number[][]>();
const stack_cells = Array<any>();

const get = (num: number, len: number ): number[][] => {
    const key = `${num}-${len}`;
    if (!memory.has(key)) {
        memory.set(key, findPermutations(num, len));
    }
    return memory.get(key)!;
}

// Listen for messages from the worker
self.onmessage = (e) => {
    const response: StateMessage = e.data;
    win = response.state;
    if(!win && tries++ < LIMIT){
        postMessage(play(e.data.board, e.data.types));
    }
};




const  play = (board: Array<Array<any>>, types: Array<Array<TypeCell>>) => {
    const [r, c] = [board.length, board[0].length];
    let [i, j] = [0, 0];
    if (stack_cells.length === 0) {
        for (let i = 0; i < r; i++) {
            for (let j = 0; j < c; j++) { 
                if (types[i][j] !== TypeCell.STACK) continue
                const [row_count, column_count] = getNumberOfInpuCells(board, types, i, j);
                stack_cells.push({i, j, row_permutations: get(board[i][j][0], row_count), col_permutations: get(board[i][j][1], column_count)});
            }
        }
    }
    console.log("stack_cells:", stack_cells);
    const actions: action[] = [];
    stack_cells.forEach((cell: any) => {
        const [i, j] = [cell.i, cell.j];
        const [row_permutations, col_permutations] = [cell.row_permutations, cell.col_permutations];
        const row_per = row_permutations[Math.floor(Math.random() * row_permutations.length)]
        const col_per = col_permutations[Math.floor(Math.random() * col_permutations.length)]
        if(row_per)
            row_per.forEach((value: number, index: number) => {
                actions.push({i, j: j+index+1, value});
            });        
        if(col_per)
            col_per.forEach((value: number, index: number) => {
                actions.push({i: i+index+1, j, value});
            });
    })
    const response: ActionMessage = {actions, response: "ok"};
    return response;
}


const getNumberOfInpuCells = (board: Array<Array<any>>, types: Array<Array<TypeCell>>,i: number, j : number): [number, number] => {
    const [r, c] = [board.length, board[0].length];
    let [row_count, column_count] = [0, 0];
    let [ii, jj] = [i+1, j+1];
    while(ii < r && types[ii][j] === TypeCell.INPUT ){
        column_count++;
        ii++;
    }
    // Get the numbers of the column
    while(jj < c && types[i][jj] === TypeCell.INPUT ){
        row_count++;
        jj++;
    }
    return [row_count, column_count];
}



// const machinePlayer = async () => {
//     console.log("machine player");
  
//     if (game) {
//       console.log("Comenzando resolución automática...");
  
//       // Inicializa un array para rastrear los números ganados
//       const wonNumbers: number[] = [];
//       const usedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
//       // Inicializa un objeto para rastrear las celdas ganadas
//       const wonCells: { row: number, col: number, number: number }[] = [];
  
//       do {
//         for (let i = 0; i < game.r; i++) {
//           for (let j = 0; j < game.c; j++) {
//             const cell = game.getCell(i, j);
  
//             if (cell.type === TypeCell.INPUT && cell.value === 0) {
//               let exclusionList = getExclusionList(game.board, i, j);
//               const availableNumbers = getAvailableNumbers(usedNumbers, exclusionList);
  
//               if (availableNumbers.length === 0) {
//                 // No se pueden asignar números, así que reseteamos la celda a cero
//                 game.setCell(i, j, 0);
//                 exclusionList = [];
//               } else {
//                 const randomIndex = Math.floor(Math.random() * availableNumbers.length);
//                 const valueToSet = availableNumbers[randomIndex];
//                 exclusionList.push(valueToSet);
//                 game.setCell(i, j, valueToSet);
//                 exclusionList = [];
//                 // Comprueba si el número ganado completa una pila
//                 if (game.winStackCell(cell)) {
//                   wonNumbers.push(valueToSet);
//                   wonCells.push({ row: i, col: j, number: valueToSet });
//                 }
//               }
//             }
//           }
//           game.cleanBoard();
//         }
//       } while (!game.allStacksWin(game));
  
//       console.log("Resolución automática completada.");
  
//       console.log("Números ganados:", wonNumbers);
//       console.log("Celdas ganadas:", wonCells);
//     } else {
//       console.log("El juego no está definido.");
//     }
//   };
  
  
//   // Esta función toma los números disponibles (todos los números menos los excluidos) y los números utilizados y devuelve los números que aún no se han utilizado.
//   function getAvailableNumbers(usedNumbers: number[], exclusionList: number[]): number[] {
//     const availableNumbers: number[] = [];
  
//     for (let i = 1; i <= 9; i++) {
//       if (!usedNumbers.includes(i) && !exclusionList.includes(i)) {
//         availableNumbers.push(i);
//       }
//     }
  
//     return availableNumbers;
//   }

// // Definición de tu función exclusionList (o getExclusionList) aquí
// function getExclusionList(board: Array<Array<any>>, row: number, column: number): number[] {
//   const exclusionList: number[] = [];

//   for (let j = 0; j < board[row].length; j++) {
//       if (board[row][j] !== null && board[row][j] !== 0) {
//           exclusionList.push(board[row][j]);
//       }
//   }

//   for (let i = 0; i < board.length; i++) {
//       if (board[i][column] !== null && board[i][column] !== 0) {
//           exclusionList.push(board[i][column]);
//       }
//   }

//   return exclusionList;
// }