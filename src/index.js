/*module.exports = */
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
      console.log("Positions\r\n=================")
      console.log(this.positions);
      console.log("cubeMatrix\r\n=================")
      console.log(this.cubeMatrix);
      console.log("modifiedSudoku\r\n=================")
      console.log(this.modifiedSudoku);
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
      if (!this.findInRow.cache) this.findInRow.cache = [];
      try{
      if (!this.findInRow.cache[rowNumber] ||
        (this.modifiedSudoku[rowNumber][colNumber][1].length !== this.findInRow.cache[rowNumber].length)) {
        this.findInRow.cache[rowNumber] = this.matrix[rowNumber].filter(num => num > 0);
      }
      } catch (e) {
        console.log(`Значение :this.modifiedSudoku[rowNumber][colNumber] - ${this.modifiedSudoku[rowNumber][colNumber]}
                     Значение rowNumber: ${rowNumber}
                     Значение colNumber: ${colNumber}`);
      }

      return this.findInRow.cache[rowNumber];

    },
    findInCol(colNumber, rowNumber, rowNumberArray) {
      "use strict";
      if (!this.findInCol.cache) this.findInCol.cache = [];

      if (!this.findInCol.cache[colNumber] ||
        (this.modifiedSudoku[rowNumber][colNumber][1].length !== this.findInCol.cache[colNumber].length)
      ) {

        let tempColArray = [];
        this.matrix.forEach(row => {
          tempColArray.push(row[colNumber]);
        });

        this.findInCol.cache[colNumber] = tempColArray.filter(num => {
          if (!~rowNumberArray.indexOf(num) && num > 0) {
            return true;
          }
        });

      }

      return this.findInCol.cache[colNumber];
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
      let keyWord = [row, column].toString();

      if (!this.findInCube.cache) this.findInCube.cache = [];

      if (!this.findInCube.cache[keyWord] ||
        this.modifiedSudoku[row][column][1].length !== this.findInRow.cache[keyWord].length) {
        this.findInCol.cache[keyWord] = this.cubeMatrix[cubePosition].filter(num => {
          if (!~numbersInAColumn.indexOf(num) && num > 0) {
            if (!~numbersInARow.indexOf(num)) {
              return true;
            }
          }
        });
      }

      return this.findInCol.cache[keyWord];
    },
    findRequiredNumer(array) {
      "use strict";
      for (let i = 0, max = array.length; i < max; i++) {
        if (i !== (array[i] - 1)) {
          array.splice(i, 0, i + 1);
          return i + 1;
        }
      }
    },
    solver() {
      "use strict";
        console.log(`Значение positions: ${this.positions[0]}`);
        this.positions.forEach((number, i) => {
          //this
          let [row, column] = number;
          let numbersInARow = this.findInRow(row, column);
          let numbersInAColumn = this.findInCol(column, row, numbersInARow);
          let numbersInACube = this.findInCube(row, column, numbersInAColumn, numbersInARow);
          let allNumbers = [...numbersInARow, ...numbersInAColumn, ...numbersInACube];
          allNumbers.sort((a, b) => a - b);
          this.modifiedSudoku[row][column][1].push(...allNumbers);

          //Если у позиции остался один вариант то вычисляем и ставим его
          if (this.modifiedSudoku[row][column][1].length === 8) {
            //Вычисляем и ставим число вместо 0
            let requiredNumber = this.findRequiredNumer(this.modifiedSudoku[row][column][1]);
            this.modifiedSudoku[row][column][0] = requiredNumber;
            this.matrix[row][column] = requiredNumber;
            this.positions[i].splice(i, 1);
          }
        });
        console.log(this.modifiedSudoku);
    },
    solverIterate() {
      "use strict";
      while(this.positions.length > 0) {
        this.solver();
      }
    }
  };
  let solver = Object.create(sudokuSolver);
  solver.init(matrix);
  solver.solverIterate();

}

/*let sudoku1 = [[5, 3, 4, 6, 7, 8, 9, 0, 0],
               [6, 7, 2, 1, 9, 5, 3, 4, 8],
               [1, 9, 8, 3, 4, 2, 5, 6, 7],
               [8, 5, 9, 7, 6, 1, 4, 2, 3],
               [4, 2, 6, 8, 5, 3, 7, 9, 1],
               [7, 1, 3, 9, 2, 4, 8, 5, 6],
               [9, 6, 1, 5, 3, 7, 2, 8, 4],
               [2, 8, 7, 4, 1, 9, 6, 3, 5],
               [3, 4, 5, 2, 8, 6, 1, 7, 9]];
*/
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