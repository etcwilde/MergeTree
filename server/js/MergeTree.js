function MergeTree() {
    this.nodeLookup = {};
    this.root = null;
    this.tree = new Tree();
    this.mergeCommits = [];
    this.children = {};
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
MergeTree.prototype.phase1 = async function(mergetree, rootHash) {
    let depth = 0;
    let nodeQueue = new Queue();
    let children = {};

    nodeQueue.push(new Promise(function(resolve, reject){ resolve(rootHash);}));
    mergetree.root = new TreeNode(rootHash);

    do {
        let cur = await nodeQueue.pop();
        let parentList = mergetree.nodeLookup[cur].parents.map(function(par){
            return new Promise(function(resolve, reject){
                // Add current as child of parent if not already a child
                if (par.hash in children) {
                    if (!children[par.hash].includes(cur)) children[par.hash].push(cur);
                } else children[par.hash] = [cur];
                // If we have downloaded the commit, resolve immediately,
                // otherwise, download it
                if (par.hash in mergetree.nodeLookup) resolve(par.hash);
                else {
                    mergetree.downloadCommits(par.links.self.href)
                        .then(function(ret){ return mergetree.populateTable([ret]);})
                        .then(function() {resolve(par.hash);});
                }
            });
        });
        let val = await parentList[0];
        let removal = ((children[val]) ? children[val].length : 0);
        depth += parentList.length - removal;
        parentList.forEach(function(item) { nodeQueue.push(item); });
    } while (nodeQueue.size() > 0 && depth != 0);
    mergetree.children = children;
    return mergetree;
}

// Phase 2: Takes the children and arranges them into a tree
MergeTree.prototype.phase2 = async function(mergetree) {
    mergetree.tree.add(mergetree.root);
    var mtree = mergetree;
    let depth = 0;
    let nodeQueue = new Queue();
    nodeQueue.push(mergetree.root);
    do {
        let cur = nodeQueue.pop();
        let parentList = mergetree.nodeLookup[cur.key].parents.map(function(par) { return par.hash; });
        let old_length = parentList.length;
        if (depth == 0) { parentList.shift(); }
        if (old_length > 1) { depth += parentList.length; }
        parentList.forEach(function(item){
            let newNode = new TreeNode(item);
            if (mergetree.children[item].length > 1) depth--;
            if (mergetree.children[item][0] == cur.key) {
                cur.children.push(newNode);
                newNode.parent = cur;
                nodeQueue.push(newNode);
            }
        })
    } while (nodeQueue.size() > 0 && depth != 0);
    return mergetree;
}
