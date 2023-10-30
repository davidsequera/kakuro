import { TypeCell, cell } from "./TypeCell";

// Algoritmh

export const createSimpleBoard = (r: number, c: number): [Array<Array<any>>,Array<Array<TypeCell>> ] => {
    const board: Array<Array<any>> = [];
    const types: Array<Array<TypeCell>> = [];
    for (let i = 0; i < r; i++) {
        board[i] = [];
        types[i] = [];
    }

    setSimpleInputCells(types, board, r, c);
    // Set the stack cells
    // Rows
    for (let i = 0; i < r; i++) {
        board[i][0] = [0, 0];
        types[i][0] = TypeCell.STACK;
        for (let j = 1; j < c; j++) {
            // row sum  
            board[i][0][0] += board[i][j] as number;
        }
    }
    // Columns
    for (let j = 0; j < c; j++) {
        board[0][j] = [0,0];
        types[0][j] = TypeCell.STACK;
        for (let i = 1; i < r; i++) {
            // column sum
            board[0][j][1] += board[i][j] as number;
        }
    }
    // Set the blocked cells
    types[0][0] = TypeCell.BLOCKED;
    return [board, types];
}


export const createBoard = (r: number, c: number): [Array<Array<any>>, Array<Array<TypeCell>>] => {
    const board: Array<Array<any>> = createMatrix(r, c, 0);
    const types: Array<Array<TypeCell>> = createMatrix(r, c, TypeCell.INPUT);

    setBlockedCellsBorder(types);
    // setInputCellsPath(types, board, r, c);
    setBlackCells(types, r, c);
    setInputCellsValue(types,board, r, c);
    setRowsStackCells(types, board, r, c);
    setColumnsStackCells(types, board, r, c);
    return [board, types];
}

// function pickRandomPositionLinear(matrix) {
//     const M = matrix.length;
//     const N = matrix[0].length;
//     const rowProbabilities = Array.from({ length: M }, (_, row) => 1 - (row/M));
//     const row = weightedRandom(rowProbabilities);
//     const col = Math.floor(Math.random() * N);
//     return { row, col };
//   }
  
//   // Helper function to perform weighted random selection
//   function weightedRandom(probabilities) {
//     const totalProbability = probabilities.reduce((a, b) => a + b, 0);
//     const randomValue = Math.random() * totalProbability;
//     let cumulativeProbability = 0;
//     for (let i = 0; i < probabilities.length; i++) {
//       cumulativeProbability += probabilities[i];
//       if (randomValue < cumulativeProbability) {
//         return i;
//       }
//     }
//   }
  
//   // Example usage:
//   const matrix = [
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9],
//   ];
//   const position = pickRandomPositionLinear(matrix);
//   console.log(position);
  




/*
    Auxiliar functions
*/ 

const createMatrix = <T>(rows: number, cols: number, def: T): Array<Array<T>>  => {
    const matrix: Array<Array<T>> = new Array(rows);
    for (let i = 0; i < rows; i++) {
        matrix[i] = new Array(cols);
        for (let j = 0; j < cols; j++) {
            matrix[i][j] =  def;
        }
    }
    return matrix;
}


// makes a matrix of r rows and c columns with the value 0
const setBlockedCellsBorder = (types: Array<Array<TypeCell>>): void => {
    const [r,  c] = [types.length, types[0].length];
    // Set the stack cells
    // Rows
    for (let i = 0; i < r; i++) {
        types[i][0] = TypeCell.BLOCKED;
    }
    // Column
    for (let j = 0; j < c; j++) {
        types[0][j] = TypeCell.BLOCKED;
    }

}

// set the black cells in the board with a random selection
const setBlackCells = (types: Array<Array<TypeCell>>, r: number, c: number): void => {
    const targetBlackCount = Math.floor((r * c) / 4);
    let currentBlackCount = 0;

    while (currentBlackCount < targetBlackCount) {
        const i = Math.floor(Math.random() * r);  // Generar fila aleatoria
        const j = Math.floor(Math.random() * c);  // Generar columna aleatoria
        if (types[i][j] !== TypeCell.BLOCKED) {
            types[i][j] = TypeCell.BLOCKED;
            currentBlackCount++;
        }
    }

}


