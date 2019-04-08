// ajax call to load initial json
var loadData = function(cmd){
                $.ajax({
                  type: 'GET',
                  contentType: 'application/json; charset=utf-8',
                  url: '/votes',
                  dataType: 'json',
                  success: function(data){
                    drawOrUpdate(data, cmd);
                  },             
                  failure: function(result){
                    error();
                  }
                });
              };

var drawOrUpdate = function(data, cmd){
                     if (cmd == "draw_bar_plot")
                       drawBarPlot(data);
                     else if (cmd == "update_page")
                       updatePage(data);
                     else
                       console.log("Unrecognized command: " + cmd);
                   };

function error() {
  console.log("Something went wrong!");
}

// Sets plot parameters
var barWidth = 20;
var colors = ['red', 'blue'];
var plotHeight = 300;

// Draww bar plot
function drawBarPlot(data){
// define linear y-axis scale
var yScale = d3.scaleLinear()
               .domain([0, d3.max(data)])
               .range([0, (plotHeight - 50)]);

  d3.select("#plot")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", barWidth)
    .attr("height", function(d){ return yScale(d); })
    .attr("fill", function(d, i) { return colors[i]; })
    .attr("x", function(d, i){
        return (i * 100) + 90;         // horizontal location of bars
    })
    .attr("y", function(d){ 
        return plotHeight - yScale(d); // scale bars within plotting area
    });
}

// Defines updateBarPlot() function
function updateBarPlot(data){
  var yScale = d3.scaleLinear()
                 .domain([0, d3.max(data)])
                 .range([0, (plotHeight - 50)]);

  d3.select("#plot")
    .selectAll("rect")
    .data(data)
    .transition()
    .attr("height", function(d){ return yScale(d); })
    .attr("y", function(d){
        return plotHeight - yScale(d);
    });
}

// Updates vote counters 
function updateVoteCounters(data){
  $("#red-count").html(data[0]);
  $("#blue-count").html(data[1]);
}

// Updates page (plot and counters)
function updatePage(data){
  updateBarPlot(data);
  updateVoteCounters(data);
}

// Loads data on page load
$(document).ready(function(){ 
  loadData('draw_bar_plot');
  setInterval(function(){
    loadData('update_page');
  }, 3000); 
});
