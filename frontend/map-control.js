

var troopPath = [];
var commandStack = [];

var savedMap = [];

var blockSize;
var sizee;

// Called once, map initialization

function initializeMap(size){

    setSrc(size);       // map-event

    sizee = size;       // save size

    var canvas = document.getElementById("game-canvas");
    var ctx = canvas.getContext("2d");

    ctx.drawImage(mapBack, 0, 0);       // set background image

    blockSize = 700 / size;             // determine size of each block on screen

    // initialize saved map for future reference

    for(var x=0; x<size; x++) {

        savedMap[x] = [];

        for(var y=0; y<size; y++) {

            var tempTile = {

                'clientColor' : 'black',
                'x' : 0,
                'y' : 0,
                'tileColor' : 'black',
                'units' : 0,
                'tile' : '',

            }

            savedMap[x][y] = tempTile;
            savedMap[x][y].x = x;
            savedMap[x][y].y = y;
        }
    }
}

// Called every tick to update the game-canvas

function updateMap(data){


    data.changes.forEach(element => {

        //upDateStatsKilCap(element);

        // Update saved map with updated data

        x = element.x;
        y = element.y;

        savedMap[x][y].clientColor = element.clientColor;
        savedMap[x][y].tileColor = element.tileColor;
        savedMap[x][y].units = element.units;
        savedMap[x][y].tile = element.tile;

        displayElement(element);

    });

    //upDateCountStats();
    checkFogOfWar();

    checkPath();        // And commandStack

    updateHover();

}

// Display a game element from update or delete

function displayElement(ele){

    var canvas = document.getElementById("game-canvas");
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = ele.tileColor;
    ctx.fillRect(ele.x*blockSize, ele.y*blockSize, blockSize, blockSize);

    // Check for tile image 

    if(ele.tile == 'plain'){

        if(ele.tileColor == "grey") {
            ctx.fillStyle = "#d9ecd0";

            if(ele.units > 0)
                ctx.fillStyle = "gray";
        }

        ctx.fillRect(ele.x*blockSize, ele.y*blockSize, blockSize-1, blockSize-1);
        ctx.drawImage(plains, ele.x*blockSize, ele.y*blockSize - 1, blockSize, blockSize);

    }

    if(ele.tile == 'mount'){

        if(ele.tileColor == "grey") 
            ctx.fillStyle = "#96897f";

        ctx.fillRect(ele.x*blockSize, ele.y*blockSize, blockSize-1, blockSize-1);
        ctx.drawImage(mountains, ele.x*blockSize, ele.y*blockSize - 1, blockSize, blockSize);

    }

    if(ele.tile == 'producer'){

        ctx.drawImage(producer, ele.x*blockSize, ele.y*blockSize - 1, blockSize, blockSize);

    }

    if(ele.tile == 'capital'){

        ctx.drawImage(castle, ele.x*blockSize, ele.y*blockSize - 1, blockSize, blockSize);

    }

    if(ele.tile == 'wall'){

        ctx.drawImage(wall, ele.x*blockSize, ele.y*blockSize - 1, blockSize, blockSize);

    }

    // Fill in unit count on updated tiles

    if(ele.units > 0){

        ctx.fillStyle = "white";
        ctx.font = "15px Georgia";
        ctx.fillText(ele.units, (ele.x*blockSize) + 5, (ele.y*blockSize) + 10);

    }
}

function checkPath() {

    var canvas = document.getElementById("game-canvas");
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "black"
    
    for (var i = 0; i < troopPath.length; i++) {
        
        drawPath(troopPath[i]);
      
    }

    for (var i = 0; i < commandStack.length; i++) {
        
        drawPath(commandStack[i].from);
        
    }

    if( commandStack.length > 0 ) if(commandStack[commandStack.length - 1].to) drawPath(commandStack[commandStack.length - 1].to);
    
}

// Display path to follow for movement

function drawPath(pos) {

    var canvas = document.getElementById("game-canvas");
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "black"
    ctx.fillRect(pos.x*blockSize + (blockSize / 2) - 2, pos.y*blockSize + (blockSize / 2) - 2, 5, 5);

}

// Remove path if back tracking or if route is not valid

function deletePath(pos) {

    var canvas = document.getElementById("game-canvas");
    var ctx = canvas.getContext("2d");

    ctx.drawImage(mapBack, 0, 0);

    for(var x=0; x<sizee; x++){

        for(var y=0; y<sizee; y++) {

            if(savedMap[x][y].tileColor != 'black') displayElement(savedMap[x][y]);

        }
    }
    
    if(troopPath.length > 0){

        for(var i = 0; i < troopPath.length; i++){

            ctx.fillStyle = "black"
            ctx.fillRect(troopPath[i].x*blockSize + (blockSize / 2) - 2, troopPath[i].y*blockSize + (blockSize / 2) - 2, 5, 5);

        }
    }

    checkFogOfWar();
}

// var cardinal = [(-1,-1), (0,-1), (1,-1), 
//                 (-1,0),  (0,0),  (1,0), 
//                 (-1,1),  (0,1),  (1,1)];

function checkFogOfWar(){

    for(var x=0; x<sizee; x++){

        for(var y=0; y<sizee; y++) {

            var e = savedMap[x][y];

            // If not undiscovered
            if(e.tileColor != 'black') {   
                 
                if(e.tileColor == e.clientColor) {
                    displayElement(e);
                }

                // 1
                else if(x > 0    &&  y > 0   &&  savedMap[e.x - 1  ][e.y - 1 ].tileColor == e.clientColor) {
                    displayElement(e);
                }

                // 2
                else if(             y > 0   &&  savedMap[e.x      ][e.y - 1 ].tileColor == e.clientColor) {
                    displayElement(e);
                }

                // 3
                else if(x < 20   &&  y > 0   &&  savedMap[e.x + 1  ][e.y - 1 ].tileColor == e.clientColor) {
                    displayElement(e);
                }

                // 4
                else if(x < 20   &&              savedMap[e.x + 1  ][e.y     ].tileColor == e.clientColor) {
                    displayElement(e);
                }

                // 5
                else if(x < 20   &&  y < 20  &&  savedMap[e.x + 1  ][e.y + 1 ].tileColor == e.clientColor) {
                    displayElement(e);
                }

                // 6
                else if(             y < 20  &&  savedMap[e.x      ][e.y + 1 ].tileColor == e.clientColor) {
                    displayElement(e);
                }

                // 7
                else if(x > 0    &&  y < 20  &&  savedMap[e.x - 1  ][e.y + 1 ].tileColor == e.clientColor) {
                    displayElement(e);
                }

                // 8
                else if(x > 0    &&              savedMap[e.x - 1  ][e.y     ].tileColor == e.clientColor) {
                    displayElement(e);
                }

                else {
                    var canvas = document.getElementById("game-canvas");
                    var ctx = canvas.getContext("2d");

                    displayElement(e);

                    ctx.fillStyle = "rgba(0,0,0,0.7)";
                    ctx.fillRect(e.x*blockSize, e.y*blockSize, blockSize, blockSize);
                }
            }
        }
    }
}
