// Visualize the tree

function ReingoldTree(treeData, lookupTable) {
    this.data = treeData;

    this.height = 480;
    this.width = 640;
    this.radius = 4;

    this.tree = d3.layout.tree()
        .size([this.width - this.radius * 2, this.height - this.radius * 3]);

    this.nodes = this.tree.nodes(treeData._root);

    // Set the data with the elements as we need
    processArray(this.nodes, function(d) { d.data = lookupTable[d.key]; });
    this.links = this.tree.links(this.nodes);
}

ReingoldTree.prototype.setWidth = function(width){
    this.width = width;
    this.tree = tree.size([width, this.height]);
}

ReingoldTree.prototype.setHeight = function(height) {
    this.height = height;
    this.tree = tree.size([this.width, height]);
}

ReingoldTree.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;
    this.tree = tree.resize([width, height]);
}

ReingoldTree.prototype.size = function() {
    return [this.width, this.height];
}

ReingoldTree.prototype.draw = function(base) {
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {return [d.x, d.y];});

    var rad = this.radius;
    var svg = base.append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("class", "overlay");

    var link = svg.selectAll(".link")
        .data(this.links)
        .enter().append("g")
        .attr("fill", "none")
        .append("path")
        .attr("stroke-width", "1.2")
        .attr("stroke", "#666")
        .attr("class", "link")
        .attr("d", diagonal);

    var circles = svg.selectAll("circle")
        .data(this.nodes)
        .enter()
        .append("circle");

    var circleAttribs = circles
        .attr("r", function(d) { return rad; })
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y + rad; });

}

