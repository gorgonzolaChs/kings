
//var socket = io();

setTimeout(requestGameList, 100);

var canRequestGameList = true;

// Client --> Server


// Request list of active games

function requestGameList(){

    if(canRequestGameList) socket.emit('requestGameList', {});

    setTimeout(requestGameList, 2000);

}

// Submit game parameters and request a game

function createGame(){

    canRequestGameList = false;

    var e = document.getElementById("game-type-input");

    game = {

        'name' : document.getElementById("game-name-input").value,

        'password' : document.getElementById("game-pass-input").value,

        'mapType' : e.options[e.selectedIndex].value,

    }

    console.log(game);

    socket.emit('createGame', game);

    document.getElementById('password-input').value = game.password;

}

// Request access to a listed game

function joinGame(gameId){

    canRequestGameList = false;
    tempGameId = gameId;

    changePage("pass-page");

}

// Submit password for game the user is attempting to join

function submitPass(){

    join = {

        'id' : tempGameId,

        'password' : document.getElementById('password-input').value,

        'name' : document.getElementById('display-name').value,

    }

    socket.emit('joinGame', join);

}

// Submit chat input box to be displayed to all users in a lobby

function submitChat(id){

    if (event.key == 'Enter') {

        // console.log("Enter:" + document.getElementById(id).value);

        socket.emit('sendChat', {'chat':document.getElementById(id).value});

        document.getElementById(id).value = "";

    }

}

// Submit a single movement command to be interpreted by the back-end

function submitMoveCommand(move) {

    if(move[0].command == 'move'){
    
        if(savedMap[move[0].to.x][move[0].to.y].tile == 'mount' || savedMap[move[0].from.x][move[0].from.y].units < 2){

            var badPath = savedMap[move[0].to.x][move[0].to.y];
            var pathIsGood = false;

            if(commandStack.length > 0){

                while(!pathIsGood && commandStack.length > 0){

                    if ( isAdjacent( badPath , commandStack[0].to ) ) {
                        
                        displayElement(savedMap[commandStack[0].to.x][commandStack[0].to.y]);

                        badPath = savedMap[commandStack[0].to.x][commandStack[0].to.y];
                        commandStack.splice(0,1);

                        deletePath();

                    } 
                    
                    else 

                        pathIsGood = true;

                }
            }
        }

        else{
            console.log(move[0]);
            socket.emit('makeMove', move[0]);
        }

    }
    else {
        console.log(move[0]);
        socket.emit('makeMove', move[0]);
    }

}

// Submit a build or split command ('do')

function handleDoCommand(key, pos) {

    var command;

    switch (key) {

        case ('Escape'):
            command = 'cancel';
            break;

        case ('1'):
                command = 'buildWall';
                break;
    
        case ('2'):
                command = 'buildProducer';
                break;
    
        default:
            break;

    }

    if(command == 'cancel') {

        troopPath = [];
        commandStack = [];
        return;

    }

    console.log("Command : ", command);

    var n = {
        'x' : 0,
        'y' : 0,
    }

    convertPathToCommand(lastHoverPos, n, command);
}

// Handle troop split

function handleSplit(key, posF, posT){

    if(key == ' ') {

        troopPath = [];

        console.log("Command : split");
        convertPathToCommand(posF, posT, 'split');

    }

}
