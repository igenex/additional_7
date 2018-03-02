/* module.exports = */
function solveSudoku(matrix) {
  // your solution
  function Sudoku(matrix) {
    "use strict";
    this.matrix = matrix;
    this.fullMatrix = [];
    this.cubeMatrix = [];
    this.positions = [];
    this.modified = [];
    this.positionsCache = 0;
    this.candidatesCache = {};

  }

  function getIterator(max, repeat, cycle) {
    "use strict";
    let index = 0, num = 0, count = 1, data = [num, num + 1, num + 2], length = data.length, element = [];

    return {
      next: function () {
        if (!this.hasNext()) {
          if (!(count++ % 3)) {
            if (count < max) this.setCounter(num += 3);
            else if (!(count < repeat)) {
              if (!cycle) {
                this.setCounter();
                return null;
              } else {
                this.setCounter(0);
                num = 0;
                index = 0;
                count = 1;
              }
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
      current: function () {
        return data[index];
      },
      setCounter: function (num) {
        "use strict";
        data = (num || num === 0) ? [num, num + 1, num + 2] : [];
      }
    }
  }


  let sudoku = new Sudoku(matrix);

  Sudoku.prototype.initializeMatrix = function () {
    "use strict";
    this.modified = Array.prototype.slice.call(this.matrix);
    let iteratorEight = getIterator(8, 3, false);
    let iteratorEightForSecondParam = getIterator(8, 8, true);
    let numberList = [1,2,3,4,5,6,7,8,9];

    for (let i = 0, j = 0, k = 0, length = this.matrix.length; i < length; i++) {
      this.modified[i] = this.modified[i].map((currentCell, k) => {
        if (!(k % 3) || k === 0) {
          j = iteratorEight.next();
        }
        if (!this.cubeMatrix[j]) this.cubeMatrix[j] = [];
        this.cubeMatrix[j].push([currentCell, [], [i,k]]);

        //Возвращаем ячейку со значениями текуший номер, претенденты, адрес в кубе
        return [currentCell, currentCell ? false : Array.prototype.slice.call(numberList), [j, iteratorEightForSecondParam.next()]];
      });

      this.findZeroPosition(i, k);
    }

  };

  Sudoku.prototype.findZeroPosition = function (row, column) {
    "use strict";
    column = this.matrix[row].indexOf(0);
    if (column > -1) {
      do {
        this.positions.push([row, column]);
        column = this.matrix[row].indexOf(0, ++column);
      }
      while (column > -1)
    }
  };

  Sudoku.prototype.countCandidats = function (array) {
    array.forEach(candidat => {
      "use strict";
      if(!this.candidatesCache[candidat] && candidat !== 0) this.candidatesCache[candidat] = 0;
      this.candidatesCache[candidat]++;
    })
  };

  Sudoku.prototype.findInRow = function (row, col) {
    "use strict";
    if(this.modified[row][col][1].length === 9) {
      this.modified[row][col][1] = (sudoku.diff(this.modified[row][col][1], (this.matrix[row]).filter(number => number > 0)));
    }

    this.modified[row][col][1] = this.modified[row][col][1].filter(number => {
      if (!(this.matrix[row].indexOf(number) > 1)) return true;
    });

  };


  Sudoku.prototype.findCandidatsInRow = function (row) {
    let tempArr = [];
    for(let i = 0, max = this.modified[row].length; i < max; i++) {
      this.modified[row].forEach(candidat => {
        "use strict";
        tempArr = tempArr.concat(candidat[1]);
      });
    }

    this.countCandidats(tempArr);
  };


  Sudoku.prototype.findInCol = function (colNumber, rowNumber) {
    "use strict";

    let tempColArray = []; //Для обычных цифр
    let tempColArrayCandidats = []; //Кандидаты
    this.modified.forEach(row => {
      if(row[colNumber][0] > 0) {
        tempColArray.push(row[colNumber][0]);
      } else {
        tempColArrayCandidats = tempColArrayCandidats.concat(row[colNumber][1]);
      }

      this.countCandidats(tempColArrayCandidats);

    });


    return new Promise((resolve, reject) => {
      this.modified[rowNumber][colNumber][1] = this.modified[rowNumber][colNumber][1].filter(num => {
        if (!(tempColArray.indexOf(num) > -1) && num > 0) {
          return true;
        }
      });
      resolve();
    }).then(() => {
      /*console.log("After");
      console.log(this.modified[rowNumber][colNumber][1]);*/
    });

  };


  Sudoku.prototype.findInCube = function (row, column) {
    "use strict";
    let cubePosition = this.modified[row][column][2][0];
    let cubeArray = this.cubeMatrix[cubePosition];

    let tempArray = [];
    cubeArray.forEach((numberArray, i) => {
      if(numberArray[0] > 0){
        tempArray.push(numberArray[0]);
      }
    });

    let cubeNumbers = new Set();
    tempArray.forEach(numbers => cubeNumbers.add(numbers));

    this.modified[row][column][1] = this.modified[row][column][1].filter(num => {
      if(!(cubeNumbers.has(num))) {
        return true;
      }
    });
  };

  Sudoku.prototype.insertNumber = function (number, row, column) {
    this.matrix[row][column] = number;
    this.modified[row][column][0] = number;

    let [cubeRow, cubeColumn] = this.modified[row][column][2];
    this.cubeMatrix[cubeRow][cubeColumn][0] = number;
  };

  Sudoku.prototype.removeFromQueue = function (i) {
      this.positions.splice(i, 1, false);
  };

  Sudoku.prototype.cycle = function (times) {
    let i = 0;
    while(/*this.positions.length > 0 ||*/ i < times) {
/*      if(i === 1) {
        console.log("hey");
      }*/
      this.lonersIterator();
      i++;
    }
  };

  Sudoku.prototype.lonersIterator = function  () {
    for(let i = 0, max = this.positions.length; i < max; i++) {
      let [row, column] = this.positions[i];

      this.singleLoner(row, column, i);

    }
    this.positions = this.positions.filter(item => item);

    if(this.positionsCache === this.positions.length) {
      this.hiddenLoner();
    }

    this.positionsCache = this.positions.length;
    console.log("================");
    console.log(`Осталось: ${this.positions.length} позиций`);
    console.log(this.matrix);
  };

  Sudoku.prototype.hiddenLoner = function (row, column) {
    "use strict";





  };

  Sudoku.prototype.singleLoner = function (row, column, i) {
    "use strict";

      this.findInRow(row, column);
      this.findInCol(column, row);
      this.findInCube(row, column);



      if(this.modified[row][column][1].length === 1) {
        let number = this.modified[row][column][1][0];
        this.insertNumber(number, row, column);
        this.removeFromQueue(i);
      }



       console.log(`${this.modified[row][column][0]} : Position: [${row}][${column}] Estimated: ${this.modified[row][column][1]}`);

      /* if(i ==15) {
         break;
       }*/
  };

  sudoku.diff = function (arr1,arr2) {
    "use strict";
    return arr1.filter(el => arr2.indexOf(el) === -1).concat(arr2.filter(el => arr1.indexOf(el)===-1));
  };


  sudoku.initializeMatrix();
  sudoku.cycle(5);

}



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