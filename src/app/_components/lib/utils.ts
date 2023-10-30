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
