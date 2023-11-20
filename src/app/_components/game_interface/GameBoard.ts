import { Observer, Subject, map, merge } from "rxjs";
import { TypeCell, cell, cellValue } from "./TypeCell";
import { createBoard, createSimpleBoard } from "./CreateBoard";

export class GameBoard {
    private _board: Array<Array<any>> = [];
    private _types: Array<Array<TypeCell>> = [];
    private _solution: Array<Array<number>> = [];

    // Subjects
    private _subjects: Array<Array<Subject<cell> | [Subject<cell>, Subject<cell> ]>> = [];

    private _judge!: Observer<any>;
    public change_subject!: Subject<void>;

    private _stackCells_state: Map<string, boolean> = new Map<string, boolean>();
    

    constructor(private _r: number, private _c: number) {
        this._initBoard(_r, _c);
        this.saveSolution();
        this.cleanBoard();
        this.setInputCellsSubscriptions();
        this.setJudgeSubsctiption();
    }

    private _initBoard(r: number, c: number): void {
        if ( r < 5 && c < 5) {
            [this._board, this._types] = createSimpleBoard(r, c);
        }else{
            [this._board, this._types] = createBoard(r, c);
        }
    }

    private saveSolution(): void {
        this._solution = this._board.slice(0);
    }

    private cleanBoard(): void {
        // clean the board
        for (let i = 0; i < this._r; i++) {
            for (let j = 0; j < this._c; j++) {
                if (this._types[i][j] === TypeCell.INPUT){
                    this._board[i][j] = 0;
                }
            }
        }
    }
    private setInputCellsSubscriptions (): void{
        // Set the subjects of the black cells
        for (let i = 0; i < this._r; i++) {
            this._subjects[i] = [];
            for (let j = 0; j < this._c; j++) {
                if (this._types[i][j] === TypeCell.INPUT)
                    this._subjects[i][j] = new Subject<cell>();
            }
        }
        // subscribe to the black cells
        for (let i = 0; i < this._r; i++) {
            for (let j = 0; j < this._c; j++) {
                if (this._types[i][j] !== TypeCell.STACK) continue
                this.setStackCellsSubscriptions(this.getCell(i, j));
                this._stackCells_state.set(`${i}-${j}`, false);
            }
        }
    }


    private setStackCellsSubscriptions(cell: cell): void {
        const [rowCells, colCells ] = this.getStackCells(cell) as [Array<cell>, Array<cell>]
        // subscribe to the rows and columns
        const observable_rows  = merge(...rowCells.map(c => c.subject as Subject<cell>)).pipe(map(c => cell));
        const observable_cols = merge(...colCells.map(c => c.subject as Subject<cell>)).pipe(map(c => cell));
        // subscribe to the rows and columns
        const subjectRow = new Subject<cell>();
        const subjectCol = new Subject<cell>();

        observable_rows.subscribe(subjectRow);
        observable_cols.subscribe(subjectCol);

        // save the subjects
        this._subjects[cell.i][cell.j] = [subjectRow, subjectCol] as [Subject<cell>, Subject<cell> ];
    }


    private setJudgeSubsctiption(): void {
        this.change_subject = new Subject<void>();
        const stackCells = []
        for (let i = 0; i < this._r; i++) {
            for (let j = 0; j < this._c; j++) {
                if (this._types[i][j] !== TypeCell.STACK) continue
                stackCells.push(this.getCell(i, j));
            }
        }
        const observables = stackCells.flatMap((cell: cell) => cell.subject as [Subject<cell>, Subject<cell> ]);
        const observable = merge(...observables)
        // console.log('[setJudgeSubsctiption]', observables)
        this._judge = {
            next: (cell: cell) => {
                // console.log('[judge] next', this.getCell(cell.i, cell.j));
                this._stackCells_state.set(`${cell.i}-${cell.j}`, this.winStackCell(cell));
                this.change_subject.next();
            },
            error: (err: any) => {
                console.log('[judge] error', err);
            },
            complete: () => {
                console.log('[judge] complete');
            }
        }
        observable.subscribe(this._judge);

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
            subject: this._subjects[i][j]
        };
    }

    setCell(i: number, j: number, value: cellValue): void {
        if(this._types[i][j] !== TypeCell.INPUT) {
            console.error(`[setCell] cell ${i} ${j} is not an input cell`);
            return;
        }
        this._board[i][j] = value;
        const subject = this._subjects[i][j] as Subject<cell> ;
        subject.next(this.getCell(i, j));
    }


    // when the cell is black, and the sum of the row and the sum of the column are equal to the value of the cells in the row and column
    public winStackCell(cell: cell): boolean {
        // const [i, j] = [cell.i, cell.j];
        const [rowValue, colValue] = cell.value as [number, number];
        const [rowCells, colCells] = this.getStackCells(cell) as [Array<cell>, Array<cell>];
        
        const rowSum = rowCells.reduce((a, b) => a + (b.value as number), 0);
        const colSum = colCells.reduce((a, b) => a + (b.value as number), 0);
        // const rowSum = this._board[i].slice(1).reduce((a, b) => a + b, 0);
        // const colSum = this._board.map(r => r[j]).slice(1).reduce((a, b) => a + b, 0);
        // console.log('[winStackCell]',rowSum, colSum);
        return rowSum === rowValue && colSum === colValue;
    }

    public win(): boolean {
        return this._stackCells_state.size > 0 && Array.from(this._stackCells_state.values()).every(v => v);
    }

    // 
    private getStackCells(cell: cell): [Array<cell>, Array<cell>] | undefined {
        if(cell.type !== TypeCell.STACK) return;
        const [i, j] = [cell.i, cell.j];
        const rowCells: Array<cell> = [];
        const colCells: Array<cell> = [];
        // TODO: memoize
        // get rows
        for (let k = j+1; k < this._c && this._types[i][k] === TypeCell.INPUT; k++) {
            rowCells.push(this.getCell(i, k));
        }
        // get columns
        for (let k = i+1; k < this._r && this._types[k][j] === TypeCell.INPUT; k++) {
            colCells.push(this.getCell(k, j));
        }
        // console.log(`[getStackCells] ${cell.i} ${cell.j}`,rowCells, colCells);
        return [rowCells, colCells];
    }


    // Getters
    get board(): Array<Array<any>> {
        return this._board;
    }
    get types(): Array<Array<TypeCell>> {
        return this._types;
    }
    get judge(): Observer<any> {
        return this._judge;
    }
    get r(): number {
        return this._r;
    }
    get c(): number {
        return this._c;
    }

}