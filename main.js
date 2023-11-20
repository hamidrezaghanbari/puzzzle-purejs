import { assemble, reset } from "./scripts";
import "./style.css";

(function () {
  const size = 2;

  assemble(size);
  
  const resetButton = document.querySelector(".btn")
  resetButton.addEventListener('click', reset)
})();
