
function drawCrimes() {
	d3.csv('./../data/crime.csv', function(error, data) {
			// var sample = data.slice(0,20)
			// console.log(sample);

	        var g = canvas.append("g");

	        var points = g.selectAll("circle")
	            .data(data);

	        points.enter().append("circle")
	            .attr("r", 1)
	            .attr("cx", function(d) {

	                var lon = parseFloat(d.Long);
	                if(!Number.isNaN(lon)) {
		                var lat = parseFloat(d.Lat);
		                var coord = projection([lon, lat]);
		                return coord[0];
	                } else {
	                	return -10;
	                }

	            })
	            .attr("cy", function(d) {

		            var lat = parseFloat(d.Lat);
	                if(!Number.isNaN(lat)) {
		                var lon = parseFloat(d.Long);
		                var coord = projection([lon, lat]);
		                return coord[1];
	                } else {
	                	return -10;
	                }
	            })
				.style('fill', 'rgba(255,0,0,0.0 5)');

	});
}

function plotPolice() {
	d3.csv('./../data/Boston_Police_Stations.csv', function(error, data) {
			// var sample = data.slice(0,20)
			// console.log(sample);

	        var g = canvas.append("g");

	        var points = g.selectAll("circle")
	            .data(data);

	        points.enter().append("circle")
	            .attr("r", 1)
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
				.style('stroke', 'rgba(0,0,0,0.25)')
				.style('fill', 'transparent');

	});
}
