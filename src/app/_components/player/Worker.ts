import { re } from "mathjs";
import { TypeCell } from "../game_interface/TypeCell";
import { findPermutations } from "../lib/utils";
import { action } from "./Actions";
import { StateMessage, ActionMessage } from "./Message";

let win = false;

let tries = 0;

const LIMIT = 100000;

const memory = new Map<string, number[][]>();
const stack_cells = new Map<string,any>();

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
    if (stack_cells.size === 0) {
        for (let i = 0; i < r; i++) {
            for (let j = 0; j < c; j++) { 
                if (types[i][j] !== TypeCell.STACK) continue
                const [row_count, column_count] = getNumberOfInpuCells(board, types, i, j);
                stack_cells.set(`${i},${j}`,{i, j, row_permutations: get(board[i][j][0], row_count).slice(0), col_permutations: get(board[i][j][1], column_count).slice(0)});
            }
        }
        console.log("stack_cells before:", stack_cells);
        clean_permutation(board, types, stack_cells);
        console.log("stack_cells after:", stack_cells);
    }
    const actions: action[] = [];
    stack_cells.forEach((cell: any, key: string) => {
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


const clean_permutation = (board: any[][], types: TypeCell[][], stack_cells: Map<string,any>) =>{
    const [r, c] = [board.length, board[0].length];
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            if( types[i][j] !== TypeCell.INPUT) continue;
            const [row_count, column_count] = getStackCells(types, i, j);
            const row_key = `${i},${j-column_count}`;
            const col_key = `${i-row_count},${j}`;
            // console.log("position", `${i},${j}`, "row", row_key, "col", col_key );
            // console.log("array", "row", row_count, "col", column_count );
            if(stack_cells.has(row_key) && stack_cells.has(col_key)){
                matcher(stack_cells.get(row_key), stack_cells.get(col_key), column_count-1, row_count-1);
            }
            
        }
    }

}


const matcher = (row_stack_cell: any, column_stack_cell: any, i:  number,j: number ): void => {
    // let copy_row = [...row_stack_cell.row_permutations];
    // let copy_col = [...column_stack_cell.col_permutations];
    let row_per: Set<number[]> = new Set();
    let col_per: Set<number[]> = new Set();
    // console.log(i,j);
    // console.log("row_stack_cell before", row_stack_cell);
    // console.log("column_stack_cell before", column_stack_cell);
    for (let rper of row_stack_cell.row_permutations) {
        for (let cper of column_stack_cell.col_permutations) {
            if(rper[i] === cper[j]){
                row_per.add(rper);
                col_per.add(cper);
            }
        }
    }
    if (row_stack_cell.row_permutations.length < row_per.size) {
        console.log("algo fallo")
    }
    if (column_stack_cell.col_permutations.length < col_per.size) {
        console.log("algo fallo")
    }
    // row_stack_cell.row_permutations = Array.from(row_per);
    // column_stack_cell.col_permutations = Array.from(col_per);
    // console.log("copy_row", (copy_row));
    // console.log("row_per", (row_per));
    // console.log("copy_col", (copy_col));
    // console.log("col_per", (col_per));
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

const getStackCells = (types: Array<Array<TypeCell>>, i: number, j: number): Array<any> => {
    // To de column that means whe
    let [row_count, column_count] = [0, 0];
    let [di, dj] = [i, j];
    while(di >= 0 && types[di][j] === TypeCell.INPUT ){
        // in order to get the column we need to count the rows
        row_count++; 
        di--;
    }
    // Get the numbers of the column
    while(dj >= 0 && types[i][dj] === TypeCell.INPUT ){
        // in order to get the row we need to count the columns
        column_count++;
        dj--;
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