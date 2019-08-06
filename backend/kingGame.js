var util = require('./utils')
var mapGen = require('./mapGenerator')
var mapUpdate = require('./mapUpdator')

module.exports = function( gameName) {

    var clientColors = ['red', 'blue', 'green', 'purple', 'orange'].shuffle()
    var clients = []
    var map = []

    var gameLoop;
    var clientInput = [];

    /* util */

    function massEmit ( event, data ) {

        clients.forEach( s => {

            s.socket.emit( event, data )
        })
    
    }


    /* New people join */

    function syncNewClient ( socket, name ) {

        /* New Player */
        var newClient = {
            'socket' : socket, 
            'color' : clientColors.pop(),
            'name' : name
        }

        /* Make sure everyone else sees this player */
        massEmit( 'newPlayer', {'color' : newClient.color, 'name' : name} )

        /* Make sure this player sees everyone */
        var otherPlayerInfo = clients.construct( c => { return {'color' : c.color, 'name' : c.name} })
        socket.emit('syncPlayers', {'players' : otherPlayerInfo} )

        /* Setup own lobby info */
        socket.emit('setupSelf', { 'color' : newClient.color, 'name' : name, 'gameName' : gameName })
        clients.push( newClient )

        return newClient.color;
    }


    /* Old person leaves */

    function syncLessClient ( color ) {

        clientColors.push( color )

        for ( var i=0; i < clients.length; i++ ){
            
            if (clients[i].color != color){
                clients[i].socket.emit('lessPlayer', {'color' : color })
                continue;
            }

            clients.splice(i, 1); i--;
        }


    }


    /* Public access */

    this.joinGame = (socket, name)  => {

        var color = syncNewClient( socket, name );


        /* Communication with client */

        socket.on( 'sendChat', data => {
            if (! data ) return;
            var message = name + '  :      ' + data.chat;
            massEmit( 'chatRecieved', { 'chat' : message } )

        } )

        socket.on('disconnect', () => {

            syncLessClient(  color )

        })


        /* Game start */

        if ( clients.length == 2){
            startGame();
        
        }
    }

    this.getPlayers = () => clients.length;

    /* Start Game */

    function startGame () {
        
        /* Create map */
        map = mapGen( 21, clients.map( c => c.color ) )
        massEmit( 'gameStart', {'size' : 21} )

        /* Start game loop */
        gameLoop = setInterval( () => {
            sendMapUpdates( mapUpdate( map, clientInput ) );
            clientInput = [];
        }, 700 )

        /* Start input scanning */
        clients.forEach( c => {
            c.socket.on('makeMove', data => {
                if (! data ) return;
                if ( data == [] || data == {} || !('from' in data) ) return;

                /*only one input */
                if (clientInput.map( c => c.color).includes( c.color )){
                    return
                }

                clientInput.push({
                    'color' : c.color,
                    'a' : [data.from.x, data.from.y],
                    'b': [data.to.x, data.to.y],
                    'command' : data.command
                })
            })
        })
        

    }

    function sendMapUpdates ( updates ){


        clients.forEach( c => {
            if ( c.color in updates)
                c.socket.emit('mapUpdate', {'changes': updates[c.color] })
            else
                c.socket.emit('mapUpdate', {'changes': []} )
        })


    }



}