//
// Stack.js
//
// Author: Evan Wilde <etcwilde@uvic.ca>
// Date:   Nov 23 2016
//

function Stack() {
    this._size = 0;
    this._storage = {};
}

Stack.prototype.size = function() {
    return this._size;
}

Stack.prototype.push = function(data) {
    this._storage[++this._size] = data;
}

Stack.prototype.peek = function() {
    if (this._size) {
        return this._storage[this._size];
    }
}

Stack.prototype.pop = function() {
    var deletedData;

    if (this._size) {
        deletedData = this._storage[this._size];
        delete this._storage[this._size];
        this._size--;

        return deletedData;
    }
}

Stack.prototype.clear = function() {
    this._size = 0;
    this._storage = {};
}

