const GRID_SIZE = 4;
const CELL_SIZE = 100;

const reloadButton = document.getElementById("reload");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const upButton = document.getElementById("up");
const downButton = document.getElementById("down");






var canvas;
var grid;
var gameOver;
var score;
var gameWon;



scoreContainer = document.getElementById("score");


function setup() {
    canvas = createCanvas(GRID_SIZE * CELL_SIZE + 50, GRID_SIZE * CELL_SIZE + 50);
    background(187, 173, 160);
    centerCanvas(canvas);
    newGame();
    noLoop();
    updateGrid();
          
}

/* Zentriert die Spielfläche */
function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2 + 40;
    canvas.position(x, y);
}

/* Zentriert die Spielfläche auf dem Fenster, wenn die Größe des Fensters geändert wird */
function windowResized() {
    centerCanvas();
}

/* erstellt ein neues Spiel mit dem Startspielbrett */
function newGame() {
    //das Gitter mit leeren Steinen füllen 
    grid = new Array(GRID_SIZE * GRID_SIZE).fill(0);
    gameOver = false;
    gameWon = false;
    score = 0;
    //die beiden Startsteine hinzufügen
    addRandomTile();
    addRandomTile();
}

/* updates the game grid with the correct tiles/tile colors, displays the score, and stops
   the game if there are no moves left or the 2048 tile is reached */
function updateGrid() {
    displayScore();
    drawGrid();
    if (gameOver) {
        displayGameOver();
    }
    else if (gameWon) {
        displayGameWon();
    }
}


function KeyBind(){

}
/* aktualisiert das Spielfeld mit den richtigen Steinen/Farben
zeigt den Punktestand an und beendet das Spiel
wenn keine Züge mehr übrig sind 
oder die 2048er-Marke erreicht ist */
function keyPressed() {
    if (!gameOver && !gameWon) {
        switch (keyCode) {
            case UP_ARROW:
                verticalSlide(keyCode);
                updateGrid();
                break;
            case DOWN_ARROW:
                verticalSlide(keyCode);
                updateGrid();
                break;
            case RIGHT_ARROW:
                horizontalSlide(keyCode);
                updateGrid();
                break;
            case LEFT_ARROW:
                horizontalSlide(keyCode);
                updateGrid();
                break;
        }
    }
    //Wenn das Spiel gewonnen/beendet ist und die Eingabetaste gedrückt wird, wird die Seite aktualisiert, um ein neues Spiel zu beginnen
    else if (keyCode === ENTER) {
        if (gameWon) {
            location.reload();
        }
        else {
            location.reload();
        }
    }
}
/* verschiebt die Steine vertikal (nach oben oder unten) und kombiniert Steine mit dem
gleichen Wertes, wenn sie kollidieren. */
upButton.addEventListener("click",function() {
    verticalSlide(UP_ARROW);
    updateGrid();
});
downButton.addEventListener("click",function() {
    verticalSlide(DOWN_ARROW);
    updateGrid();
});
leftButton.addEventListener("click",function() {
    horizontalSlide(LEFT_ARROW);
    updateGrid();
});
rightButton.addEventListener("click",function() {
    horizontalSlide(RIGHT_ARROW);
    updateGrid();
});
reloadButton.addEventListener("click",setup);


function verticalSlide(direction) {
    var previousGrid = [];
    var column;
    var filler;

    arrayCopy(grid, previousGrid);

    for (var i = 0; i < GRID_SIZE; i++) {
        column = [];
        //Spalte holen
        for (var j = i; j < GRID_SIZE * GRID_SIZE; j += 4) {
            column.push(grid[j]);
        }

        //gleiche Werte in einer bestimmten vertikalen Richtung kombinieren
        column = combine(column, direction);

        //löscht die null werte
        column = column.filter(notEmpty);

        //die richtige Anzahl leerer Werte nach den nicht leeren Werten hinzufügen
        filler = new Array(GRID_SIZE - column.length).fill(0);
        if (direction === UP_ARROW) {
            column = column.concat(filler);
        }
        else {
            column = filler.concat(column);
        }

        //die aktuelle Spalte im Raster aktualisieren
        for (var k = 0; k < column.length; k++) {
            grid[k * GRID_SIZE + i] = column[k];
        }

        //Werte kombinieren, die zuvor getrennt waren, nun aber nebeneinander liegen
        combine(column, direction);
    }
    checkSlide(previousGrid);
}

 /*Desselbe in Grün*/
