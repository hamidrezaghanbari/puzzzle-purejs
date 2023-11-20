
function create(size) {
  const puzzleWrapper = document.querySelector("#puzzle-wrapper");
  // reset game
  puzzleWrapper.innerHTML = "";

  for (let row = 0; row < size; row++) {
    const rowElement = document.createElement("div");
    rowElement.className = "row";

    for (let column = 0; column < size; column++) {
      const columnElement = `<div class="cell" id='${
        row * size + column
      }'></div>`;

      rowElement.insertAdjacentHTML("beforeend", columnElement);
    }

    puzzleWrapper.appendChild(rowElement);
  }
}

export default create;
