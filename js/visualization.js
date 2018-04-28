import * as d3 from "d3";

var svg = d3.select('#visualization')
			 	.append('svg')
				.classed('svg', true);

var canvas = svg.append('g')
				.classed('canvas', true);

var height = svg.node().scrollHeight;
var width = svg.node().scrollWidth;

 console.log(width);

var mapColor = '#7DCEEF';
var mapColor2 = 'transparent';

var projection = d3.geoMercator()
  .scale(150000)
  .center([-71.0589, 42.3601])
  .translate([width / 2, height/4]);

var path = d3.geoPath()
  .projection(projection);

var map = canvas.append('g')
  .classed('map', true);

var color = d3.scaleLinear()
  .domain([1, 10000])
  .clamp(true)
  .range(['#fff', 'gray']);

var mapFeatures = [];

var centered;
var redrawFinished = true;

var tooltipObj = { title : '',
					population : '',
					popDensity : '',
					crimes : ''};


d3.json('../data/map-data.geojson', function(error, data) {
 	mapFeatures = data.features;

 	map.selectAll('path')
	    .data(mapFeatures)
	    .enter().append('path')
	    .attr('d', path)
	    .attr('vector-effect', 'non-scaling-stroke')
	    .style('stroke', 'rgba(255,255,255,1)')
	    .style('fill', 'transparent');

});

var mapScreen;

function screen() {
	d3.json('../data/map-data.geojson', function(error, data) {
	 	var features = data.features;

		mapScreen = canvas.append('g')
		  .classed('map-screen', true);

	 	mapScreen.selectAll('path')
		    .data(features)
		    .enter().append('path')
		    .attr('d', path)
		    .attr('vector-effect', 'non-scaling-stroke')
		    .style('fill', 'transparent')
		  	.classed('map-screen-neighborhood', true)
		    .on('mouseover', function(d) {
		    	var that = d;

		    	tooltip(that);

			    d3.select(this)
				    .attr('stroke', 'rgba(255, 255, 255, 1)')
				    .attr('stroke-width', '1px')
				    .attr('stroke-dasharray', 1500 + ' ' + 1500)
				    .attr('stroke-dashoffset', 1500)
				    .transition()
				    .duration(2000)
				    .attr('stroke-dashoffset', 100);

				d3.selectAll('.map-screen-neighborhood').style('fill', function(d) {

						return 'transparent';
				});
		    })
		    .on('mouseleave', function() {
			    d3.select(this)
				    .attr('stroke-dashoffset', 100)
				    .transition()
				    .duration(1500)
				    .attr('stroke-dashoffset', 1500);

				d3.selectAll('.map-screen-neighborhood')
					.style('fill', 'transparent');

				removeTooltip();
		    })
		    .on("click", clickedNeighborhood);
	});

}

d3.select('.explore-button').on('click', draw);
d3.select('#pop').on('click', mapPop);
d3.select('#dens').on('click', mapDens);
d3.select('#crime').on('click', mapCrime);
d3.select('#heat-map-toggle').on('click', toggleHeatMap);

// TODO: rewrite/fix this resizing function
// window.addEventListener('resize', resize); 
function resize() {
	var newWidth = d3.select('#visualization').node().scrollWidth;

	if ( newWidth < width ) {
		var scaleY = 'scaleY(' + newWidth / width + ')';
		var scaleX = 'scaleX(' + newWidth / width + ')';
		d3.select('#visualization').style('transform', scaleY);
		canvas.style('transform', scaleX);
	}

}

function draw() {
	d3.select('#visualization').classed('vis', true);
	d3.select('.title-screen').classed('title-screen-hidden', true);
	d3.select('.title-logo').classed('logo-shown', true);
	d3.select('.controls').classed('controls2', true);
	map.classed('map2', true);
	d3.select('.explore-button').on('click', toggleLogo);
	d3.select('.title-logo').on('click', toggleTitle);


	setTimeout(mapPop, 1000);
	setTimeout(plotOpenSpace, 1050);
	setTimeout(drawHeatMap, 1100);
	setTimeout(plotWifi, 3900);
	setTimeout(plotMBTA, 3900);
	setTimeout(plotPolice, 4500);
	setTimeout(plotHospitals, 4500);
	setTimeout(screen, 4600);

}
function toggleTitle() {
	d3.select('.title-screen').classed('title-screen-hidden', false);
	d3.select('.title-screen').classed('title-screen-background', true);
	d3.select('.title-logo').classed('logo-shown', false);
}
function toggleLogo() {
	d3.select('.title-screen').classed('title-screen-hidden', true);
	d3.select('.title-screen').classed('title-screen-background', false);
	d3.select('.title-logo').classed('logo-shown', true);
}
function mapPop() {
	d3.selectAll('.control').classed('selected', false);
	d3.select('#pop').classed('selected', true);

    var max = d3.max(mapFeatures, function(d) {
	  		return d.properties.population;
  		});

    var formatedMax = Number(max).toLocaleString()
    d3.select('.max').html(formatedMax);

    color.domain([0, max])
    	.range([mapColor2, mapColor]);

	map.selectAll('path')
		.transition()
	 	.style('fill', function(d) {
	    	var fill = color(d.properties.population);
	    	return fill;
	 	})
}


