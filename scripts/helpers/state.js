let instance;
let puzzleState = [];

class State {
  constructor() {
    if (instance) {
      throw new Error("You can only create one instance!");
    }
    instance = this;
  }

  getInstance() {
    return this;
  }

  getState() {
    return puzzleState;
  }

  setState(state) {
    puzzleState = [...state.map((innerState) => [...innerState])];
  }

  change(prevPosition, nextPosition) {
    const { row: prevRow, column: prevColumn } = prevPosition;
    const { row: nextRow, column: nextColumn } = nextPosition;

    puzzleState[nextRow][nextColumn] = puzzleState[prevRow][prevColumn];
    puzzleState[prevRow][prevColumn] = "";
  }

  getEmptySlotPosition() {
    const copy = [...puzzleState.map((item) => [...item])];

    const emptySlotItem = copy.flat().findIndex((item) => !item);
    const size = puzzleState.length;

    return {
      row: Math.floor(emptySlotItem / size),
      column: emptySlotItem % size,
    };
  }
}

const SingletonPuzzleState = Object.freeze(new State());

export default SingletonPuzzleState;
