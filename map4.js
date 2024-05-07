var width = 1000;
var height = 500;

// create color scale
// const color = d3.scaleOrdinal().domain(['1','6','11','26','101','1001'])
// .range(d3.schemeOrRd[7]);
//.range(['#f5da42', '#f29f05','#cc5d02','#7a0901', '#74007a', '#6a039e','#420187']);
const color = d3.scaleThreshold().domain([1, 4, 8, 12, 16, 20]).range(d3.schemeOrRd[7]);

// world map projection
var projection = d3.geoRobinson()
.scale(130)
.translate([width / 2, height / 2]);

var path = d3.geoPath()
  .projection(projection);

// specify inital selected variable in dropdown menu
var selectedVariable = 'beef'

// create svg element and append map
var svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// create tooltip
var div = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .attr('opacity', 0);

// load world country geojson data and merge with states data
d3.csv('meat1.csv', function(data) {
  d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson', function(json) {
    for (var i = 0; i < data.length; i++) {
      var country = data[i].country;
      var beef = data[i].beef;
      var pig = data[i].pig;
      var poultry = data[i].poultry;
      var sheep = data[i].sheep;

      for (var j = 0; j < json.features.length; j++) {
        //var jsonState = json.features[j].properties.name;
        var jsonState = json.features[j].properties.name;
        if (country == jsonState) {
          json.features[j].properties.beef = beef;
          json.features[j].properties.pig = pig;
          json.features[j].properties.poultry = poultry;
          json.features[j].properties.sheep = sheep;
          break;
        }
      }
    }

    map = svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('stroke', '#000')
      .attr('stroke-width', '0.5')
      .attr('fill', function(d) { return color(d.properties[selectedVariable]) })
      .call(updateMap)
      .on('mouseover', function(d) {
        div.style('display', 'inline');
      })
      .on('mousemove', function(d) {
        div.html(d.properties.name + '<br>' + 'Beef: ' + d.properties.beef +
        '<br>' + 'Pig: ' + d.properties.pig+'<br>' + 'Sheep: ' + d.properties.sheep+'<br>' + 'Poultry: ' + d.properties.poultry)
        .style('left', (d3.event.pageX - (parseInt(div.style('width'), 10) /2)) + 'px')
        .style('top', (d3.event.pageY - parseInt(div.style('height'), 10) - 10) + 'px');
      })
      .on('mouseout', function(d) {
        div.style('display', 'none');
      });
  });
});

// create dropdown menu that changes map
// create dropdown menu options and map options to variable names in data
var dropdownOptions = ['beef', 'pig','poultry','sheep'];
var variableNames = {'beef': 'beef', 'pig': 'pig', 'poultry': 'poultry', 'sheep': 'sheep'};

// handler for user selections in dropdown
var dropdownChange = function() {
    var variable = d3.select(this).property('value')
    selectedVariable = variableNames[variable]
    map.call(updateMap)
};

var dropdown = d3.select('body')
  .insert('select', 'svg')
  .on('change', dropdownChange);

dropdown.selectAll('option')
  .data(dropdownOptions)
  .enter().append('option')
  .attr('value', function (d) { return d; })
  .text(function (d) { return d; });

function updateMap(selection) {
  selection.transition()
    .duration(500)
    .attr('fill', function(d) { return color(d.properties[selectedVariable]) })
};
//Legend
var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");
g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("2017: Average kilogram of Meat Products consumed per capita by each Country");
var labels = ['0', '1-3', '4-7', '8-11', '12-15', '16-19', '> 20'];
var legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(color);
svg.select(".legendThreshold")
    .call(legend);

// const legendRectSize = 30;
// const legendSpacing = 10;

// var legend = svg.append('g')
//   .selectAll('g')
//   .data(color.domain().reverse() )
//   .enter()
//   .append('g')
//     .attr('class', 'legend')
//     .attr('transform', function(d, i) {
//       var height = legendRectSize;
//       var x = 0;
//       var y = i * height;
//       return 'translate(' + 850 + ',' + y + ')';
//     });

// legend.append('rect')
//   .attr('width', legendRectSize)
//   .attr('height', legendRectSize)
//   .attr('fill', color)
//   .attr('stroke', '#000')
//   .attr('stroke-width', '1')

// legend.append('text')
//   .attr('x', legendRectSize + legendSpacing)
//   .attr('y', legendRectSize - legendSpacing)
//   .text(function(d) { return d; });