function mapDens() {
	d3.selectAll('.control').classed('selected', false);
	d3.select('#dens').classed('selected', true);

    var max = d3.max(mapFeatures, function(d) {
	  		return d.properties.population_density;
  		});

    var formatedMax = Number(max).toLocaleString()
    d3.select('.max').html(formatedMax);

    color.domain([0, max])
    	.range([mapColor2, mapColor]);

	map.selectAll('path')
		.transition()
	 	.style('fill', function(d) {
	    	var fill = color(d.properties.population_density);
	    	return fill;
	 	})
}

function mapCrime() {
	d3.selectAll('.control').classed('selected', false);
	d3.select('#crime').classed('selected', true);

    var max = d3.max(mapFeatures, function(d) {
	  		return d.properties.crimes;
  		});

    var formatedMax = Number(max).toLocaleString()
    d3.select('.max').html(formatedMax);

    color.domain([0, max])
    	.range([mapColor2, mapColor]);

	map.selectAll('path')
		.transition()
	 	.style('fill', function(d) {
	    	var fill = color(d.properties.crimes);
	    	return fill;
	 	})
}




function tooltip(d) {
	var tooltip = d3.select('#tooltip')

	var neighborhood = d.properties.Name;

	var crimes = Number(d.properties.crimes).toLocaleString();
	var population = Number(d.properties.population).toLocaleString();
	var populationDensity =Number(d.properties.population_density).toLocaleString();

	tooltip.select('.neighborhood').html(neighborhood);

	tooltip.select('.population').html(population)
	tooltip.select('.pop-dens').html(populationDensity)
	tooltip.select('.crimes').html(crimes)

	tooltip.classed('tooltip-shown', true);
}
function removeTooltip() {
	var tooltip = d3.select('#tooltip')

	tooltip.select('.neighborhood').html(tooltipObj.title);

	tooltip.select('.population').html(tooltipObj.population)
	tooltip.select('.pop-dens').html(tooltipObj.popDensity)
	tooltip.select('.crimes').html(tooltipObj.crimes)


	tooltip.classed('tooltip-shown', false);

}


function plotPolice() {
	d3.csv('../data/Boston_Police_Stations.csv', function(error, data) {
	        var g = canvas.append("g");
	        var points = g.selectAll("circle")
	            .data(data);

	        points.enter().append("circle")
	            .attr("r", 0)
	            .attr("cx", function(d) {
	                var lon = parseFloat(d.X);

	                if(!Number.isNaN(lon)) {
		                var lat = parseFloat(d.Y);
		                var coord = projection([lon, lat]);

		                return coord[0];
	                } else {
	                	return -10;
	                }

	            })
	            .attr("cy", function(d) {
		            var lat = parseFloat(d.Y);

	                if(!Number.isNaN(lat)) {
		                var lon = parseFloat(d.X);
		                var coord = projection([lon, lat]);

		                return coord[1];
	                } else {
	                	return -10;
	                }
	            })
				.style('stroke', 'rgba(255,255,255,.9)')
				.style('fill', 'transparent')
				.transition()
	            .attr("r", 5)
	            .style('stroke-width', '2px');

	});
}

function plotWifi() {
	d3.csv('../data/Wicked_Free_WiFi_Locations.csv', function(error, data) {
	        var g = canvas.append("g");
	        var points = g.selectAll("circle")
	            .data(data);

	        points.enter().append("circle")
	            .attr("r", 0)
	            .attr("cx", function(d) {
	                var lon = parseFloat(d.X);

	                if(!Number.isNaN(lon)) {
		                var lat = parseFloat(d.Y);
		                var coord = projection([lon, lat]);

		                return coord[0];
	                } else {
	                	return -10;
	                }

	            })
	            .attr("cy", function(d) {
		            var lat = parseFloat(d.Y);

	                if(!Number.isNaN(lat)) {
		                var lon = parseFloat(d.X);
		                var coord = projection([lon, lat]);

		                return coord[1];
	                } else {
	                	return -10;
	                }
	            })
				.style('fill', 'transparent')
	            .style('stroke', 'rgba(255,255,255,.45)')
				.transition()
	            .attr("r", 3)
	            .style('fill', 'rgba(0,0,0,0.5)');

	});
}