function horizontalSlide(direction) {
    var previousGrid = [];
    var row;
    var filler;

    arrayCopy(grid, previousGrid);

    for (var i = 0; i < GRID_SIZE; i++) {
        
        row = grid.slice(i * GRID_SIZE, i * GRID_SIZE + GRID_SIZE);

        
        row = combine(row, direction);

        
        row = row.filter(notEmpty);

        
        filler = new Array(GRID_SIZE - row.length).fill(0);
        if (direction === LEFT_ARROW) {
            row = row.concat(filler);
        }
        else {
            row = filler.concat(row);
        }

        
        grid.splice(i * GRID_SIZE, GRID_SIZE);
        grid.splice(i * GRID_SIZE, 0, ...row);
    }
    checkSlide(previousGrid);
}



/* prüft, ob ein Spielfeld nicht leer ist (Wert ist nicht Null). Wird verwendet, um eine Reihe von Steinen zu filtern */
function notEmpty(x) {
    return x > 0;
}

/* prüft, nachdem eine Taste gedrückt wurde, ob sich etwas auf dem Gitter bewegt hat oder ob das
   Spiel vorbei ist */
function checkSlide(previousGrid) {
    if (!(grid.every((x, i) => x === previousGrid[i]))) {
        addRandomTile();
    }
    if (!movesLeft()) {
        gameOver = true;
    }
}

/* prüft, ob es noch Züge zu spielen gibt. Mit anderen Worten, es gibt entweder ein leeres
   Feld oder zwei benachbarte Felder haben den gleichen Wert. */
function movesLeft() {
    var movesLeft = false;
    var flag = false;
    var currentTile;
    var right;
    var bottom;

    for (var i = 0; i < GRID_SIZE; i++) {
        for (var j = 0; j < GRID_SIZE; j++) {
            if (!flag) {
                currentTile = grid[i * GRID_SIZE + j];

                //wenn das Gitter noch leere Stellen hat, gibt es noch Züge
                if (currentTile === 0) {
                    movesLeft = true;
                    flag = true;
                }
                else {
                    if (j < GRID_SIZE - 1) {
                        right = grid[i * GRID_SIZE + j + 1];
                    }
                    else {
                        right = 0;
                    }
                    if (i < GRID_SIZE - 1) {
                        bottom = grid[(i + 1) * GRID_SIZE + j];
                    }
                    else {
                        bottom = 0;
                    }
                    //wenn ein Nachbar des aktuellen Spielsteins denselben Wert hat, sind noch Züge übrig
                    if (currentTile === right || currentTile === bottom) {
                        movesLeft = true;
                        flag = true;
                    }
                }
            }
        }
    }

    return movesLeft;
}

/* kombiniert Steine mit denselben Werten in einer bestimmten Reihe in einer bestimmten Richtung */
function combine(row, direction) {
    switch (direction) {
        case DOWN_ARROW:
            row = combineDownRight(row);
            break;
        case RIGHT_ARROW:
            row = combineDownRight(row);
            break;
        case UP_ARROW:
            row = combineUpLeft(row);
            break;
        case LEFT_ARROW:
            row = combineUpLeft(row);
            break;
    }

    return row;
}

/* kombiniert Steine mit gleichem Wert nach unten oder nach rechts */
function combineDownRight(row) {
    var x;
    var y;

    for (var i = row.length - 1; i > 0; i--) {
        //aktuelle und nachfolgende Steine erhalten
        x = row[i];
        index = i - 1;
        y = row[index];

        //skip empty tiles until a nonempty tile or the beginning of the row is reached
        while (y === 0 && index > 0) {
            y = row[index--];
        }

        //if the adjacent tiles have equal value, combine and update score
        if (x === y && x !== 0) {
            row[i] = x + y;
            score += row[i];
            row[index] = 0;
            if (row[i] === 2048) {
                gameWon = true;
            }
        }
    }

    return row;
}

