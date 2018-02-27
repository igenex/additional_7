/*module.exports = */
function solveSudoku(matrix) {
  // your solution
  let sudokuSolver = {
    init() {
      "use strict";
      this.matrix = matrix;
      this.cubeMatrix = [];
      this.positions = [];
      this.initializeMatrix();
    },
    initializeMatrix() {
      "use strict";
      let modifiedSudoku = Array.prototype.slice.call(this.matrix);
      let cell = Object.create(null);
      let variatns = Array.prototype.slice.call([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      // let iteratorThree = this.getIterator(3,8);
      let iteratorEight = this.getIterator(8,3);
      for (let i = 0, j = 0, k = 0, length = this.matrix.length; i < length; i++) {
        modifiedSudoku[i] = modifiedSudoku[i].map((currentCell, k, array) => {
          if(!(k % 3) || k === 0) {
            j = iteratorEight.next();
          }

          if (currentCell === 0) {
            cell.status = null;
            cell.variants = variatns;
          } else {
            cell.status = "default";
            cell.variants = [];
          }
          if(!this.cubeMatrix[j]) this.cubeMatrix[j] = [];
          this.cubeMatrix[j].push([currentCell, cell]);

          return [currentCell, cell];
        });

        this.findZeroPosition(i, k);
      }
      console.log("Positions\r\n=================")
      console.log(this.positions);
      console.log("cubeMatrix\r\n=================")
      console.log(this.cubeMatrix);
      console.log("modifiedSudoku\r\n=================")
      console.log(modifiedSudoku);
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
            if(!(count++ % 3)) {
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
        setCounter : function (num) {
          "use strict";
          data = num ? [num, num + 1, num + 2] : [];
        }
      }
    },
    findZeroPosition(row, column) {
      "use strict";
      column = this.matrix[row].indexOf(0);
      if(column > -1){
        do {
          this.positions.push([row,column]);
          column = this.matrix[row].indexOf(0, ++column);
        }
        while(column > -1)
      }
    },
    findInRow() {
      "use strict";

    },
    findInCol() {
      "use strict";

    },
    findInCube() {
      "use strict";

    },
    solver () {
      "use strict";
      this.positions.forEach((number, i) => {
        //this
      })
    }
  };
  let solver = Object.create(sudokuSolver);
  solver.init(matrix);
  solver.solver();

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