// Kakuro cell types

import { Subject } from "rxjs";

export enum TypeCell{
    BLOCKED = 0, // cells that are not part of the game
    WHITE = 1, // cells that user can fill
    BLACK = 2, // cells that represent the sum of the row/column
}
// Kakuro cell types
// [f, c] -> f: sum of the row, c: sum of the column
export type cellValue = number | [number, number] ;

export type cell ={
    i: number,
    j: number,
    value: cellValue,
    type: TypeCell,
    subject?: Subject<cell>,
}


