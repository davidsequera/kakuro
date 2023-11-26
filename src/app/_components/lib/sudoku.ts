class Sudoku {
    private m_Board: number[][];
  
    constructor(board: number[][]) {
      this.m_Board = board;
    }
  
    board(): number[][] {
      return this.m_Board;
    }
  }
  
  class Sudoku_H1_case {
    m_Idx: [number, number];
    m_Plays: number[];
  
    constructor(i: number, j: number, plays: number[]) {
      this.m_Idx = [i, j];
      this.m_Plays = plays;
    }
  }
  
  function IsValidMove(sudoku: Sudoku, row: number, col: number, value: number): boolean {
    // Implementation of IsValidMove function
    return true; // Placeholder, replace with actual logic
  }
  
  function is_sudoku_complete(board: number[][]): boolean {
    // Implementation of is_sudoku_complete function
    return true; // Placeholder, replace with actual logic
  }
  
  function is_valid(sudoku: Sudoku): boolean {
    // Implementation of is_valid function
    return true; // Placeholder, replace with actual logic
  }
  
  function Sudoku_H1_solver(sudoku: Sudoku): boolean {
    console.log(" --- INICIAL ---");
    console.log(sudoku.board());
    console.log(" ---------------");
  
    const b = sudoku.board();
    const N = b.length;
  
    const plays: Sudoku_H1_case[] = [];
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const play: number[] = [];
        if (b[i][j] === 0) {
          for (let v = 1; v <= N; v++) {
            if (IsValidMove(sudoku, i, j, v)) {
              play.push(v);
            }
          }
          if (play.length > 0) {
            plays.push(new Sudoku_H1_case(i, j, play));
          }
        }
      }
    }
  
    while (plays.length > 0) {
      const cell = plays.shift()!;
      const [i, j] = cell.m_Idx;
      if (cell.m_Plays.length === 0) {
        continue;
      }
  
      for (const num of cell.m_Plays) {
        sudoku.board()[i][j] = num;
  
        if (is_sudoku_complete(sudoku.board())) {
          if (is_valid(sudoku)) {
            console.log(' ---- FINAL ----');
            console.log('Moves:', cell.m_Plays);
            console.log(sudoku.board());
            console.log(' ---------------');
            return true;
          }
        }
  
        if (Sudoku_H1_solver(sudoku)) {
          return true;
        }
  
        sudoku.board()[i][j] = 0;
      }
    }
  
    // If no available moves, reach an unsolvable state
    return false;
  }
  
  // Example usage:
  const initialBoard: number[][] = [
    // Replace this with your initial Sudoku board
    // Example 9x9 Sudoku board (0 represents empty cells)
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];
  
  const sudoku = new Sudoku(initialBoard);
  Sudoku_H1_solver(sudoku);
  