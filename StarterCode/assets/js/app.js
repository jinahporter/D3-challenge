// @TODO: YOUR CODE HERE!

//Define SVG area
var svgWidth = 960;
var svgHeight = 500;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//define chart's margins
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

//set up chart's w, h
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

//SVG wrapper
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

//create tooltips & assign them to class
d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.csv("./assets/data/data.csv").then(function (healthData) {

    console.log(healthData);

    healthData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, data => data.poverty)])
        .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, data => data.healthcare)])
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", function (data) {
            //console.log(data.poverty)
            return xLinearScale(data.poverty);
        })
        .attr("cy", function (data) {
            //console.log(data.healthcare)
            return yLinearScale(data.healthcare);
        })
        .attr("r", 20)
        .style("fill", "red")
        .classed("circles", true)
        .attr("opacity", ".5");

    circlesGroup.select(".circles")
        .data(healthData)
        .enter()
        .append("text")
        .classed("center", true)
        .attr("x", function (data) {
            return xLinearScale(data.poverty);
        })
        .attr("y", function (data) {
            return yLinearScale(data.healthcare);
        })
        .text(function (data) {
            return data.abbr;
        })
        .attr("text-anchor", "middle")
        .attr("font-size", "10px");



    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Health Care: ${d.healthcare}`);
        });

    chartGroup.call(toolTip);

    circlesGroup.on("click", function (data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 40)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty(%)");
}).catch(function (error) {
    console.log(error);
});