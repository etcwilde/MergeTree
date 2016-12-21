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
