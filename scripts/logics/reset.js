import { LevelObserver, BRIEF_TEXT } from "..";

function reset() {
  const moves = document.querySelector("#moves");
  const gameStatus = document.querySelector("#game_status");

  const gameLevel = +document.querySelector(".level").value;

  
  moves.innerHTML = 0;
  gameStatus.innerHTML = BRIEF_TEXT;

  
  LevelObserver.notify(gameLevel);
}

export default reset;
