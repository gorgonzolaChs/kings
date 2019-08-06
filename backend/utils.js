/* Array Options */

Array.prototype.shuffle = function() {
    var i = this.length, j, temp;
    if ( i == 0 ) return this;
    while ( --i ) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
}


Array.prototype.construct = function( callback ) {
    var construction = [];
    this.forEach( e => construction.push( callback(e) ) );
    return construction;
}

module.exports.randomInt = size => {
    return Math.floor(Math.random() * size)
}