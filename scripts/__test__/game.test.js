import { beforeEach, describe, expect, it, vi } from "vitest";

import fs from "fs";
import path from "path";
import { Window } from "happy-dom";
import {
  BRIEF_TEXT,
  PUZZLE_MAX_SIZE,
  PUZZLE_MIN_SIZE,
  assemble,
  checkResolvable,
  create,
  init,
  reset,
  winChecker,
} from "..";

const htmlDocPath = path.join(process.cwd(), "index.html");
const htmlDocumentContent = fs.readFileSync(htmlDocPath).toString();

const window = new Window();
const document = window.document;

vi.stubGlobal("document", document);

const puzzleSize =
  Math.floor(Math.random() * (PUZZLE_MAX_SIZE - PUZZLE_MIN_SIZE) + 1) +
  PUZZLE_MIN_SIZE;

beforeEach(() => {
  // clean up for each test
  document.body.innerHTML = "";
  document.write(htmlDocumentContent);
});

describe("create(puzzleSize)", () => {
  it("When pass dynamic size, should create proper size puzzle elements", () => {
    // Arrange
    create(puzzleSize);

    // Act
    const rowsResult = document.querySelectorAll(".row");
    const cellsResult = document.querySelectorAll(".cell");

    // Assert
    expect(rowsResult).to.length(puzzleSize);
    expect(cellsResult).to.length(puzzleSize * puzzleSize);
  });
});

describe("init(puzzleSize)", () => {
  it("When init puzzle, init puzzle game with proper inbound range values", () => {
    // Arrange
    create(puzzleSize);
    init(puzzleSize);

    // Act
    const moves = document.querySelector("#moves").textContent;
    const gameStatus = document.querySelector("#game_status").textContent;
    const cells = document.querySelectorAll(".cell");
    const cellsValues = cells?.map((cell) => +cell.textContent);

    // Assert
    expect(moves).toEqual("0");
    expect(gameStatus).toEqual(BRIEF_TEXT);

    cellsValues?.forEach((cellValue) => {
      expect(+cellValue).toBeGreaterThanOrEqual(0);
      expect(+cellValue).toBeLessThanOrEqual(puzzleSize * puzzleSize - 1);
    });
  });

  it("When init puzzle, init puzzle game with resolvable values", () => {
    // Arrange
    create(puzzleSize);
    init(puzzleSize);

    // Act
    const cells = document.querySelectorAll(".cell");
    const cellsValues = cells?.map((cell) => +cell.textContent);

    // Assert
    expect(checkResolvable(cellsValues)).toBe(true);
  });
});

describe("checkResolvable(), with sub functions", () => {
  it("When call checkResolvable with unresolvable value, it should return false", () => {
    // Arrange
    const unresolvable4Puzzle = [1, 0, 2, 3];

    const unresolvable9Puzzle = [8, 1, 2, 0, 4, 3, 7, 6, 5];

    const unresolvable16Puzzle = [
      3, 9, 1, 15, 14, 11, 4, 6, 13, 0, 10, 12, 2, 7, 8, 5,
    ];

    [unresolvable4Puzzle, unresolvable9Puzzle, unresolvable16Puzzle].forEach(
      (puzzle) => {
        // Act
        const resolvableResult = checkResolvable(puzzle);

        // Assert
        expect(resolvableResult).toBe(false);
      }
    );
  });
});

describe("reset()", () => {
  it("When reset is called, it should reset the game with proper texts", () => {
    // Arrange
    const moves = document.querySelector("#moves");
    const gameStatus = document.querySelector("#game_status");

    // Act
    reset();

    // Assert
    expect(moves.innerHTML).toBe("0");
    expect(gameStatus.innerHTML).toBe(BRIEF_TEXT);
  });
});