function plotMBTA() {

	d3.json('../data/mbta-lines.geojson', function(error, data) {
		 var features = data.features;

	    var g = canvas.append("g");

	 	g.selectAll('path')
		    .data(features)
		    .enter().append('path')
		    .attr('d', path)
		    .attr('vector-effect', 'non-scaling-stroke')
		    .style('stroke', 'rgba(255,255,255,.5)')
		    .style('fill', 'transparent')
		    .attr('stroke-dasharray', '1250 1250')
            .attr('stroke-dashoffset', 1250)
            .transition()
            .duration(1500)
            .attr('stroke-dashoffset', 0);

	});
	d3.json('../data/mbta-stops.geojson', function(error, data) {

		 	var features = data.features;

	        var g = canvas.append("g");
	        var points = g.selectAll("circle")
	            .data(features);

	        points.enter().append("circle")
	            .attr("r", 0)
	            .attr("cx", function(d) {
	                var lon = parseFloat(d.geometry.coordinates[0]);

	                if(!Number.isNaN(lon)) {
		                var lat = parseFloat(d.geometry.coordinates[1]);
		                var coord = projection([lon, lat]);

		                return coord[0];
	                } else {
	                	return -10;
	                }

	            })
	            .attr("cy", function(d) {
		            var lat = parseFloat(d.geometry.coordinates[1]);

	                if(!Number.isNaN(lat)) {
		                var lon = parseFloat(d.geometry.coordinates[0]);
		                var coord = projection([lon, lat]);

		                return coord[1];
	                } else {
	                	return -10;
	                }
	            })
				.style('fill', 'rgba(255,255,255,.75)')
				.transition()
	            .attr("r", 2)
	            .style('fill', 'rgba(255,255,255,.75)');

	});
}

function plotHospitals() {
	d3.csv('../data/hospital-locations.csv', function(error, data) {
	        var g = canvas.append("g");
	        var points = g.selectAll("text")
	            .data(data);

	        points.enter().append("text")
	            .html("+")
	            .attr("x", function(d) {
	                var lon = parseFloat(d.longitude);

	                if(!Number.isNaN(lon)) {
		                var lat = parseFloat(d.latitude);
		                var coord = projection([lon, lat]);

		                return coord[0];
	                } else {
	                	return -10;
	                }

	            })
	            .attr("y", function(d) {
		            var lat = parseFloat(d.latitude);

	                if(!Number.isNaN(lat)) {
		                var lon = parseFloat(d.longitude);
		                var coord = projection([lon, lat]);

		                return coord[1];
	                } else {
	                	return -10;
	                }
	            })
	            .classed('hospital-point', true)
				.style('fill', 'transparent')
				.transition()
	            .style('fill', 'rgba(62, 148, 255, 0.8)');

	});
}

function drawHeatMap() {
	var clipFeatures;

	d3.json('../data/map-clip-shape.geojson', function(error, data) {
	 	clipFeatures = data.features;
	});

	d3.json('../data/heat-map.geojson', function(error, data) {


	var features = data.features;
	var hm = canvas.append("g").classed('heat-map-container heat-map-on', true);

	canvas.append("clipPath")
	  	.data(clipFeatures)
		.attr("id", "clip") 
	  	.append("path")
	    .attr('d', path);

    var t = 1000;

 	hm.selectAll('path')
	    .data(features)
	    .enter().append('path')
		.attr('clip-path', function(d,i) {
			if(i == 4) {
				return 'url(#clip)';
			} else {
				return '';
			}
		})
		.attr('d', path)
	    .style('fill', function (d) {
	    	var color = getHeatMapColor(d.properties.DN);

	    	return color;
	    })
		.classed('heat-map heat-map-on', true);

		setTimeout(heatmapTransition, 100);
	});

}

function heatmapTransition() {
	d3.selectAll('.heat-map').attr('class', function(d,i) {

			var el = '.hm-checkbox-' + i;
			var t = 400 * i;

			setTimeout(heatmapControls, t);

			return 'heat-map heat-map-' + i;
		});
}

function getHeatMapColor(val) {

	var colors = [{"value" : 4, "color" : "rgba(255, 236, 227, .65)"},
				{"value" : 160, "color" : "rgba(255, 209, 159, .65)"},
				{"value" : 427, "color" : "rgba(255, 140, 38, .65)"},
				{"value" : 835, "color" : "rgba(240, 65, 0, .65)"},
				{"value" : 1111, "color" : "rgba(137, 30, 0, .65)"}];

	var color = "purple";
	for (var i = 0; i < colors.length; i++) {
		if(colors[i].value == val) {
			color = colors[i].color;
		}
	}

	return color;
}

