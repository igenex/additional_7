/* module.exports = */
function solveSudoku(matrix) {
  // your solution
  let sudokuSolver = {
    init() {
      "use strict";
      this.matrix = matrix;
      this.cubeMatrix = [];
      this.positions = [];
      this.modifiedSudoku = [];
      this.initializeMatrix();
    },
    initializeMatrix() {
      "use strict";
      this.modifiedSudoku = Array.prototype.slice.call(this.matrix);
      let iteratorEight = this.getIterator(8, 3);
      for (let i = 0, j = 0, k = 0, length = this.matrix.length; i < length; i++) {
        this.modifiedSudoku[i] = this.modifiedSudoku[i].map((currentCell, k) => {
          if (!(k % 3) || k === 0) {
            j = iteratorEight.next();
          }
          if (!this.cubeMatrix[j]) this.cubeMatrix[j] = [];
          this.cubeMatrix[j].push(currentCell);

          return [currentCell, []];
        });

        this.findZeroPosition(i, k);
      }
/*      console.log("Positions\r\n=================")
      console.log(this.positions);
      console.log("cubeMatrix\r\n=================")
      console.log(this.cubeMatrix);
      console.log("modifiedSudoku\r\n=================")
      console.log(this.modifiedSudoku);*/
    },
    getIterator(max, repeat) {
      "use strict";
      let index = 0,
        num = 0,
        count = 1,
        data = [num, num + 1, num + 2],
        length = data.length,
        element = [];

      return {
        next: function () {
          if (!this.hasNext()) {
            if (!(count++ % 3)) {
              if (count < max) this.setCounter(num += 3);
              else if (!(counter < repeat)) {
                this.setCounter();
                return null;
              }
            }
            index = 0;
          }
          element = data[index++];
          return element;
        },
        hasNext: function () {
          return index < length;
        },
        rewind: function () {
          index = 0;
        },
        current: function () {
          return data[index];
        },
        setCounter: function (num) {
          "use strict";
          data = num ? [num, num + 1, num + 2] : [];
        }
      }
    },
    findZeroPosition(row, column) {
      "use strict";
      column = this.matrix[row].indexOf(0);
      if (column > -1) {
        do {
          this.positions.push([row, column]);
          column = this.matrix[row].indexOf(0, ++column);
        }
        while (column > -1)
      }
    },
    findInRow(rowNumber, colNumber) {
      "use strict";
      return this.matrix[rowNumber].filter(num => num > 0);

    },
    findInCol(colNumber, rowNumber, rowNumberArray) {
      "use strict";

      let tempColArray = [];
      this.matrix.forEach(row => {
        tempColArray.push(row[colNumber]);
      });

      return tempColArray.filter(num => {
        if (!~rowNumberArray.indexOf(num) && num > 0) {
          return true;
        }
      });

    },
    findCubePositionByNumberCoords(row, column) {
      "use strict";

      if (row < 3) {
        return cubePosition(0);
      } else if (row > 2 && row < 6) {
        return cubePosition(3);
      } else {
        return cubePosition(6);
      }

      function cubePosition(num) {
        if (column < 3) {
          return num;
        } else if (column > 2 && column < 6) {
          return num + 1;
        } else {
          return num + 2;
        }
      }

    },
    findInCube(row, column, numbersInAColumn, numbersInARow) {
      "use strict";
      let cubePosition = this.findCubePositionByNumberCoords(row, column);

      return this.cubeMatrix[cubePosition].filter(num => {
        if (!~numbersInAColumn.indexOf(num) && num > 0) {
          if (!~numbersInARow.indexOf(num)) {
            return true;
          }
        }
      });
    },
    findRequiredNumer(array) {
      "use strict";
      for (let i = 0, max = array.length; i < max; i++) {
        if (i !== (array[i] - 1)) {
          array.splice(i, 0, i + 1);
          return i + 1;
        }
      }
      return 9;
    },
    solver() {
      "use strict";
      for (let i = 0, max = this.positions.length; i < max; i++) {

        let [row, column] = this.positions[i];
        let numbersInARow = this.findInRow(row, column);
        let numbersInAColumn = this.findInCol(column, row, numbersInARow);
        let numbersInACube = this.findInCube(row, column, numbersInAColumn, numbersInARow);
        let allNumbers = [];
        allNumbers = [...numbersInARow, ...numbersInAColumn, ...numbersInACube];
        allNumbers.sort((a, b) => a - b);
        this.modifiedSudoku[row][column][1]= allNumbers;

        //Если у позиции остался один вариант то вычисляем и ставим его
        if (this.modifiedSudoku[row][column][1].length === 8) {
          //Вычисляем и ставим число вместо 0
          let requiredNumber = this.findRequiredNumer(this.modifiedSudoku[row][column][1]);
          this.modifiedSudoku[row][column][0] = requiredNumber;
          this.matrix[row][column] = requiredNumber;
          this.positions[i] = [];
        }
        console.log(`position: ${[row]}_${[column]} - ${this.modifiedSudoku[row][column][0]} : ${this.modifiedSudoku[row][column][1]}`);
      }
      this.positions = this.positions.filter(item => item.length > 0);
      console.log(`Остаток: ${this.positions.length}`);
      console.log(this.positions);
    },
    solverIterate() {
      "use strict";
      let max = 1;
      while (this.positions.length > 0 && max < 4) {
        this.solver();
        max++;
      }
      console.log(this.matrix);
      console.log(this.modifiedSudoku[1][1]);
      return this.matrix;
    }
  };
  let solver = Object.create(sudokuSolver);
  solver.init(matrix);
  solver.solverIterate();
};


let sudoku2 = [[6, 5, 0, 7, 3, 0, 0, 8, 0],
  [0, 0, 0, 4, 8, 0, 5, 3, 0],
  [8, 4, 0, 9, 2, 5, 0, 0, 0],
  [0, 9, 0, 8, 0, 0, 0, 0, 0],
  [5, 3, 0, 2, 0, 9, 6, 0, 0],
  [0, 0, 6, 0, 0, 0, 8, 0, 0],
  [0, 0, 9, 0, 0, 0, 0, 0, 6],
  [0, 0, 7, 0, 0, 0, 0, 5, 0],
  [1, 6, 5, 3, 9, 0, 4, 7, 0]];

solveSudoku(sudoku2);