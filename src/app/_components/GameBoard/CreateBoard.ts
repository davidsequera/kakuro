import { TypeCell, cell } from "./TypeCell";

// Algoritmh

export const createSimpleBoard = (r: number, c: number): [Array<Array<any>>,Array<Array<TypeCell>> ] => {
    const board: Array<Array<any>> = [];
    const types: Array<Array<TypeCell>> = [];
    for (let i = 0; i < r; i++) {
        board[i] = [];
        types[i] = [];
    }

    setInputCells(r,c,board, types);
    // Set the stack cells
    // Rows
    for (let i = 0; i < r; i++) {
        board[i][0] = [0, 0];
        types[i][0] = TypeCell.STACK;
        for (let j = 1; j < c; j++) {
            board[i][0][0] += board[i][j] as number;
        }
    }
    // Column
    for (let j = 0; j < c; j++) {
        board[0][j] = [0,0];
        types[0][j] = TypeCell.STACK;
        for (let i = 1; i < r; i++) {
            board[0][j][1] += board[i][j] as number;
        }
    }
    // Set the blocked cells
    types[0][0] = TypeCell.BLOCKED;
    return [board, types];
}


export const createBoard = (r: number, c: number): [Array<Array<any>>,Array<Array<TypeCell>> ] => {
    const board: Array<Array<any>> = [];
    const types: Array<Array<TypeCell>> = [];
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            board[i][j] = Math.round(Math.random() *8+1);
            types[i][j] = TypeCell.INPUT;
        }
    }
    setBlockedCellsBorder(board, types);

    // TODO create a board with a unique solution
    // delete this line
    return createSimpleBoard(r, c);
}


/*
    Auxiliar functions
*/ 

const setInputCells = (r: number,c: number, board: Array<Array<any>>, types: Array<Array<TypeCell>>) => {
    const sequence = new Set([1,2,3,4,5,6,7,8,9]);
    // Set the input cells
    for (let i = 0; i < r; i++) {
        let s = new Set(sequence);
        for (let j = 0; j < c; j++) {
            let ant = new Set();
            for (let ii = i; ii >= 0; ii--) {
                ant.add(board[ii][j]);
            }
            for (let jj = j; jj >= 0; jj--) {
                ant.add(board[i][jj]);
            }
            console.log(ant);
            // s = new Set([...s].filter(x => !ant.has(x)));
            
            // let index = Math.round(Math.random() *sequence.size-1);
            board[i][j] = Math.round(Math.random() *8+1);
            // s.splice(index, 1);
            types[i][j] = TypeCell.INPUT;
        }
    }
}

// makes a matrix of r rows and c columns with the value 0
const setBlockedCellsBorder = (board: Array<Array<any>>, types: Array<Array<TypeCell>>): any => {
    const [r,  c] = [board.length, board[0].length];
    // Set the stack cells
    // Rows
    for (let i = 0; i < r; i++) {
        board[i][0] = 0;
        types[i][0] = TypeCell.BLOCKED;
    }
    // Column
    for (let j = 0; j < c; j++) {
        board[0][j] = 0;
        types[0][j] = TypeCell.BLOCKED;
    }

}

const setBlackCells = (board: Array<Array<any>>, types: Array<Array<TypeCell>>): void => {
    const [r,  c] = [board.length, board[0].length];
    const targetBlackCount = Math.floor((r * c) / 3);
    let blackCellsCount = 0;
    while (blackCellsCount < targetBlackCount) {
        const i = Math.floor(Math.random() * r);  // Generar fila aleatoria
        const j = Math.floor(Math.random() * c);  // Generar columna aleatoria

        if (types[i][j] !== TypeCell.STACK ) {
            board[i][j] = 'X';
            blackCellsCount++;
        }
    }

    return ;
}




function fillBlackCells(k: any, r: any, c: any) : any {
    const targetBlackCount = Math.floor((r * c) / 3);
    let currentBlackCount = 0;

    while (currentBlackCount < targetBlackCount) {
        const i = Math.floor(Math.random() * r);  // Generar fila aleatoria
        const j = Math.floor(Math.random() * c);  // Generar columna aleatoria

        if (k[i][j] !== 'X') {
            k[i][j] = 'X';
            currentBlackCount++;
        }
    }

    return k;
}