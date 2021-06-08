// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function (censusData) {

    // Parse Data/Cast as numbers
    censusData.forEach(function (data) {
        data.income = +data.income;
        data.obesity = +data.obesity;
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(censusData, d => d.income))
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain(d3.extent(censusData, d => d.obesity))
        .range([height, 0]);

    // Create axis functions
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "15")
        .attr("class", "stateCircle");



    // Add text labels in circles
    for (i = 0; i < censusData.length; i++) {
        chartGroup.append("text")
            .attr("x", xLinearScale(censusData[i].income))
            .attr("y", yLinearScale(censusData[i].obesity) + 5)
            .attr("class", "stateText")
            .text(censusData[i].abbr);
    }

    // Initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>Median Income ($): ${d.income}<br>Obesity %: ${d.obesity}`);
        });


    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function (d) {
        toolTip.show(d, this);
    })
        // Create "mouseout" event listener to hide tooltip
        .on("mouseout", function (d) {
            toolTip.hide(d);
        });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Obesity %");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText")
        .text("Median Household Income ($)");
}).catch(function (error) {
    console.log(error);
});