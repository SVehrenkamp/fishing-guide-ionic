app.directive('d3Bars', ['$window', '$timeout',
  function($window, $timeout) {
    return {
      restrict: 'EA',
      scope: {
        data: '=',
        label: '@',
        onClick: '&'
      },
      link: function(scope, ele, attrs) {
 
          var renderTimeout;
         
          //Define Margins, Padding and Bar Height for graph
          var margin = parseInt(attrs.margin) || 20,
              barHeight = parseInt(attrs.barHeight) || 20,
              barPadding = parseInt(attrs.barPadding) || 5;
          
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
                  height = scope.data.length * (barHeight + barPadding),
                  color = d3.scale.category20(),
                  //x axis scale
                  xScale = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) {
                      return d.score;
                    })])
                    .range([0, width]);

              //Set Height to the SVG element
              svg.attr('height', height);
              
              //Draw the Bars
              svg.selectAll('rect')
                .data(data)
                .enter()
                  .append('rect')
                  .on('click', function(d,i) {
                    return scope.onClick({item: d});
                  })
                  //Set initial dimensions to Bars
                  .attr('height', barHeight)
                  .attr('width', 0)
                  .attr('x', Math.round(margin/2))
                  .attr('y', function(d,i) {
                    return i * (barHeight + barPadding);
                  })
                  //Color the Bars
                  .attr('fill', function(d) {
                    return color(d.score);
                  })
                  //Animate the Bars
                  .transition()
                    .duration(1000)
                    .attr('width', function(d) {
                      return xScale(d.score);
                    });
              //Add the text to the bars
              svg.selectAll('text')
                .data(data)
                .enter()
                  .append('text')
                  .attr('fill', '#fff')
                  .attr('y', function(d,i) {
                    return i * (barHeight + barPadding) + 15;
                  })
                  .attr('x', 15)
                  .text(function(d) {
                    return d.name + " (scored: " + d.score + ")";
                  });
            }, 200);
          };
      }}
}])