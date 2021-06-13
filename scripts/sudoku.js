window.onload = () => {
    new Sudoku();
}

class Sudoku {
    constructor(size = 3) {
        this.size = size;
        this.selectedSquare = null;
        this.selectedNumber = null;
        this.numbers = [];
        this.buildSudokuSquares();
        this.buildNumberList();
        this.buildSudoku();
        window.addEventListener('keydown', (event) => this.insertNumber(event))
    }

    buildSudokuSquares(layer = 0, container = document.body) {
        for (let i = 0; i < (layer ? Math.pow(this.size, 2) : 1); i++) {
            const square = document.createElement('div');

            square.classList.add('square');
            square.style = [
                `width: calc(100% / ${this.size})`,
                `height: calc(100% / ${this.size})`,
                `outline:${this.size - layer}px solid black`,
            ].join(';');

            container.appendChild(square);

            if (layer < this.size - 1) {
                this.buildSudokuSquares(layer + 1, square);
            } else {
                square.classList.add('holder');
                square.addEventListener('click', () => this.selectSquare(square))
            }
        }
    }

    buildNumberList() {
        const numberList = document.createElement('div');

        numberList.classList.add('number-list');

        for (let i = 0; i < Math.pow(this.size, 2); i++) {
            const elem = document.createElement('div');
            const number = (i + 1).toString(Math.pow(this.size, 2) + 1).toUpperCase();
            
            this.numbers.push(number);
            elem.innerHTML = number;
            numberList.appendChild(elem);
        }

        document.body.appendChild(numberList);
    }

    buildSudoku(seed) {
        const squaresElem = this.getSquareElementsInRow();
        let squares = Array(Math.pow(Math.pow(this.size, 2), 2)).fill(null);

        // 1 to 9
        for (let i = 1; i <= Math.pow(this.size, 2); i++) {
            // Place i n times
            for (let n = 0; n < Math.pow(this.size, 2); n++) {
                const dest = this.calculateDest(i, squares, squaresElem);

                squares[dest] = i;
                squaresElem[dest].innerHTML = i;
            }

            // Refresh not allowed number
            squares = squares.map((s) => s === -1 ? null : s);
        }
    }

    selectSquare(square) {
        this.selectedSquare?.classList?.remove('selected');

        if (this.selectedSquare === square) {
            this.selectedSquare = null;
            return;
        }

        this.selectedSquare = square;
        this.selectedSquare.classList.add('selected');
    }

    insertNumber(event) {
        const number = new RegExp(/.*([0-9a-fA-F]).*/).exec(event.code)[1];

        if (!this.selectedSquare || Number.isNaN(number) || !this.numbers.includes(number)) {
            return;
        }

        this.selectedSquare.innerHTML = this.selectedSquare.innerHTML != number ? number : '';
        this.selectSquare(this.selectedSquare);
    }

    getSquareElementsInRow() {
        const parents = document.querySelector('.square:not(.holder)').children;
        const squares = [];

        // Proceed line by line
        for (let x = 0; x < Math.pow(this.size, 2); x++) {
            // Loop on the three parents square of current line
            for (let i = 0; i < this.size; i++) {
                // Push child of current square of current line 
                for (let j = 0; j < this.size; j++) {
                    squares.push(parents[i + (Math.floor(x / this.size) * this.size)].children[j + (x % this.size) * this.size]);
                }
            }
        }

        return squares;
    }

    calculateDest(i, squares, squaresElem) {
        const nullSquaresIndexes = squares.map((s, j) => s === null ? j : -1).filter((s) => s !== -1);
        const dest = nullSquaresIndexes[Math.floor(Math.random() * nullSquaresIndexes.length)];
        const row = Math.floor(dest / Math.pow(this.size, 2));
        const col = dest % Math.pow(this.size, 2);
        // Set remaining empty square with same row/column of placed number to -1
        const a = squares.map((s, j) => {
            if (s === null &&
                (squaresElem[j].parentElement === squaresElem[dest].parentElement ||   // Prevent number on same square
                Math.floor(j / Math.pow(this.size, 2)) === row ||                      // Prevent number on same row
                j % Math.pow(this.size, 2) === col)                                    // Prevent number on same column
            ) {
                return -1;
            }

            return s;
        });
        a[dest] = i;

        if (a.filter((s) => s === null).length === 0) {
            return this.calculateDest(i, squares, squaresElem);
        }

        squares = a;
        console.log(squares);
        
        return dest;
    }
}