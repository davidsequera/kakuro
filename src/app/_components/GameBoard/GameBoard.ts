import { Subject } from "rxjs";
import { TypeCell, cell, cellValue } from "./TypeCell";

export class GameBoard {
    private _board: Array<Array<any>> = [];
    private _solution: Array<Array<number>> = [];
    private _types: Array<Array<TypeCell>> = [];
    private _subjects: Array<Array<Subject<cell>>> = [];

    constructor(r: number, c: number) {
        this._initBoard(r, c);
        // ...
    }

    private _initBoard(r: number, c: number): void {
        // Set the white cells
        for (let i = 0; i < r; i++) {
            this._board[i] = [];
            this._types[i] = [];
            this._subjects[i] = [];
            for (let j = 0; j < c; j++) {
                this._board[i][j] = Math.round(Math.random() *8+1);
                this._types[i][j] = TypeCell.WHITE;
            }
        }
        // Set the black cells
        for (let i = 0; i < r; i++) {
            this._board[i][0] = [0, 0];
            this._types[i][0] = TypeCell.BLACK;
            for (let j = 1; j < c; j++) {
                this._board[i][0][0] += this._board[i][j] as number;
            }
        }
        for (let j = 0; j < c; j++) {
            this._board[0][j] = [0,0];
            this._types[0][j] = TypeCell.BLACK;
            for (let i = 1; i < r; i++) {
                this._board[0][j][1] += this._board[i][j] as number;
            }
        }
        this._types[0][0] = TypeCell.BLOCKED;
        this._solution = this._board.slice(0)
        // clean the board
        for (let i = 1; i < r; i++) {
            for (let j = 1; j < c; j++) {
                this._board[i][j] = 0;
            }
        }
        // Set the subjects
        for (let i = 1; i < r; i++) {
            for (let j = 1; j < c; j++) {
                if (this._types[i][j] === TypeCell.WHITE || this._types[i][j] === TypeCell.BLACK)
                    this._subjects[i][j] = new Subject<cell>();
            }
        }
    }



    get board(): Array<Array<number>> {
        return this._board;
    }

    getCell(i: number, j: number): cell  {
        return {
            'i': i,
            'j': j,
            value: this._board[i][j],
            type: this._types[i][j],
            subject: this._subjects[i][j],
        };
    }

    setCell(i: number, j: number, value: cellValue): void {
        this._board[i][j] = value;
        this._subjects[i][j].next(this.getCell(i, j));
    }
}