const setInputCellsPath = (types: Array<Array<TypeCell>>, board: Array<Array<any>>, r: number, c: number): void => {
    const target = Math.floor((r * c) / 2);
    // Movements         [down, right, up, left]
    const movements = [ [1, 0], [0, 1], [-1, 0], [0, -1] ];
    let input_cells_count = 0;

    let i = Math.floor(Math.random() * r);  // Generar fila aleatoria
    let j = Math.floor(Math.random() * c);  // Generar columna aleatoria
    while (input_cells_count < target) {
        [i, j] = pickNextCell(i, j);
        if (types[i][j] !== TypeCell.INPUT) {
            types[i][j] = TypeCell.INPUT;
            input_cells_count++;
        }
    }

    function pickNextCell(u: number, v: number){
        let valid = false;
        do{
            const [di, dj] = movements[Math.floor(Math.random() * movements.length)];
            u = i + di  // Generar fila aleatoria
            v = j + dj  // Generar columna aleatoria
            if (u < 1 || u >= r || v < 1 || v >= c) continue;
            valid = true;
        }while(!valid)
        return [u, v];
    }
}




const setSimpleInputCells = (types: Array<Array<TypeCell>>,board: Array<Array<any>>,r: number,c: number) => {
    const sequence = new Set([1,2,3,4,5,6,7,8,9]);
    for (let i = 1; i < r; i++) {
        for (let j = 1; j < c; j++) {
            let [ii, jj] = [i-1, j-1];
            let excluded = new Set<number>();
            // Get the excluded numbers of the row
            while(ii >= 0 && types[ii][j] === TypeCell.INPUT ){
                excluded.add(board[ii][j]);
                ii--;
            }
            // Get the excluded numbers of the column
            while(jj >= 0 && types[i][jj] === TypeCell.INPUT ){
                excluded.add(board[i][jj]);
                jj--;
            }
            if( excluded.size === sequence.size){
                types[i][j] = TypeCell.BLOCKED;
                continue;
            }
            let included: Array<number> =  Array.from(sequence).filter((num) => !excluded.has(num)); 
            let index = Math.floor(Math.random() *included.length);
            board[i][j] = included[index];
            types[i][j] = TypeCell.INPUT;
        }
    }
}

const setInputCellsValue = (types: Array<Array<TypeCell>>,board: Array<Array<any>>, r: number,c: number) => {
    const sequence = new Set([1,2,3,4,5,6,7,8,9]);
    // Set the input cells
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            if (types[i][j] !== TypeCell.INPUT) continue;
            let [ii, jj] = [i-1, j-1];
            let excluded = new Set<number>();
            // Get the excluded numbers of the row
            while(ii >= 0 && types[ii][j] === TypeCell.INPUT ){
                excluded.add(board[ii][j]);
                ii--;
            }
            // Get the excluded numbers of the column
            while(jj >= 0 && types[i][jj] === TypeCell.INPUT ){
                excluded.add(board[i][jj]);
                jj--;
            }
            if( excluded.size === sequence.size){
                types[i][j] = TypeCell.BLOCKED;
                continue;
            }
            let included: Array<number> =  Array.from(sequence).filter((num) => !excluded.has(num)); 
            let index = Math.floor(Math.random() *included.length);
            board[i][j] = included[index];
            // types[i][j] = TypeCell.INPUT;
            console.log(i,j,board[i][j],excluded);
        }
    }
}



const setRowsStackCells = (types: Array<Array<TypeCell>>, board: Array<Array<any>>, r: number, c: number): void  => {
    // Iterate from the last row to the first
    for (let i = r - 1; i >= 0; i--) {
        let sum = 0;
        // Iterate from the last column to the first in the current row
        for (let j = c - 1; j >= 0; j--) {
            if (types[i][j] !== TypeCell.BLOCKED) {
                sum += board[i][j];
                continue;
            }
            if (sum > 0) {
                types[i][j] = TypeCell.STACK;
                board[i][j] = [sum, 0];
                sum = 0;
            }
        }
    }
}

const setColumnsStackCells = (types: Array<Array<TypeCell>>, board: Array<Array<any>>, r: number, c: number): void  => {
    // Iterate from the last column to the first
    // console.table(types);
    for (let j = c - 1; j >= 0; j--) {
        let sum = 0;
        // Iterate from the last row to the first in the current column
        for (let i = r - 1; i >= 0; i--) {
            if (types[i][j] !== TypeCell.BLOCKED && types[i][j] !== TypeCell.STACK) {
                sum += board[i][j] as number;
                continue
            } 
            if (sum > 0) {
                if(types[i][j] === TypeCell.STACK){
                    const num = board[i][j][0];
                    board[i][j] =  [num, sum];
                    sum = 0;
                }else{
                    types[i][j] = TypeCell.STACK;
                    board[i][j] = [0, sum];
                    sum = 0;
                }
            }
        }
    }
}


