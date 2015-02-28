app.directive('d3Pie', ['$window', '$timeout' ,
  function($window, $timeout) {
    return {
      restrict: 'EA',
      scope: {
        data: '=',
        label: '@',
        onClick: '&'
      },
      link: function (scope, ele, attrs) {
 
        var renderTimeout;
       
        //Define Margins, Padding and Bar Height for graph
        var margin = parseInt(attrs.margin) || 20;
        
        //Create an SVG element and append it to the document
        var svg = d3.select(ele[0])
          .append('svg')
          .style('width', '100%');
        
        //Recalculate dimensions on document resize
        $window.onresize = function() {
          scope.$apply();
        };
        
        scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          scope.render(scope.data);
        });
        
        //Watch Data for changes, update the graphs when a change is detected
        scope.$watch('data', function(newData) {
          scope.render(newData);
        }, true);

        //Render Graph Data to Document
        scope.render = function(data) {
          svg.selectAll('*').remove();
          
          //If there is no data, return out of the method
          if (!data) return;
          if (renderTimeout) clearTimeout(renderTimeout);
          
          //Wait 200ms to make sure data is available and then render the svg graph
          renderTimeout = $timeout(function() {
                //Width of graph
            var width = d3.select(ele[0])[0][0].offsetWidth - margin,
                //Height of graph
                height = width,
                //Radius of graph
                radius = Math.min(width, height)/4,
                color = d3.scale.category20()
                //Create the Arc
                arc = d3.svg.arc()
                        .outerRadius(radius - 20)
                        .innerRadius(radius/2)
                //Create the Pie Layout
                pie = d3.layout.pie()
                        .sort(null)
                        .value(function(data) { 
                          return data.population; 
                        });

            //Set Height to the SVG element
            svg.attr('height', height)
               .attr('width', width);
          ;

            data.forEach(function(d) {
              d.population = +d.population;
            });
            
            var g = svg.selectAll(".arc")
              .data(pie(data))
              .enter().append("g")
              .attr("class", "arc")
              .attr("transform", "translate(" + width / 2 + "," + radius + 20 + ")");;
            
            g.append("path")
              .attr("d", arc)
              .style("fill", function(d) { return color(d.data.age); });
            
            g.append("text")
              .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .style("text-anchor", "middle")
              .style("color", "#FFFFFF")
              .text(function(d) { return d.data.age; });
          }, 200);
        };
      }
    }
  }]);