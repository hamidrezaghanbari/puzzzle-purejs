import { winChecker } from ".";
import { SingletonPuzzleState } from "..";

function actions(size) {
  const puzzle = document.querySelector("#puzzle-wrapper");
  const moves = document.querySelector("#moves");
  const reset = document.querySelector(".btn");

  function actionHandler(event) {
    event.stopPropagation();
    const currentId = event.target.getAttribute("id");

    if (!event.target.textContent || currentId == null || isNaN(+currentId))
      return;

    const currentValue = event.target.textContent;

    let actPosition = {
      row: Math.floor(+currentId / size),
      column: +currentId % size,
    };

    const actElement = document.querySelector(
      `#puzzle-wrapper > .row:nth-child(${
        actPosition.row + 1
      }) > .cell:nth-child(${actPosition.column + 1})`
    );

    let emptyPosition = SingletonPuzzleState.getEmptySlotPosition();

    const targetElement = document.querySelector(
      `#puzzle-wrapper > .row:nth-child(${
        emptyPosition.row + 1
      }) > .cell:nth-child(${emptyPosition.column + 1})`
    );

    const isInTheSameRow = actPosition.row === emptyPosition.row;
    const isInTheSameColumn = actPosition.column === emptyPosition.column;
    const rowBoundary = Math.abs(actPosition.row - emptyPosition.row);
    const columnBoundary = Math.abs(actPosition.column - emptyPosition.column);

    const inBoundary = Math.abs(rowBoundary - columnBoundary) === 1;

    if ((isInTheSameColumn || isInTheSameRow) && inBoundary) {
      // change the state
      SingletonPuzzleState.change(actPosition, emptyPosition);

      // change the dom
      targetElement.innerHTML = currentValue;
      actElement.innerHTML = "";

      // check for win
      winChecker(size);

      moves.innerHTML = +moves.textContent + 1;
    }
  }

  puzzle.addEventListener("click", actionHandler);

  reset.addEventListener("click", () => {
    puzzle.removeEventListener("click", actionHandler);
  });
}

export default actions;
