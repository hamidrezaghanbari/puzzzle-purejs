// If N is odd, then puzzle instance is solvable if number of inversions is even in the input state.
// example: 3*3, 5*5, 7*7, etc.
function checkResolvableOddPuzzle(puzzle) {
  const evenOrOdd = findInversionCount(puzzle);

  return evenOrOdd === "even";
}

// If N is even, puzzle instance is solvable if
// the blank is on an even row counting from the bottom (second-last, fourth-last, etc.) and number of inversions is odd.
// the blank is on an odd row counting from the bottom (last, third-last, fifth-last, etc.) and number of inversions is even.
// 2*2, 4*4, 6*6, etc.
function checkResolvableEvenPuzzle(puzzle) {
  const evenOrOdd = findInversionCount(puzzle);
  const findDistanceFromBottomEvenOrOdd =
    findEmptyPositionRowFromBottom(puzzle);

  return (
    (findDistanceFromBottomEvenOrOdd === "even" && evenOrOdd === "odd") ||
    (findDistanceFromBottomEvenOrOdd === "odd" && evenOrOdd === "even")
  );
}

function findInversionCount(puzzle) {
  const copyPuzzle = [...puzzle];

  copyPuzzle.splice(
    puzzle.findIndex((i) => !i),
    1
  );

  let inversionCount = 0;

  copyPuzzle.forEach((item, index) => {
    inversionCount += copyPuzzle
      .slice(index + 1, copyPuzzle.length)
      .filter((nextItem) => item > nextItem)?.length;
  });

  return inversionCount % 2 === 0 ? "even" : "odd";
}

function findEmptyPositionRowFromBottom(puzzle) {
  const emptyItemIndex = puzzle.findIndex((i) => !i);
  const puzzleSize = Math.sqrt(puzzle.length);

  return (puzzleSize - Math.ceil((emptyItemIndex + 1) / puzzleSize) + 1) % 2 ===
    0
    ? "even"
    : "odd";
}

function checkResolvable(puzzle) {
  const sideSize = Math.sqrt(puzzle.length);

  return sideSize % 2 == 0
    ? checkResolvableEvenPuzzle(puzzle)
    : checkResolvableOddPuzzle(puzzle);
}

export default checkResolvable;

