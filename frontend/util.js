
var castle = new Image();
var producer = new Image();
var mountains = new Image();
var plains = new Image();
var wall = new Image();

var mapBack = new Image();

mapBack.src = "./imgs/map2.jpg";

var mousePos;

var stats = {

    'oldUnits' : 0,
    'units' : 0,
    'tiles' : 0,
    'killed' : 0,
    'captures' : 0,
    'producers' : 0,
    'produced' : 0,

};


// Choose the correctly sized images for the current map size

function setSrc(size){

    if(size == 14){

        castle.src = "./imgs/CastleNew21.png";
        producer.src = "./imgs/producer21.png";
        mountains.src = "./imgs/mountains21.png";
        plains.src = "./imgs/plains21.png";
        wall.src = "./imgs/stoneWall21.png";

    }

    if(size == 21){

        castle.src = "./imgs/CastleNew21.png";
        producer.src = "./imgs/producer21.png";
        mountains.src = "./imgs/mountains21.png";
        plains.src = "./imgs/plains21.png";
        wall.src = "./imgs/stoneWall21.png";

    }

    if(size == 28){

        castle.src = "./imgs/CastleNew21.png";
        producer.src = "./imgs/producer21.png";
        mountains.src = "./imgs/mountains21.png";
        plains.src = "./imgs/plains21.png";
        wall.src = "./imgs/stoneWall21.png";

    }
}

// Update lobby to display each player and their color

function displayPlayerInLobby(data){

    itm = document.getElementsByClassName('client-connected-placeholder');
    itm[0].style.display = 'none';

    var nextPlayer = itm[0].cloneNode(true);

    console.log(nextPlayer.childNodes);

    nextPlayer.style.display = 'block';

    nextPlayer.id = data.name;

    nextPlayer.childNodes[1].style.backgroundColor = data.color;

    nextPlayer.childNodes[3].textContent = data.name;

    document.getElementById("lobby-list").appendChild(nextPlayer);

}

// Remove player and color from lobby (delete player object)

function deletePlayerInLobby (color) { 

    var list = document.getElementById('lobby-list');
    
    for(var i = 2;  i < list.childNodes.length; i++){

        if(list.childNodes[i].childNodes[1])

            if(list.childNodes[i].childNodes[1].style.backgroundColor == color)

                list.removeChild(list.childNodes[i]);

    }
}

// Show text in chat without submission to the back-end (only shows local information)

function showInChat(words){

    if( document.getElementById('lobby-chat-field') != undefined) document.getElementById('lobby-chat-field').value += "\n" + words;
    if( document.getElementById('game-chat-field') != undefined) document.getElementById('game-chat-field').value += "\n" + words;

}

// Timer till the start of the game

var count = 3
function countDownToGameStart(){

    if(count > 0){   

        showInChat(count);

        count--;

        setTimeout(countDownToGameStart, 1000);

    } 
    
    else {

        changePage('game-page');

        count = 3;

    }
}

function isAdjacent ( pos1 , pos2 ) {

    var xDiff = pos1.x - pos2.x;
    var yDiff = pos1.y - pos2.y;

    return  (xDiff <= 1 && xDiff >= -1 && xDiff != 0 && yDiff == 0) || 
            (yDiff <= 1 && yDiff >= -1 & yDiff != 0 && xDiff == 0);

}

// Derermine mouse position withing the game-canvas
// NO BUFFER

function getMousePosNB(canvas, evt) {

    var rect = canvas.getBoundingClientRect();

    return {

      x: Math.floor((evt.clientX - rect.left) / blockSize),
      y: Math.floor((evt.clientY - rect.top) / blockSize)

    };

}

// Derermine mouse position withing the game-canvas
// WITH BUFFER

function getMousePos(canvas, evt) {

    var rect = canvas.getBoundingClientRect();

    var x = (evt.clientX - rect.left) / blockSize;
    var y = (evt.clientY - rect.top) / blockSize;

    // Check Buffer

    var canRet = true;

    if ( x - Math.floor(x) < 0.1 || x - Math.floor(x) > 0.9 ) canRet = false;
    if ( y - Math.floor(y) < 0.1 || y - Math.floor(y) > 0.9 ) canRet = false;


    // Make Readable

    x = Math.floor(x);
    y = Math.floor(y);

    if ( canRet ) return { x , y };

}

