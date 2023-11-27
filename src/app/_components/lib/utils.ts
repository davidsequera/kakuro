const numbers: number[] = Array.from({ length: 9 }, (_, i) => i + 1); // Creates an array with numbers 1 to 9.
export function findPermutations(target: number, permutationLength: number): number[][] {
    function findPermutationsHelper(currentPermutation: number[]) {
        if (currentPermutation.length === permutationLength) {
            if (currentPermutation.reduce((acc, num) => acc + num, 0) === target) {
                result.push([...currentPermutation]);
            }
            return;
        }
        
        for (let i = 0; i < numbers.length; i++) {
            if (!used[i]) {
                currentPermutation.push(numbers[i]);
                used[i] = true;
                findPermutationsHelper(currentPermutation);
                currentPermutation.pop();
                used[i] = false;
            }
        }
    }

    const result: number[][] = [];
    const used: boolean[] = Array(numbers.length).fill(false);

    findPermutationsHelper([]);

    return result;
}


export function findCombinations(targetSum: number, numElements: number): number[][] {
    const results: number[][] = [];

    function backtrack(start: number, currentSum: number, combination: number[]): void {
        if (currentSum === targetSum && combination.length === numElements) {
            results.push([...combination]);
            return;
        }

        if (currentSum > targetSum || combination.length > numElements) {
            return;
        }

        for (let i = start; i <= 9; i++) {
            combination.push(i);
            backtrack(i + 1, currentSum + i, combination);
            combination.pop();
        }
    }

    backtrack(1, 0, []);

    return results;
}
