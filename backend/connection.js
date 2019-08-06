
var gameManager = require('./gameManager')

module.exports.connect = function( socket, io ){

    /* Game lobby connections */
    
    socket.on( 'requestGameList', data => {
        if (! data ) return;

        socket.emit( 'getGameList',  gameManager.getGameList() )
    });

    socket.on( 'createGame', data => {
        if (! data ) return;
        socket.emit('gameCreated', gameManager.createGame( socket, data ) )
    });

    socket.on( 'joinGame', data => {
        if (! data ) return;
        console.log('Game join request to game', data.id.yellow, 'with username', data.name.yellow)
        socket.emit( 'joinedGame', gameManager.joinGame( data, socket ))
    })

    socket.on( 'startGame', data => {
        if (! data ) return;

        gameManager.startGame( data )
    })

}