import { Subject, merge } from "rxjs";
import { TypeCell, cell, cellValue } from "./TypeCell";
import { createBoard, createSimpleBoard } from "./CreateBoard";

export class GameBoard {
    private _board: Array<Array<any>> = [];
    private _solution: Array<Array<number>> = [];
    private _types: Array<Array<TypeCell>> = [];
    private _subjects: Array<Array<Subject<cell> | [Subject<cell>, Subject<cell> ]>> = [];

    constructor(private r: number, private c: number) {
        this._initBoard(r, c);
        this.saveSolution();
        this.cleanBoard();
        this.setInputCellsSubscriptions();

    }

    private _initBoard(r: number, c: number): void {
        if ( r < 5 && c < 5) {
            [this._board, this._types] = createSimpleBoard(r, c);
        }else{
            [this._board, this._types] = createBoard(r, c);
        }
    }
    private setInputCellsSubscriptions (): void{
        // Set the subjects of the black cells
        for (let i = 0; i < this.r; i++) {
            this._subjects[i] = [];
            for (let j = 0; j < this.c; j++) {
                if (this._types[i][j] === TypeCell.INPUT)
                    this._subjects[i][j] = new Subject<cell>();
            }
        }
        // subscribe to the black cells
        for (let i = 0; i < this.r; i++) {
            for (let j = 0; j < this.c; j++) {
                this.setStackCellsSubscriptions(this.getCell(i, j));
            }
        }
    }

    private saveSolution(): void {
        this._solution = this._board.slice(0);
    }
    private cleanBoard(): void {
        // clean the board
        for (let i = 0; i < this.r; i++) {
            for (let j = 0; j < this.c; j++) {
                if (this._types[i][j] === TypeCell.INPUT){
                    this._board[i][j] = 0;
                }
            }
        }
    }


    private setStackCellsSubscriptions(cell: cell): void {
        if(cell.type !== TypeCell.STACK) return;
        const input_cells = this.getStackCells(cell)
        const rowCells = input_cells[0];
        const colCells = input_cells[1];
        // subscribe to the rows and columns
        const observable_rows  = merge(...rowCells.map(c => c.subject));
        const observable_cols = merge(...colCells.map(c => c.subject));
        // subscribe to the rows and columns
        const subjectRow = new Subject<cell>();
        const subjectCol = new Subject<cell>();

        observable_rows.subscribe(subjectRow);
        observable_cols.subscribe(subjectCol);

        // save the subjects
        this._subjects[cell.i][cell.j] = [subjectRow, subjectCol];
    }


    get board(): Array<Array<any>> {
        return this._board;
    }


    solved(): boolean {
        return this._board.every((row, i) => row.every((cell, j) => cell === this._solution[i][j]));
    }

    getCell(i: number, j: number): cell  {
        return {
            'i': i,
            'j': j,
            value: this._board[i][j],
            type: this._types[i][j],
            subject: this._subjects[i][j] as Subject<cell>,
        };
    }

    setCell(i: number, j: number, value: cellValue): void {
        this._board[i][j] = value;
        
        const subject = this._subjects[i][j];
        if (Array.isArray(subject)) {
            subject.forEach(s => s.next(this.getCell(i, j)));
        } else {
            subject.next(this.getCell(i, j));
        }
    }

    // when the cell is black, and the sum of the row and the sum of the column are equal to the value of the cells in the row and column
    winStackCell(cell: cell): boolean {
        // const [i, j] = [cell.i, cell.j];
        const [rowValue, colValue] = cell.value as [number, number];
        const [rowCells, colCells] = this.getStackCells(cell);
        const rowSum = rowCells.reduce((a, b) => a + (b.value as number), 0);
        const colSum = colCells.reduce((a, b) => a + (b.value as number), 0);
        // const rowSum = this._board[i].slice(1).reduce((a, b) => a + b, 0);
        // const colSum = this._board.map(r => r[j]).slice(1).reduce((a, b) => a + b, 0);
        // console.log('[winStackCell]',rowSum, colSum);
        return rowSum === rowValue && colSum === colValue;
    }


    private getStackCells(cell: cell): [Array<cell>, Array<cell>] {
        const [i, j] = [cell.i, cell.j];
        const rowCells: Array<cell> = [];
        const colCells: Array<cell> = [];
        // TODO: memoize
        // get rows
        for (let k = j+1; k < this.c && this._types[i][k] === TypeCell.INPUT; k++) {
            rowCells.push(this.getCell(i, k));
        }
        // get columns
        for (let k = i+1; k < this.r && this._types[k][j] === TypeCell.INPUT; k++) {
            colCells.push(this.getCell(k, j));
        }
        console.log(`[getStackCells] ${cell.i} ${cell.j}`,rowCells, colCells);
        return [rowCells, colCells];
    }
}