//
// Queue.js
//
// Author: Evan Wilde <etcwilde@uvic.ca>
// Date:   Nov 23 2016
//
// Queue datastructure, adds things to the

function Queue() {
    this._frontIndex = 1;
    this._backIndex = 1;
    this._storage = {};
}

Queue.prototype.size = function() {
    return this._backIndex - this._frontIndex;
}

Queue.prototype.enqueue = function(data) {
    this._storage[this._backIndex++] = data;
}

Queue.prototype.peek = function() {
    if(this._backIndex != this._frontIndex) {
        return this._storage[this._frontIndex];
    }
}

Queue.prototype.dequeue = function() {
    if (this._backIndex !== this._frontIndex) {
        var deletedData = this._storage[this._frontIndex];
        delete this._storage[this._frontIndex++];
        return deletedData;
    }
}
