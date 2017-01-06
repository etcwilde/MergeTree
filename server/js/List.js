//
// List.js
//
// Author: Evan Wilde <etcwilde@uvic.ca>
// Date:   December 09, 2016
//
// Linked list data structure
//


function ListNode(key, data=null) {
    this.parent = null;
    this.child = null;
    this.key = key;
    this.data = data;
}

function List() {
    this.head = null;
    this.tail = null;
    this.size = 0;
}

List.prototype.append = function(node) {
    if (this.size === 0) {
        this.head = node;
        this.tail = node;
    } else {
        this.tail.child = node;
        node.parent = this.tail;
        this.tail = this.tail.child;
    }
    this.size++;
}

List.prototype.prepend = function(node) {
    if (this.size === 0) {
        this.head = node;
        this.tail = node;
    } else {
        this.head.parent = node;
        node.child = this.head;
        this.head = this.head.parent;
    }
    this.size++;
}

List.prototype.add = function(node, index) {
    if (this.size <= index) this.append(node);
    else if (index === 0) this.prepend(node);
    else {
        var cur = this.head;
        for (;index; index--) cur = cur.child;
        cur.child.parent = node;
        node.child = cur.child;
        node.parent = cur;
        cur.child = node;
        this.size++;
    }
}

List.prototype.front = function() {
    return this.head;
}

List.prototype.back = function() {
    return this.tail;
}

List.prototype.get = function(index) {
    if (this.size === 0) return null;
    else if (index <= 0) return this.front();
    else if (index >= this.size) return this.back();
    else {
        var cur = this.head;
        for (; index; index--) cur = cur.child;
        return cur;
    }

}

List.prototype.remove = function(index) {
    if (this.size === 0) { return null;} // nothing...
    else if (index >= this.size || index < 0) { return undefined; }
    else if (index === 0) {
        var node = this.head;
        this.head = this.head.child;
        this.head.parent.child = null;
        this.head.parent = null;
        this.size--;
        return node;
    } else if (index === this.size) {
        var node = this.tail;
        this.tail = this.tail.parent;
        this.tail.child.parent = null;
        this.tail.child = null;
        this.size--;
        return node;
    } else {
        var cur = this.head;
        for(; index; index--) cur = cur.child;
        cur.parent.child = cur.child;
        cur.child.parent = cur.parent;
        cur.child = null
        cur.parent = null;
        this.size--;
        return cur;
    }
}

List.prototype.next = function*() {
    var cur = this.head;
    while (cur) {
        var reset = yield cur;
        if (reset) cur = this.head;
        cur = cur.child
    }
}


