goog.provide('ngeo.drawrectangleDirective');

goog.require('ngeo');
goog.require('ol.geom.GeometryType');
goog.require('ol.interaction.Draw');
goog.require('ol.geom.Polygon');


/**
 * @return {angular.Directive} The directive specs.
 * @ngInject
 * @ngdoc directive
 * @ngname ngeoDrawrectangle
 */
ngeo.drawrectangleDirective = function() {
  return {
    restrict: 'A',
    require: '^^ngeoDrawfeature',
    /**
     * @param {!angular.Scope} $scope Scope.
     * @param {angular.JQLite} element Element.
     * @param {angular.Attributes} attrs Attributes.
     * @param {ngeo.DrawfeatureController} drawFeatureCtrl Controller.
     */
    link: function($scope, element, attrs, drawFeatureCtrl) {

      var drawRectangle = new ol.interaction.Draw({
        type: ol.geom.GeometryType.LINE_STRING,
        geometryFunction: function(coordinates, geometry) {
          if (!geometry) {
            geometry = new ol.geom.Polygon(null);
          }
          var start = coordinates[0];
          var end = coordinates[1];
          geometry.setCoordinates([
            [start, [start[0], end[1]], end, [end[0], start[1]], start]
          ]);
          return geometry;
        },
        maxPoints: 2
      });

      drawFeatureCtrl.registerInteraction(drawRectangle);
      drawFeatureCtrl.drawRectangle = drawRectangle;

      ol.events.listen(
          drawRectangle,
          ol.interaction.DrawEventType.DRAWEND,
          drawFeatureCtrl.handleDrawEnd.bind(
              drawFeatureCtrl, ngeo.GeometryType.RECTANGLE),
          drawFeatureCtrl
      );
      ol.events.listen(
          drawRectangle,
          ol.Object.getChangeEventType(
              ol.interaction.InteractionProperty.ACTIVE),
          drawFeatureCtrl.handleActiveChange,
          drawFeatureCtrl
      );
    }
  };
};


ngeo.module.directive('ngeoDrawrectangle', ngeo.drawrectangleDirective);
