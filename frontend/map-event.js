
var mouseIsD = false;
var clickPos;
var keyThatDown = '';
var pathDir = '';


// When mouse is pressed down --> start tracking

function mouseDown(evt) {

    var c = document.getElementById("game-canvas");
    var pos = getMousePosNB(c, evt);

    clickPos = pos;

    if(savedMap[pos.x][pos.y].units > 1){

        mouseIsD = true;
        troopPath.push(pos);

    }
}

// While tracking if mouse is pressed down

function mouseMove(evt) {

    var c = document.getElementById("game-canvas");
    var pos = getMousePos(c, evt);

    mousePos = getMousePosNB(c, evt);
    updateHover();

    if(mouseIsD) {   

        if ( pos ) {    
            var last = troopPath.length - 1;
            var secondLast = troopPath.length - 2;

            // If pos is not equal to your last move to location

            if(troopPath[last].x != pos.x || troopPath[last].y != pos.y) {  

                var backtracked = false;

                if(troopPath.length > 1) {

                    // If you back-tracked

                    if(troopPath[secondLast].x == pos.x && troopPath[secondLast].y == pos.y) {      

                        backtracked = true;

                        var lastPos = troopPath.pop();

                        deletePath(lastPos);

                    }
                }

                if(!backtracked){    

                    var xDiff = troopPath[last].x - pos.x;
                    var yDiff = troopPath[last].y - pos.y;

                    if((xDiff <= 1 && xDiff >= -1 && xDiff != 0 && yDiff == 0) || (yDiff <= 1 && yDiff >= -1 & yDiff != 0 && xDiff == 0)) {         // If pos is adjacent to the last
                        
                        troopPath.push(pos);

                        drawPath(pos);

                    }
                }
            }
        }

        // if(troopPath.length > 1){

        //     //convertPathToCommand(troopPath[0], troopPath[1], 'move');
        //     troopPath.splice(0,1);

        // }

    }
}

// When mouse is released --> stop tracking and submit the created path

function mouseUp(evt) {

    mouseIsD = false;

    var c = document.getElementById("game-canvas");
    var pos = getMousePos(c, evt);

    if(keyThatDown != ''){
        if(clickPos == pos) 
            handleDoCommand(keyThatDown, pos);
        else if ( isAdjacent( clickPos , pos ) ) handleSplit(keyThatDown, clickPos, pos)
    }

    // console.log("Path Before : ", troopPath);

    convertRestOfPath();

    troopPath = [];

    // console.log("Path After : ", troopPath);

    deletePath();
    checkPath();

}

// Build events and cancel / split events (esc, space, 1, 2)

pressKey = event => {

    console.log(event.key);

    if(keyThatDown == ''){

        keyThatDown = event.key;
        
    }
}

releaseKey = event => {

    var c = document.getElementById("game-canvas");
    var pos = getMousePos(c, event);

    if(keyThatDown == event.key){

        if(keyThatDown != ' ') handleDoCommand(event.key, pos);

        keyThatDown = '';

    }
}

document.onkeyup = releaseKey;
document.onkeydown = pressKey;