describe("assemble(puzzleSize)", () => {
  it("When assemble the game with outbound size, should throw an error", () => {
    // Arrange
    const overflowRandomValue = Math.floor(Math.random() * 100 + 1);

    const higherOutRangeSize = PUZZLE_MAX_SIZE + overflowRandomValue;
    const lowerOutRangeSize = PUZZLE_MIN_SIZE - overflowRandomValue;

    // Act
    const result1 = () => assemble(higherOutRangeSize);
    const result2 = () => assemble(lowerOutRangeSize);

    // Assert
    expect(result1).toThrowError(/Not acceptable puzzle range!/);
    expect(result2).toThrowError(/Not acceptable puzzle range!/);
  });
});

describe("winChecker()", () => {
  it("When winChecker is called with in progress situation, it shouldn't change the style of the game", () => {
    // Arrange
    assemble(puzzleSize);
    const cells = [...document.querySelectorAll(".cell")];

    // Act
    winChecker();
    const winCells = cells?.find((cell) =>
      cell.getAttribute("class").includes("win-cell")
    );

    // Assert
    expect(winCells).toBe(undefined);
  });

  it("When winChecker is called in the win situation, it should show wining style puzzle", () => {
    // Arrange
    assemble(puzzleSize);
    const cells = [...document.querySelectorAll(".cell")];
    cells?.forEach((cell, idx) => {
      cell.innerHTML = cells?.length - 1 === idx ? "" : idx + 1;
    });

    // Act
    winChecker();
    const winCells = cells?.filter((cell) =>
      cell.getAttribute("class").includes("win-cell")
    );

    // Assert
    expect(winCells?.length).toBe(cells?.length);
  });
});

describe("actions()", () => {
  let actionableIds = [];

  beforeEach(() => {
    assemble(puzzleSize);

    const cells = document.querySelectorAll(".cell");
    const cellsValue = [...cells].map((cell) => cell?.innerHTML);

    const formattedCellsValue = [];

    // chunk by puzzle size
    for (let index = 0; index < cellsValue.length; index += puzzleSize) {
      formattedCellsValue.push(cellsValue.slice(index, index + puzzleSize));
    }

    const emptyPosition = cellsValue.findIndex((cell) => !cell);

    const emptyPositionRow = Math.floor(emptyPosition / puzzleSize);
    const emptyPositionColumn = emptyPosition % puzzleSize;

    const actionableItems = [
      formattedCellsValue?.[emptyPositionRow - 1]?.[emptyPositionColumn],
      formattedCellsValue?.[emptyPositionRow + 1]?.[emptyPositionColumn],
      formattedCellsValue?.[emptyPositionRow]?.[emptyPositionColumn - 1],
      formattedCellsValue?.[emptyPositionRow]?.[emptyPositionColumn + 1],
    ]?.filter((item) => !!item);

    actionableIds = actionableItems?.map((item) =>
      cellsValue?.findIndex((cell) => cell == item)
    );
  });

  it("When click on not moveable tills, it shouldn't move any tills", () => {
    // Arrange
    const cells = document.querySelectorAll(".cell");
    const cellsValue = [...cells].map((cell) => cell?.innerHTML);

    // Act
    [...cells]?.forEach((cell, index) => {
      if (!actionableIds?.includes(index)) cell.click();
    });

    const cellsAfterAction = document.querySelectorAll(".cell");
    const cellsValueAfterAction = [...cellsAfterAction]?.map(
      (cell) => cell.innerHTML
    );

    // Assert
    const isTheSame = cellsValue?.every(
      (item, index) => item === cellsValueAfterAction[index]
    );
    expect(isTheSame).toBe(true);
  });

  it("When click on moveable tills, it should move tills", () => {
    // Arrange
    const cells = document.querySelectorAll(".cell");
    const cellsValue = [...cells].map((cell) => cell?.innerHTML);

    // Act
    [...cells]?.forEach((cell, index) => {
      if (actionableIds?.includes(index)) cell.click();
    });

    const cellsAfterAction = document.querySelectorAll(".cell");
    const cellsValueAfterAction = [...cellsAfterAction]?.map(
      (cell) => cell.innerHTML
    );

    // Assert
    const isNotTheSame = cellsValue?.some(
      (item, index) => item !== cellsValueAfterAction[index]
    );
    expect(isNotTheSame).toBe(true);
  });
});
