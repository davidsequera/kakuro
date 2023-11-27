import { PossibleAction, action } from "./Actions";
import { TypeCell } from "../game_interface/TypeCell";
import { findCombinations, findPermutations } from "../lib/utils";
import { ActionMessage } from "./Message";
import { MinHeap } from "../lib/priorityqueue";

const memory_permutation = new Map<string, number[][]>();
const memory_combination = new Map<string, number[][]>();

const stack_cells = new Map<string,any>();

const get_permutaions = (num: number, len: number ): number[][] => {
    const key = `${num}-${len}`;
    if (!memory_permutation.has(key)) {
        memory_permutation.set(key, findPermutations(num, len));
    }
    return memory_permutation.get(key)!;
}

const get_combinations = (num: number, len: number ): number[][] => {
    const key = `${num}-${len}`;
    if (!memory_combination.has(key)) {
        memory_combination.set(key, findCombinations(num, len));
    }
    return memory_combination.get(key)!;
}



export const  SearchPlay = (board: Array<Array<any>>, types: Array<Array<TypeCell>>) => {
    const [r, c] = [board.length, board[0].length];
    const plays= new MinHeap<PossibleAction>();

    // Get all possible plays
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
          // Get probable plays
          if (types[i][j] === TypeCell.INPUT) {
              const play = calculate_cell_combinations(board, types, {i, j, value: []});
              if (play.value.length > 0) {
                plays.enqueue(play, play.value.length);
              }
        }
      }
    }
  
    while (plays.length > 0) {
      const possibleAction = plays.dequeue()!.element!;
      const {i, j} = possibleAction;
      if (possibleAction.value.length === 0) {
        continue;
      }
  
      for (const num of possibleAction.value) {
        board[i][j] = num;
  
        // if (is_kakuro_complete(board)) {
        //   if (is_valid(kakuro)) {
        //     return true;
        //   }
        // }
  
        if (SearchPlay(board, types)) {
          return true;
        }
  
        board[i][j] = 0;
      }
    }
  
    // If no available moves, reach an unsolvable state
    return false;
}

const calculate_cell_combinations = (board: Array<Array<any>>, types: Array<Array<TypeCell>>, play: PossibleAction): PossibleAction =>{
    const [i, j] = [play.i, play.j];
    const [r_distance, c_distance] = getStackCellDistance(types, i, j);

    // const combinations = get_combinations(board[i][j][0], direction === TypeDirection.ROW ? r_distance : c_distance).slice(0);
    // const set = new Set(combinations.flatMap(cs => cs.map(c => c)));
    // play.value = Array.from(set);
    return play;
}




export const  BruteForcePlay = (board: Array<Array<any>>, types: Array<Array<TypeCell>>) => {
    const [r, c] = [board.length, board[0].length];
    let [i, j] = [0, 0];
    if (stack_cells.size === 0) {
        for (let i = 0; i < r; i++) {
            for (let j = 0; j < c; j++) { 
                if (types[i][j] !== TypeCell.STACK) continue
                const [row_count, column_count] = getNumberOfInputCells(board, types, i, j);
                stack_cells.set(`${i},${j}`,{i, j, row_permutations: get_permutaions(board[i][j][0], row_count).slice(0), col_permutations: get_permutaions(board[i][j][1], column_count).slice(0)});
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
            const [row_count, column_count] = getStackCellDistance(types, i, j);
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

}
// 
const getNumberOfInputCells = (board: Array<Array<any>>, types: Array<Array<TypeCell>>,i: number, j : number): [number, number, any[], any[]] => {
    const [r, c] = [board.length, board[0].length];
    let [row_count, column_count] = [0, 0];
    let [ii, jj] = [i+1, j+1];
    let [rvalues, cvalues]: [Array<any>, Array<any>] = [[], []];
    while(ii < r && types[ii][j] === TypeCell.INPUT ){
        column_count++;
        cvalues.push(board[ii][j]);
        ii++;
    }
    // Get the numbers of the column
    while(jj < c && types[i][jj] === TypeCell.INPUT ){
        row_count++;
        rvalues.push(board[i][jj]);
        jj++;
    }
    return [row_count, column_count, rvalues, cvalues];
}

const getStackCellDistance = (types: Array<Array<TypeCell>>, i: number, j: number): Array<any> => {
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

