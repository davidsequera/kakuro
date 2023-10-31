import { TypeCell } from '../game_interface/TypeCell';
import { action } from './Actions';

export type Message = {
    id?: string,
    response: string,
}

export type ActionMessage = Message & {
    actions: action[]
}

export type StateMessage = Message & {
    state: boolean
    board: Array<Array<any>>,
    types: Array<Array<TypeCell>>
}

