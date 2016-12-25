// Visualize the tree

function ReingoldTree(treeData) {
    this.data = treeData;

    this.height = 480;
    this.width = 640;
    this.radius = 4;

    this.tree = d3.layout.tree()
        .size([this.width - this.radius * 2, this.height - this.radius * 3]);

    this.nodes = this.tree.nodes(treeData._root);
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

    var text = svg.selectAll("text")
        .data(this.nodes)
        .enter()
        .append("text");

    var testLabels = text
        .attr("x", function(d) { return d.x + rad + "px"; })
        .attr("y", function(d) { return d.y + rad + 1.5; })
        .text(function(d) { return d.data.message; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px");

    var circleAttribs = circles
        .attr("r", function(d) { return rad; })
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y + rad; });
}

