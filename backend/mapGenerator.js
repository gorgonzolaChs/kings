var util = require('./utils')


/* Generates a map */

module.exports = function( size, colors ){

    var map = []
    
    /* Generate map iself */
    for ( let x = 0; x < size; x++ ) {
        var row = []
        for ( let y = 0; y < size; y ++ ){

            nextTile = {
                'color' : 'grey',
                'units' : 0,
                'tile' : 'plain'
            }

            if (Math.random() > 0.6)
                nextTile.tile = 'mount'

            if ( x == 0 || y == 0 || x == size -1 || y == size-1)
                nextTile.tile = 'mount'

            row.push(nextTile)
        
        }
        map.push( row )
    }

    /* Adds mountains */

    for ( let i =0; i< 100; i++){

        for ( let x = 1; x < size-1; x++ ) 
            for ( let y = 1; y < size-1; y ++ ){

                var count = ( map[x -1 ][y].tile == 'mount' ? 1 : 0 ) + 
                            ( map[x +1 ][y].tile == 'mount' ? 1 : 0 ) + 
                            ( map[x  ][y -1 ].tile == 'mount' ? 1 : 0 ) + 
                            ( map[x  ][y +1 ].tile == 'mount' ? 1 : 0 );

                if (count <= 1 && map[x][y].tile == 'mount')
                    map[x][y].next = 'plain'
                else if (count >= 3 && map[x][y].tile == 'plain')
                    map[x][y].next = 'mount'
                else
                    map[x][y].next = map[x][y].tile
            }
            
        for ( let x = 1; x < size-1; x++ ) 
            for ( let y = 1; y < size-1; y ++ )
                map[x][y].tile = map[x][y].next
    }


    /* Add capitals */
    var capitals = []
    for ( let i = 0; i < colors.length; i++){
        var x = util.randomInt( size - 2) + 1;
        var y = util.randomInt( size - 2 ) + 1;

        var valid = true;

        /* Must have open spaces */
        for ( dx = -1 ; dx < 2 ; dx ++)
            for ( dy = -1 ; dy < 2 ; dy ++){
                
                if (map[x + dx][y + dy].tile == 'mount' )
                    valid = false;

            }
        
        /* distance */
        capitals.forEach( cap => {
            if ( Math.abs( cap.x - x) + Math.abs( cap.y - y) < 10)
                valid = false
        })    


        if ( !valid ) {
            i--;
        }
        else{
            map[x][y].color = colors[i]
            map[x][y].tile = 'capital'
            capitals.push( {'x': x, 'y': y})
        }

    }

    /* Add producers */
    for ( let i = 0; i < 3; i++){
        var x = util.randomInt( size - 2) + 1;
        var y = util.randomInt( size - 2 ) + 1;

        var valid = true;

        /* Must have open spaces */
        for ( dx = -1 ; dx < 2 ; dx ++)
            for ( dy = -1 ; dy < 2 ; dy ++){
                
                if (map[x + dx][y + dy].tile == 'mount' )
                    valid = false;

            }
        
        /* distance */
        capitals.forEach( cap => {
            if ( Math.abs( cap.x - x) + Math.abs( cap.y - y) < 5)
                valid = false
        })    


        if ( !valid ) {
            i--;
        }
        else{
            map[x][y].color = 'grey'
            map[x][y].tile = 'producer'
            capitals.push( {'x': x, 'y': y})
        }

    }


    return map

}