function plotOpenSpace() {
	d3.json('../data/open-space.geojson', function(error, data) {
	 	var features = data.features;

	    var space = canvas.append('g').classed('open-space', true);

		var pattern = space.append('defs')
		    .append('pattern')
		    .attr('id', 'dots-pattern2')
		    .attr('patternUnits', 'userSpaceOnUse')
		    .attr('width', 4)
		    .attr('height', 4)
		    .append('path')
		    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
		    .attr('stroke', 'rgba(0,0,0,.4)')
		    .attr('stroke-width', .5);

		space.selectAll('.space')
		    .data(features)
		    .enter().append('path')
		    .classed('space', true)
		    .attr('d', path)
		    .style('fill', 'rgba(191, 234, 148, .5');

	});
}
function toggleHeatMap() {
	var bool = d3.select('.heat-map-container').classed('heat-map-on');
	
	d3.select('.heat-map-container').classed('heat-map-on', !bool)
}

function clickedNeighborhood(d) {
	  var x, y, k;

	  if (d && centered !== d) {

	    var centroid = path.centroid(d);
	    x = centroid[0];
	    y = centroid[1];
	    k = 3;
	    centered = d;

	    d3.select('.tooltip').classed('tooltip-zoomed', true);
		d3.select('.tooltip-close').on('click', zoomOut);

		console.log(d);

		tooltipObj.title = d.properties.Name;
		tooltipObj.population = Number(d.properties.population).toLocaleString();
		tooltipObj.popDensity = Number(d.properties.population_density).toLocaleString();
		tooltipObj.crimes = Number(d.properties.crimes).toLocaleString();

	  } else {

	    x = width / 2;
	    y = height / 2;
	    k = 1;
	    centered = null;

	    d3.select('.tooltip').classed('tooltip-zoomed', false);

		tooltipObj = { title : '',
						population : '',
						popDensity : '',
						crimes : ''};
	  }

	  mapScreen.selectAll("path")
	      .classed("centered", centered)
	      .classed("active", centered && function(d) { return d === centered; });

	  canvas.transition()
	      .duration(750)
	      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");


}
function zoomOut() {
	clickedNeighborhood(false);
}

function heatmapControls() {
	// d3.select(el).property('disabled', false);
	d3.select('.hm-checkbox-disabled')
		.classed('hm-checkbox-disabled', false)
		.property('disabled', false)
		.on('click', heatmapInputs)

}

function heatmapInputs() {
	var value = d3.event.target.value;
	var id = '.heat-map-' + value;
	var bool = d3.event.target.checked;
	var opacity = bool ? 1 : 0;

	d3.select(id).style('transition', '.2s').style('transition-delay', '0').style('opacity', opacity);
}

// d3.selectAll('.key-with-information').on('click', openInformation);
d3.selectAll('.information-label-screen').on('click', openInformation);

function openInformation() {
	var info = d3.event.target.dataset.info;

	d3.json('../data/info-content.json', function (data) {

		var infoObj = getInfoObj(data.data, info);

		var infoString = parseInfoContent(infoObj.content);
		d3.select('.information-title').html(infoObj.title);
		d3.select('.information-text').html(infoString);

		d3.select('.information-screen').classed('hidden', false)
		d3.select('.information-close').on('click', closeInformation);

		setTimeout(showInfo, 100)

	})

}

// parse the info content and return the new string with HTML elements
function parseInfoContent(content) {
	var contentArray;
	var contentString = content;

	if (content.indexOf('/n') > -1) {

		contentString = '';
		contentArray = content.split('/n')

		for (var i = 0; i < contentArray.length; i++) {

			if (i == 0) {
				contentString = '<p>' + contentArray[i];
			} else {
				contentString = contentString + '</p><p>' + contentArray[i] + '</p>';
			}
		}
	}

	if (contentString.indexOf('/link') > -1) {

		contentArray = contentString.split('/link');
		contentString = '';

		for (var i = 0; i < contentArray.length; i++) {


			if (contentArray[i].indexOf('/address') > -1) {

				var linkArray = contentArray[i].split('/address');
				var linkString = '<a href=\"' + linkArray[1] + '\" >' + linkArray[0] + '</a>';

				contentString = contentString + linkString;

			} else {
				contentString = contentString + contentArray[i];
			}
		}
	}

	return contentString;
}


function showInfo() {
	d3.select('.information-screen').classed('information-screen-shown', true);
}

function getInfoObj(infoArr, info) {

	for(var i = 0; i < infoArr.length; i++) {

		if (infoArr[i].info == info) {
			return infoArr[i];
		}
	}
}

function closeInformation() {
	d3.select('.information-screen').classed('information-screen-shown', false);
	d3.select('.information-screen').classed('hidden', true);

}