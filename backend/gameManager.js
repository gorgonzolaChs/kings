var colors = require('colors')
var nanoid = require('nanoid')

var kingGame = require('./kingGame')


/* Manages all the games going on currently */

var openGames = []
var runningGames = []


/* Read access */

module.exports.getGameList = () => {

    outputList = []
    openGames.forEach( game => {

        outputList.push({

            'name' : game.name,
            'mapType' : game.mapType,
            'password' : !(game.password === ''),
            'id' : game.id,
            'players' : game.game.getPlayers()
            
        })

    })

    return {'games' : outputList};

}

/* Game creation */

module.exports.createGame = ( socket, data ) => {

    var newGame = {
        'game':         new kingGame( data.name ),
        'id' :          nanoid(),

        'name' :        data.name,
        'mapType' :     data.mapType,
        
        'password' :    data.password, 
        'gameKey' :     nanoid(),
    }

    console.log('New Game:', 'id'.yellow, newGame.id, 'name'.yellow, newGame.name)
    openGames.push( newGame );

    return { 'id': newGame.id }

}


module.exports.joinGame = ( data, socket ) => {

    var response = { 'joined' : false }
 
    openGames.forEach( game => {
        if (game.id == data.id && data.password == game.password){

            game.game.joinGame( socket, data.name )
            response = { 'joined' : true }
        }

    })

    console.log('Request', (response.joined) ? 'successful'.green : 'denied'.red );

    return response;

}


module.exports.startGame = ( data ) => {

    openGames.forEach( game => {

        if ( game.id == data.id && game.gameKey == data.gameKey ){

            /* Move game to running Games array */
            runningGames.push( game )
            openGames.splice( openGames.indexOf( game ), 1)        

    }})

}