var lastHoverPos;

function updateHover(){

    if ( mousePos &&  mousePos.x > 0 && mousePos.x < sizee && mousePos.y > 0 && mousePos.y < sizee) {

        deletePath();
        checkFogOfWar();
        checkPath();

        var canvas = document.getElementById("game-canvas");
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgba(255,0,127,1)";
        ctx.fillRect(mousePos.x*blockSize, mousePos.y*blockSize, blockSize, 2);
        ctx.fillRect(mousePos.x*blockSize, mousePos.y*blockSize, 2, blockSize);
        ctx.fillRect(mousePos.x*blockSize + blockSize, mousePos.y*blockSize + blockSize, -blockSize, -2);
        ctx.fillRect(mousePos.x*blockSize + blockSize, mousePos.y*blockSize + blockSize, -2, -blockSize);

        lastHoverPos = mousePos;
    }

}

// Creates a specific command and adds it to the stack to be sent to the back-end

function convertPathToCommand(cmdF, cmdT, cmd) {

    var command = {

        'from' : cmdF ,

        'to' : cmdT,

        'command' : cmd

    }

    // console.log(command);

    commandStack.push(command);
}

// Converts the entire troopPath into a movement command for the back-end

function convertRestOfPath(){

    if(troopPath.length > 1){

        for(var i = 1; i < troopPath.length; i++){

            var command = {

                'from' : troopPath[ i - 1] ,

                'to' : troopPath[ i ],

                'command' : 'move'

            }

            commandStack.push(command);

        }
    }
}

// If there are commands to be sent, sends the next command in line

function checkToSendTopOfStack() {

    if(commandStack.length > 0){

        submitMoveCommand(commandStack.splice(0,1));
        
    } 
}

function upDateStatsKilCap(elem){

    var checkX = elem.x;
    var checkY = elem.y;

    // If this is one of the players current positions
    
    if(savedMap[checkX][checkY].tileColor == elem.clientColor) {

        // Keep Spot
        if (elem.tileColor == elem.clientColor && savedMap[checkX][checkY].units != elem.units) {
            console.log("K1");
            stats.killed += (savedMap[checkX][checkY].units - elem.units) + 1;
            // stats.units -= savedMap[checkX][checkY].units - elem.units;
            // stats.oldUnits -= savedMap[checkX][checkY].units - elem.units;

        }

        // Lose the Spot
        if (elem.tileColor != elem.clientColor) {
            console.log("K2");
            stats.killed += savedMap[checkX][checkY].units;
            // stats.units -= savedMap[checkX][checkY].units;
            // stats.oldUnits -= savedMap[checkX][checkY].units;

        }

    }
    else if (elem.tileColor == elem.clientColor) {

        stats.captures++;

        if (savedMap[checkX][checkY].units > 0 && savedMap[checkX][checkY].tile != 'producer'){
            console.log("K3");
            stats.killed += elem.units - savedMap[checkX][checkY].units;
            // stats.units -= elem.units - savedMap[checkX][checkY].units;
            // stats.oldUnits -= elem.units - savedMap[checkX][checkY].units;

        }

    }

}

function upDateCountStats(){

    stats.units = 0;
    stats.tiles = 0;
    stats.producers =0;

    for(var x=0; x<sizee; x++){

        for(var y=0; y<sizee; y++) {

            var e = savedMap[x][y];

            if(e.tileColor == e.clientColor && e.tileColor != 'black'){

                stats.units += e.units;

                stats.tiles++;

                if(e.tile == 'producer') 

                    stats.producers++;

            }

        }

    }

    stats.produced += stats.units - stats.oldUnits;
    stats.oldUnits = stats.units;

    document.getElementById('units-val').innerText = stats.units;
    document.getElementById('tiles-val').innerText = stats.tiles;
    document.getElementById('killed-val').innerText = stats.killed;
    document.getElementById('caputred-val').innerText = stats.captures;
    document.getElementById('producers-val').innerText = stats.producers;
    document.getElementById('produced-val').innerText = stats.produced;

}