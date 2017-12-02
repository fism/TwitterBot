function rando (arr) {
    var index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

module.exports = rando;