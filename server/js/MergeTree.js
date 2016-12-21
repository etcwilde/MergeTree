function MergeTree() {
    this.nodeLookup = {};
    this.root = null;
    this.tree = new Tree();
    this.mergeCommits = [];
}

// Asynchronous download of commits, returns promise either responding or rejecting
MergeTree.prototype.downloadCommits = function(url) {
    return new Promise(function(resolve, reject){
        request({
            url: url,
            success: resolve,
            error: function(e) {reject(Error(e));}});
    });
}

// This should be handled inside of our download commits function
MergeTree.prototype.populateTable = function(commits) {
    var mergeTree = this;
    return new Promise(function(resolve, reject) {
        for (var commit of commits) {
            mergeTree.nodeLookup[commit.hash] = commit;
        }
        mergeTree.mergeCommits = commits.filter(function(val) { return val.parents.length > 1;}).map(function(val) { return val.hash; });
        resolve(mergeTree);
    });
}

// Phase 1, find the children of nodes that are important
// TODO: We need a way to define a root node
MergeTree.prototype.phase1 = async function(input) {
    let depth = 0;
    let nodeQueue = new Queue();
    let children = {};

    this.root = new TreeNode(input.mergeCommits[0]);

    // Use the first one
    nodeQueue.push(new Promise(
            function(resolve, reject) { resolve(input.mergeCommits[0]);}));
    do {
        let cur = await nodeQueue.pop();
        let parentList = input.nodeLookup[cur].parents.map(function(par){
            return new Promise(function(resolve, reject){
                (par.hash in children) ? children[par.hash].push(cur) : children[par.hash] = [cur];
                if (par.hash in input.nodeLookup) {
                    resolve(par.hash);
                } else {
                    input.downloadCommits(par.links.self.href)
                        .then(function(ret){ return input.populateTable([ret]);})
                        .then(function() {resolve(par.hash);});
                }
            });
        });
        let val = await parentList[0];
        let removal = ((children[val]) ? children[val].length : 0);
        depth += parentList.length - removal;
        parentList.forEach(function(item) { nodeQueue.push(item); });
    } while (nodeQueue.size() > 0 && depth != 0);
    return children;
}

// Phase 2: Takes the children and arranges
MergeTree.prototype.phase2 = async function(children) {
    this.tree.add(this.root);
    console.log(this.tree);
    var mtree = this;
    let depth = 0;
    let nodeQueue = new Queue();
    nodeQueue.push(this.root);
    do {
        let cur = nodeQueue.pop();
        let parentList = this.nodeLookup[cur.key].parents.map(function(par) { return par.hash; });

        let old_length = parentList.length;
        if (depth == 0) { parentList.shift(); }
        if (old_length > 1) { depth += parentList.length; }
        parentList.forEach(function(item){
            if (!(item in mtree.nodeLookup)) {
                // Not sure why this happens, but it does
                // I think it is when there are smaller branches between the branch
                // point and the merge point
                console.error("Not available", item);
                return;
            }
            let newNode = new TreeNode(item);
            let addNode = null,
                setfunc = function(node) { addNode = node;};

            if (children[item].length > 1) {
                depth--;
            }
            if (children[item][0] == cur.key) {
                cur.children.push(newNode);
                newNode.parent = cur;
                nodeQueue.push(newNode);
            }
        })
    } while (nodeQueue.size() > 0 && depth != 0);
    return this.tree;
}
