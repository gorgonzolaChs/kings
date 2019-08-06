/* Triggers map updates */

var cardinal = [ 
    [-1,1],[0,1],[1,1], 
    [-1,0],[0,0],[1,0], 
    [-1,-1],[0,-1],[1,-1] ]

var updateList = {}

var gameTick = 30;



function onMap ( map, x, y){
    return x >= 0 && y >= 0 && x < map.length && y < map.length
}

function getTile ( map, point){
    return map[point[0]][point[1]]
}


function revealTile ( map, x, y, color ){

    if ( !( color in updateList ) )
        updateList[color] = []

    cardinal.forEach( p => {
        var xPos = x + p[0];
        var yPos = y + p[1];
        
        if (onMap( map, xPos, yPos) ){

            var tile = map[xPos][yPos];

            updateList[color].push({
                'clientColor' : color,
                'x' : xPos,
                'y' : yPos,
                'tileColor' : tile.color,
                'units': tile.units,
                'tile' : tile.tile
            })
        }
    });

}

function tileUpdated ( map, x, y ){

    var colorsFound = []
    var updateTile = map[ x ][ y ]

    cardinal.forEach( p => {
        var xPos = x + p[0];
        var yPos = y + p[1];
        
        if (onMap( map, xPos, yPos) ){
            var tile = map[xPos][yPos];

            if ( colorsFound.includes( tile.color )) return;

            revealTile( map, x, y, tile.color)

            colorsFound.push( tile.color )
        
        }
    })
}


