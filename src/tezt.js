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
    this.cubeNumberCoords = [];
    this.hiddenLoner = false;
    this.error = [];
    this.numberInsered = false;

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
    let numberList = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = 0, j = 0, k = 0, length = this.matrix.length; i < length; i++) {
      this.modified[i] = this.modified[i].map((currentCell, k) => {
        if (!(k % 3) || k === 0) {
          j = iteratorEight.next();
        }
        if (!this.cubeMatrix[j]) this.cubeMatrix[j] = [];
        this.cubeMatrix[j].push([currentCell, [], [i, k]]);

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

  Sudoku.prototype.clearCandidatesCache = function () {
    "use strict";
    this.candidatesCache = {};
  };

  Sudoku.prototype.countCandidats = function (candidat) {
    for (let i = 0, max = candidat.length; i < max; i++) {
      if (!candidat[i][0]) continue;
      candidat[i][0].forEach(currentCandidat => {
        if (!this.candidatesCache[currentCandidat] && candidat[i][0] !== 0) {
          this.candidatesCache[currentCandidat] = [];
          this.candidatesCache[currentCandidat][0] = 0;
          this.candidatesCache[currentCandidat][1] = [];
        }

        if (this.candidatesCache[currentCandidat][0] > 1) {
          this.candidatesCache[currentCandidat][1] = false;
          return true;
        } else {
          this.candidatesCache[currentCandidat][0]++;
          this.candidatesCache[currentCandidat][1] = candidat[i][1];
        }
      })
    }
    // console.log(this.candidatesCache);
  };

  Sudoku.prototype.findUniqueCandidate = function (row, col) {

    let candidates = Object.keys(this.candidatesCache);
    let result = [];

    for (let i = 0, max = candidates.length; i < max; i++) {
      if (this.candidatesCache[candidates[i]][0] === 1) {
        result.push([candidates[i], this.candidatesCache[candidates[i]][1]]);
      }
    }


    this.clearCandidatesCache();
    if (result.length >= 1) {

      let tempResult = [];
      result.forEach(res => {
        "use strict";
        if (res[1].toString() === [row, col].toString()) {
          tempResult.push(res[0]);
        }
      });

      if (tempResult.length === 1) {
        return tempResult[0];
      }
    }

    return false;
  };

  Sudoku.prototype.findInRow = function (row, col) {
    "use strict";
    if (this.modified[row][col][1].length === 9) {
      this.modified[row][col][1] = (sudoku.diff(this.modified[row][col][1], (this.matrix[row]).filter(number => number > 0)));
    } else {
      try {
        this.modified[row][col][1] = this.modified[row][col][1].filter(number => {
          if (!(this.matrix[row].indexOf(number) > -1)) return true;
        });
      } catch (e) {
        this.error.push(e, "Значение уже заполнено")
      }
    }

  };


  Sudoku.prototype.findCandidatsInRow = function (row) {
    let tempArr = [];
    this.modified[row].forEach((candidat, i) => {
      "use strict";
      if (candidat[1]) tempArr.push([candidat[1], [row, i]]);
    });

    this.countCandidats(tempArr);
  };


  Sudoku.prototype.findInCol = function (colNumber, rowNumber) {
    "use strict";

    let tempColArray = []; //Для обычных цифр
    let tempColArrayCandidats = []; //Кандидаты
    this.modified.forEach((row, i) => {
      if (row[colNumber][0] > 0) {
        tempColArray.push(row[colNumber][0]);
      }

      if (/*i !== rowNumber && */row[colNumber][1]) {
        tempColArrayCandidats.push([row[colNumber][1], [i, colNumber]]);
      }
    });

    tempColArrayCandidats.forEach((array, i) => {
      tempColArrayCandidats[i][0] = array[0].filter(num => {
        if(!(tempColArray.indexOf(num) > -1)) {
          return true;
        }
      });
    });

    this.modified[rowNumber][colNumber][1] = this.modified[rowNumber][colNumber][1].filter(num => {
      if (!(tempColArray.indexOf(num) > -1) && num > 0) {
        return true;
      }
    });

    this.countCandidats(tempColArrayCandidats);

  };

  Sudoku.prototype.cleanCubeCandidatNumbers = function (row, column) {
    this.cubeNumberCoords = this.cubeNumberCoords.filter(coords => {
      "use strict";
      if (!(coords[0] === row || coords[1] === column)) {
        return true;
      }
    })
  };


  Sudoku.prototype.findInCube = function (row, column) {
    "use strict";
    let cubePosition = this.findCubePosition(row, column);
    let cubeArray = this.cubeMatrix[cubePosition];

    let tempArray = [];

    cubeArray.forEach((numberArray, i) => {
      if (numberArray[0] > 0) {
        tempArray.push(numberArray[0]);
      }

      this.cubeNumberCoords.push(numberArray[2]);
    });

    //Чистим массив с координатами в кубе от координат чисел которые уже есть в кэше
    this.cleanCubeCandidatNumbers(row, column);

    let cubeNumbers = new Set();
    tempArray.forEach(numbers => cubeNumbers.add(numbers));

    this.modified[row][column][1] = this.modified[row][column][1].filter(num => {
      if (!(cubeNumbers.has(num))) {
        return true;
      }
    });
  };

  Sudoku.prototype.findCandidatsInCube = function () {
    let tempArr = [];
    this.cubeNumberCoords.forEach(coords => {
      "use strict";
      let [row, column] = coords;
      tempArr.push([this.modified[row][column][1], coords]);
    });
    this.cubeNumberCoords = [];
    this.countCandidats(tempArr);
  };

  Sudoku.prototype.insertNumber = function (number, row, column) {
    this.matrix[row][column] = number;
    this.modified[row][column][0] = number;
    this.modified[row][column][1] = false;

    let [cubeRow, cubeColumn] = this.modified[row][column][2];
    this.cubeMatrix[cubeRow][cubeColumn][0] = number;
    this.numberInsered = true;
  };

  Sudoku.prototype.findCubePosition = function (row, column) {
    "use strict";
    return this.modified[row][column][2][0];
  };

  Sudoku.prototype.removeFromQueue = function (i) {
    this.positions.splice(i, 1, false);
  };

  Sudoku.prototype.cycle = function (times) {
    let i = 0;
    while (/*this.positions.length > 0 ||*/ i < times) {
      i++;
      this.hiddenLoner = (this.positionsCache === this.positions.length);
      this.positions = this.positions.filter(item => item);
      this.positionsCache = this.positions.length;
      this.lonersIterator();

      console.log("================");
      console.log(`Осталось: ${this.positions.length} позиций == ${i} проход`);
      console.log(this.matrix);
    }
  };

  Sudoku.prototype.lonersIterator = function () {
    for (let i = 0, max = this.positions.length; i < max; i++) {
      let [row, column] = this.positions[i];

      if (!this.modified[row][column][1]) continue;

      this.singleLoner(row, column, i);

    }
  };

  Sudoku.prototype.singleLoner = function (row, column, i) {
    "use strict";

    let requiredNumber = [];

    if (row === 7 && column === 1) {
      let a = "asb";
    }

    let testCandidate = new Set();

    this.findInRow(row, column);

    this.findCandidatsInRow(row, column);
    testCandidate.add(this.findUniqueCandidate(row, column));

    this.findInCol(column, row);
    testCandidate.add(this.findUniqueCandidate(row, column));

    this.findInCube(row, column);
    this.findCandidatsInCube();
    testCandidate.add(this.findUniqueCandidate(row, column));

    if (!(testCandidate.size === 1 && testCandidate.has(false))) {
      for (let price of testCandidate.values()) {
        if (price) {
          requiredNumber = price;
        }
      }
    }


    if (this.modified[row][column][1].length === 1 || requiredNumber > 0) {

      let number;

      if (requiredNumber > 0) {
        number = +requiredNumber;
      } else {
        number = this.modified[row][column][1][0];
      }

      this.insertNumber(number, row, column);
      this.removeFromQueue(i);
    }


    console.log(`${this.modified[row][column][0]} : Position: [${row}][${column}] Estimated: ${this.modified[row][column][1]}`);

  };

  sudoku.diff = function (arr1, arr2) {
    "use strict";
    return arr1.filter(el => arr2.indexOf(el) === -1).concat(arr2.filter(el => arr1.indexOf(el) === -1));
  };


  sudoku.initializeMatrix();
  sudoku.cycle(6);

}


let sudoku2 = [[0, 5, 0, 0, 7, 0, 0, 0, 1],
  [8, 7, 6, 0, 2, 1, 9, 0, 3],
  [0, 0, 0, 0, 3, 5, 0, 0, 0],
  [0, 0, 0, 0, 4, 3, 6, 1, 0],
  [0, 4, 0, 0, 0, 9, 0, 0, 2],
  [0, 1, 2, 0, 5, 0, 0, 0, 4],
  [0, 8, 9, 0, 6, 4, 0, 0, 0],
  [0, 0, 0, 0, 0, 7, 0, 0, 0],
  [1, 6, 7, 0, 0, 2, 5, 4, 0]];

solveSudoku(sudoku2);