import { SingletonPuzzleState, BRIEF_TEXT, checkResolvable } from "..";

function shuffle(puzzle) {
  const sortedArrayValues = [...puzzle].sort(() => Math.random() - 0.5);

  const isSolvable = checkResolvable(sortedArrayValues);

  return isSolvable ? sortedArrayValues : shuffle(puzzle);
}

function init(size) {
  const movesCounter = document.querySelector("#moves");
  const cells = [...document.querySelectorAll(".cell")];
  const statusTag = document.querySelector("#game_status");

  movesCounter.innerHTML = 0;
  statusTag.textContent = BRIEF_TEXT;

  const arrayValues = Array(size * size)
    .fill()
    .map((_, index) => index);

  const sortedArrayValues = shuffle(arrayValues);

  const chunks = Array(size)
    .fill()
    .map((_, index) => index + 1);

  const initState = chunks.map((chunkId) =>
    sortedArrayValues.slice((chunkId - 1) * size, chunkId * size)
  );

  SingletonPuzzleState.setState(initState);

  cells?.forEach((cell, index) => {
    cell.textContent = sortedArrayValues[index] ? sortedArrayValues[index] : "";
  });
}

export default init;
