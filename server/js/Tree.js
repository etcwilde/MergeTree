//
// Tree.js
//
// Author: Evan Wilde <etcwilde@uvic.ca>
// Date:   Nov 24 2016
//
// Trees are rooted, non-cyclic data structures for hierarchical data
//


function Node(key, data=null) {
    this.parent = null;
    this.children = [];
    this.key = key;
    this.data = data;
}

function Tree() {
    this._root = null;
}

// Traverses the tree breadth-first
Tree.prototype.traverseBF = function(callback) {
    var queue = new Queue();

    var currentTree = this._root;

    while (currentTree) {
        for (var i = 0; i < currentTree.children.length; i++) {
            queue.enqueue(currentTree.children[i]);
        }

        callback(currentTree);
        currentTree = queue.dequeue();
    }
}

// Traverses the tree depth-first
Tree.prototype.traverseDF = function(callback) {
    var stack = new Stack();
    var currentTree = this._root;

    while (currentTree) {
        for (var i = 0; i < currentTree.children.length; i++) {
            stack.push(currentTree.children[i]);
        }

        callback(currentTree);
        currentTree = stack.pop();
    }
}

// find
//
// Performs the action in callback for each node that has a given key
Tree.prototype.find = function(key, callback, traversal) {
    if (traversal === undefined) traversal = this.traverseBF;
    traversal.call(this, function(node) { if(node.key == key) callback(node); });
}

// Add
//
Tree.prototype.add = function(node, parentkey, traversal){

    if (this._root == null) {
        this._root = node;
    } else {
        var parents = [],
        callback = function(node) { parents.push(node); };
        this.find(parentkey, callback, traversal);
        parents.forEach(function(p) { p.children.push(node); node.parent = p;})
    }
    return node;
}


Tree.prototype.addPath = function(child, path) {

    if (this._root == null) {
        this._root = child;
    } else {
        var parent = null,
            cur = this._root,
            callback = function(key){
                if (cur.children.length != 0) {
                    cur.children.forEach(function(node) {
                        if (node.key == key) cur  = node;
                    })
                }
            }
        path.forEach(callback);

        cur.children.push(child);
        child.parent = cur;
    }

    return child;
}

// Remove
//

Tree.prototype.remove = function(key, traversal) {
    var tree = this,
    removalNode = null,
    removedData = undefined;

    var callback = function(node) {
        removalNode = node;
    }


    this.find(key, callback, traversal);

    if (removalNode) {
        removedData = removalNode.data;

        function findIndex(arr, node) {
            var index;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === node) {
                    index = i;
                    break;
                }
            }
            return index;
        }

        // remove self from parent's children
        var index = findIndex(removalNode.parent.children, removalNode);
        if (index) {
            removalNode.parent.children.splice(index, 1);
            removalNode.parent = null;
        }
    }
    return removedData;
}

Tree.prototype.removePath = function(path) {

    function findIndex(arr, node) {
        var index;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === node) {
                index = i;
                break;
            }
        }
        return index;
    }

    var removedData;

    if (this._root == null) {
        return undefined;
    }

    var cur = this._root,
    callback = function(key) {
        if (cur.children.length != 0) {
            cur.children.forEach(function(node){
                if(node.key == key) cur = node;
            })
        }
    }

    path.forEach(callback);

    removedData = cur.data;
    var index = findIndex(cur.parent.children, cur);
    if (index) { cur.parent.children.splice(index, 1); }
    cur.parent = null;

    return removedData;

}

