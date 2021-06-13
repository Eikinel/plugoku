window.onload = () => {
    new Sudoku();
}

class Sudoku {
    constructor(size = 3) {
        this.size = size;
        this.buildSudoku();
        this.buildNumbers();
    }

    buildSudoku(layer = 0, container = document.body) {
        for (let i = 0; i < (layer ? Math.pow(this.size, 2) : 1); i++) {
            const square = document.createElement('div');

            square.classList.add('square');
            square.style = `outline:${this.size - layer}px solid black`;

            container.appendChild(square);

            if (layer < this.size - 1) {
                this.buildSudoku(layer + 1, square);
            } else {
                square.classList.add('holder');
            }
        }
    }

    buildNumbers() {
        const numberList = document.createElement('div');

        numberList.classList.add('number-list');

        for (let i = 0; i < Math.pow(this.size, 2); i++) {
            const number = document.createElement('div');
            
            number.innerHTML = (i + 1).toString();
            numberList.appendChild(number);
        }

        document.body.appendChild(numberList);
    }
}