module.exports = function( map, clientInputs ) {

    /* resets list of tiles to be updated */
    updateList = {}

    /* Utility tile */
    function setUnits ( tile, amount ){
        map[tile[0]][tile[1]].units = amount;
        tileUpdated( map, tile[0], tile[1] )
    } 
    function setColor ( tile, color ){
        originalColor = map[tile[0]][tile[1]].color;
        map[tile[0]][tile[1]].color = color;
        tileUpdated( map, tile[0], tile[1]);
        revealTile( map, tile[0], tile[1], originalColor)
    }
    function setTile ( tile, newTile ){
        map[tile[0]][tile[1]].tile = newTile;
        tileUpdated( map, tile[0], tile[1])
    }

    /* Client Movements */

    clientInputs.forEach( action => {
        var _from = action.a;
        var _to = action.b;

        var current =  getTile( map, action.a);
        var target =  getTile( map, action.b);

        // You can only move your own units and onto non mountains
        if ( current.color != action.color) return
        if ( current.units <= 1) return
        if ( action.command == 'move'){

            if ( target.tile == 'mount') return;

            // Combine Units
            if (current.color == target.color){
                setUnits( _to, current.units + target.units - 1)
                setUnits( _from, 1)
            }

            // Claim New Tile
            else if ( target.color == 'grey' ){
                setUnits( _to, current.units + target.units - 1)
                setUnits( _from, 1)
                setColor( _to, action.color)
            }

            // Wage War with Tile 
            else{
                var defBon = target.tile == 'wall' ? 2.5 : 1

                var attack = current.units - 1
                var defence = target.units * defBon


                if ( attack > defence ){
                    setUnits( _from, 1 )
                    setUnits( _to, Math.floor( attack - defence ) )
                    setColor( _to, action.color)
                    if (target.tile == 'wall')
                        setTile(_to, 'plain')
                }
                else{
                    setUnits( _from, 1)
                    setUnits( _to, Math.ceil( (defence - attack) / defBon ))
                }
            }
        }

        if ( action.command == 'split'){

            if ( target.tile == 'mount') return;

            // Combine Units
            if (current.color == target.color){
                setUnits( _to, Math.floor(current.units/2) + target.units - 1)
                setUnits( _from, Math.ceil(current.units/2))
            }

            // Claim New Tile
            else if ( target.color == 'grey' ){
                setUnits( _to, Math.floor(current.units/2) + target.units - 1)
                setUnits( _from, Math.ceil(current.units/2))
                setColor( _to, action.color)
            }

            // Wage War with Tile 
            else{
                var defBon = _to.tile == 'wall' ? 2.5 : 1

                var attack = Math.floor(current.units/2)
                var defence = target.units * defBon

                if ( attack > defence ){
                    setUnits( _from, Math.ceil(current.units/2) )
                    setUnits( _to, Math.floor( attack - defence ) )
                    setColor( _to, action.color)
                    if (target.tile == 'wall')
                        setTile(_to, 'plain')
                }
                else{
                    setUnits( _from, Math.ceil(current.units/2) )
                    setUnits( _to, Math.ceil( (defence - attack) / defBon ))
                }
            }
        }

        if ( action.command == 'buildWall') {

            if (current.units <= 100) return
            if (current.tile != 'plain') return
                
            setUnits( _from, current.units - 100)
            setTile( _from, 'wall')

        }

        if (action.command == 'buildProducer'){
            
            
            if (current.units <= 200) return
            if (current.tile != 'plain') return

            setUnits( _from, current.units - 200)
            setTile( _from, 'producer')

        }


    })

    /* Tile Changes */

    function borders ( tile, color ) {
        var total = 0
        var cap = false;
        var prod = false;
        var _color = ''
        for ( let x = -1; x < 2; x ++ )
            for ( let y = -1; y < 2; y ++ ) 
                if ( onMap( map, x + tile[0], y + tile[1])){
                    if ( map[x + tile[0]][y + tile[1]].color == color)
                        total ++;
                    if ( map[x + tile[0]][y + tile[1]].tile == 'capital') { cap = true; _color = map[x + tile[0]][y + tile[1]].color }
                    if (map[x + tile[0]][y + tile[1]].tile == 'producer') { prod = true; _color = map[x + tile[0]][y + tile[1]].color }
                }

        return [total, cap, prod, _color ]

    }

    gameTick ++;
    var grow = gameTick == 30
    gameTick %= 30;

    for ( let x = 0; x < map.length; x ++ )
        for ( let y = 0; y < map.length; y ++ ) {

            var point = [x,y]
            var tile = map[x][y]

            if ( map[x][y].color != 'grey' ){
            
                if ( grow ){
                    
                    var bordered =  borders( point, tile.color )

                    if ( bordered[0] == 9)
                        setUnits( point, tile.units + 1 )
                    if ( bordered[1] && bordered[3] == tile.color)
                        setUnits( point, tile.units + 4 )
                    if ( bordered[2] && bordered[3] == tile.color)
                        setUnits( point, tile.units + 2 )
                }
                
                if ( tile.tile == 'capital')
                    setUnits( point, tile.units + 1)

            }

            if ( tile.tile == 'producer')
                if (gameTick % 2 == 0)
                    setUnits( point, tile.units + 1 )
        }

    /* Check for continuity */

    mapBoundery = {}
    checkTiles = []
    nextCheckTiles = []
    
    for ( let x = 0; x < map.length; x ++ ){
        row = {}
        for ( let y = 0; y < map.length; y ++ ) {
            row[y] = false;
            if (map[x][y].tile == 'capital'){
                checkTiles.push([x,y])
                row[y] = true;
            }
        }
        mapBoundery[x] = row;
    }

    borders = [ [-1,0], [1,0], [0,-1], [0,1] ]


    while ( checkTiles.length != 0){
        
        checkTiles.forEach( t => {

            var color = map[t[0]][t[1]].color

            borders.forEach( b => {


                var checkTile = [ t[0] + b[0], t[1] + b[1] ]


                if ( mapBoundery[ checkTile[0] ][ checkTile[1] ]) 
                    return;

                else if (map[checkTile[0]][checkTile[1]].color == color){
                    nextCheckTiles.push( [checkTile[0] , checkTile[1] ] )  
                    mapBoundery[ checkTile[0] ][ checkTile[1] ] = true;
                }

            })
        })

        checkTiles = nextCheckTiles;
        nextCheckTiles = [];

    }

    for ( let x = 0; x < map.length; x ++ )
        for ( let y = 0; y < map.length; y ++ ) {
        
            if ( map[x][y].color != 'grey' && ! mapBoundery[x][y] )
                setColor( [x,y], 'grey')

        }

    
    return updateList;

}