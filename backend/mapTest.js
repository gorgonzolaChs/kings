
var map = require('./mapGenerator')( 21, [1,2,3] )

for ( let x = 0; x < 21; x ++)
    {

        var row = ''

    for ( let y = 0; y < 21; y ++)
        {
            if (map[x][y].tile == 'plain')
                row +=('   ')
            else if (map[x][y].tile == 'mount')
                row+=('███')
            else if (map[x][y].tile == 'producer')
                row += (' . ')
            else
                row += (' o ')
        }
        console.log(row)
    }