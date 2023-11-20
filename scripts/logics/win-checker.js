import { WON_TEXT } from "..";

function winChecker() {
  const statusTag = document.querySelector("#game_status");

  const cells = document.querySelectorAll(".cell");
  const cellsValue = [...cells]
    .map((cell) => +cell.textContent)
    .slice(0, cells.length - 1);

  // final situation
  if (cellsValue.findIndex((item) => !item) !== -1) return;

  const sortedValues = [...cellsValue].sort((a, b) => a - b);

  const isEqual = JSON.stringify(sortedValues) === JSON.stringify(cellsValue);

  if (isEqual) {
    statusTag.innerHTML = WON_TEXT;
    statusTag.classList.add("win-status");

    [...cells].forEach((cell) => {
      cell.classList.add("win-cell");
    });
  }
}

export default winChecker;
