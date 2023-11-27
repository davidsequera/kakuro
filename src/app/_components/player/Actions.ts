
export type action = {
    i: number,
    j: number,
    value: number
}

export enum TypeDirection {
    ROW = 0,
    COLUMN = 1,
}
// This ones over here are the probailities of the actions
export type PossibleAction = {
    i: number,
    j: number,
    direction: TypeDirection,
    value: number[]
}