/* combines tiles of the same value together upwards or to the left */
function combineUpLeft(row) {
    var x;
    var y;

    for (var i = 0; i < row.length - 1; i++) {
        //get current and subsequent tiles
        x = row[i];
        index = i + 1;
        y = row[index];

        //skip empty tiles until a nonempty tile or the end of the row is reached
        while (y === 0 && index < row.length - 1) {
            y = row[index++];
        }

        //if the adjacent tiles have equal value, combine and update score
        if (x === y && x !== 0) {
            row[i] = x + y;
            score += row[i];
            row[index] = 0;
            if (row[i] === 2048) {
                gameWon = true;
            }
        }
    }

    return row;
}

/* adds a 2 or 4 tile to an empty spot in the grid randomly */
function addRandomTile() {
    var emptyTiles = [];
    var index;
    var newTile = [2, 4];

    //add the indices of all empty tiles to the emptyTiles array
    grid.forEach(function(value, index) {
        if (value === 0) {
            emptyTiles.push(index);
        }
    });

    if (emptyTiles.length > 0) {
        //get the index of a random empty tile in the grid
        index = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        //set the value of that empty tile to 2 or 4, randomly chosen
        grid[index] = newTile[Math.floor(Math.random() * newTile.length)];
    }
}

/*----------------STYLE----------------*/
/* insert the score in the score container */
function displayScore() {
    scoreContainer.innerHTML = `${score}`;
}

/* displays the Game Over message */
function displayGameOver() {
    displayText("Game Over!\nHit Enter to Play Again", color(119, 110, 101), 32, width / 2, height / 2);
}

/* displays the Game Won message */
function displayGameWon() {
    displayText("You Win!\nHit Enter to Play Again", color(119, 110, 101), 32, width / 2, height / 2);
}

/* general function to display text on the canvas */
function displayText(message, color, size, xpos, ypos) {
    textAlign(CENTER);
    textSize(size);
    fill(color);
    text(message, xpos, ypos);
}

/* draw and style the game grid */
function drawGrid() {
    var c;

    for (var i = 0; i < GRID_SIZE; i++) {
        for (var j = 0; j < GRID_SIZE; j++) {
            //color of tile depends on value of tile
            switch (grid[i * GRID_SIZE + j]) {
                case 0:
                    c = color("#fcf8ed");
                    break;
                case 2:
                    c = color("#a7dbb1");
                    break;
                case 4:
                    c = color("#99c7ad");
                    break;
                case 8:
                    c = color("#8ab3a9");
                    break;
                case 16:
                    c = color("#7a9ea4");
                    break;
                case 32:
                    c = color("#67839e");
                    break;
                case 64:
                    c = color("#536998");
                    break;
                case 128:
                    c = color("#3c4c8a");
                    break;
                case 256:
                    c = color("#222d72");
                    break;
                case 512:
                    c = color("#080e5b");
                    break;
                case 1024:
                    c = color("#070d52");
                    break;
                case 2048:
                    c = color("#050837");
                    break;
            }

            //fill tile
            fill(c);
            //thickness of tile border
            strokeWeight(2);
            //color of tile border
            stroke(c); 
            //draw rectangle with rounded edges for each tile
            rect(j * CELL_SIZE + j * 10 + 10, i * CELL_SIZE + i * 10 + 10, CELL_SIZE, CELL_SIZE, 5);

            if (grid[i * GRID_SIZE + j] !== 0) {
                displayText(`${grid[i * GRID_SIZE + j]}`,
                color(255, 255, 255),
                45,
                j * CELL_SIZE + j * 10 + 10 + CELL_SIZE / 2,
                i * CELL_SIZE + i * 10 + 20 + CELL_SIZE / 2);
            }
        }
    }
}