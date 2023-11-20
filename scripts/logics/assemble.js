import { LevelObserver, PUZZLE_MAX_SIZE, PUZZLE_MIN_SIZE } from "..";
import { create, init, actions } from ".";

function assemble(size = 2) {
  if (size > PUZZLE_MAX_SIZE || size < PUZZLE_MIN_SIZE)
    throw "Not acceptable puzzle range!";

  create(size);
  init(size);
  actions(size);
}

LevelObserver.subscribe(assemble);

export default assemble;
