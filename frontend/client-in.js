
var socket = io();

setTimeout(changePage, 100);


var itm;
var cln;
var tempGameId;

// Server --> Client


// Recieve list of available games

socket.on('getGameList', function (data){   

    if(itm == null) {

        itm = document.getElementsByClassName('template-game-item');
        itm[0].style.display = 'none';

    }

    var elem = document.getElementById('main-menu-join');
    var ele = elem.children;

    while(ele[2] != null){

        elem.removeChild(ele[2]);

    }

    for(var i=0; i<data.games.length; i++){

        var next = itm[0].cloneNode(true);

        next.style.display = 'block';

        next.id = data.games[i].id;
        next.className = "game-item menu-item";

        next.childNodes[1].textContent = data.games[i].name;
        next.childNodes[1].className = "game-name";

        if(data.games[i].password) next.childNodes[3].style.display = 'block';
        next.childNodes[3].className = "game-pass";

        next.childNodes[5].textContent = data.games[i].players + " / 2";
        next.childNodes[5].className = "player-count";

        document.getElementById("main-menu-join").appendChild(next);

    }
    
});

// Returns game joined by user

socket.on('joinedGame', function (data){    

    if(data.joined) changePage("lobby-page");

});

// Returns game created by user

socket.on('gameCreated', function (data){    

    tempGameId = data.id;

    changePage("pass-page");

});

// Updates lobby with new player that joined

socket.on('newPlayer', function (data){

    displayPlayerInLobby(data);

});

// Updates lobby with the pre-existing players if not the creator

socket.on('syncPlayers', function (data){

    console.log(data);

    for(var i=0; i<data.players.length; i++){

        displayPlayerInLobby(data.players[i]);

    }

});

// Add yourself to the lobby of the game you create

socket.on('setupSelf', function (data){

    document.getElementById('lobby-page').childNodes[1].textContent = data.gameName;

    displayPlayerInLobby(data);

});

// Remove player from lobby

socket.on('lessPlayer', function (data){

    console.log("Player Left");

    deletePlayerInLobby(data.color);

})

// Recieve chat

socket.on('chatRecieved', function(data){
               
    showInChat(data.chat);
    
});

// Indicate lobby is full and game is starting

socket.on('gameStart', function(data){

    console.log("Game Starting");

    showInChat("Game Starting in : ");
    countDownToGameStart();

    initializeMap(data.size);

});

// Update the map every game tick and set off returning commands

socket.on('mapUpdate', function(data){

    updateMap(data);
    checkToSendTopOfStack();
    updateHover();

});