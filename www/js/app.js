// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('app', ['ionic', 'app.controller','ngResource', 'ngCordova', 'ipCookie', 'uiGmapgoogle-maps', 'lbServices'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function(uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
          key: 'AIzaSyCCPzv2FVkXMVLsppcE0GnTMACcx0bgUqA',
          v: '3.17',
          libraries: 'weather,geometry,visualization'
      });
  })
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html"
      }
    }
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.trip', {
    url: "/trips",
    views: {
      'menuContent': {
        templateUrl: "templates/trip.html",
        controller: "TripController"
      }
    }
  })
  .state('app.trip.trips', {
    url: "/:tripId",
    templateUrl: "templates/trips.trip.html",
    controller: "TripSessionController"
  })
  .state('app.lakes', {
    url: "/lakes",
    views: {
      'menuContent': {
        templateUrl: "templates/lakes.html",
        controller: "LakesController"
      }
    }
  })
  .state('app.lakeView', {
    url: "/lakes/:lakeId",
    views: {
      'menuContent': {
        templateUrl: "templates/lakes.lake.html",
        controller: "LakeViewController"
      }
    }
  })
  .state('app.reports', {
    url: "/reports",
    views: {
      "menuContent": {
        templateUrl: "templates/reports.html",
        controller: "ReportsController"
      }
    }
  })
  .state('app.favorites', {
    url: "/favorites",
    views: {
      "menuContent": {
        templateUrl: "templates/favorites.html",
        controller: "FavoritesController"
      }
    }
  });;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

    //Bootstrap App here
    // var $BASEURL = 'http://localhost:3000';
    var $BASEURL = 'http://spothoppers.com';
    var $KEY = "AIzaSyCCPzv2FVkXMVLsppcE0GnTMACcx0bgUqA";
    var coords = {};
    var setLocation = function(location){

      //coords.latitude = location.coords.latitude;
      //coords.longitude = location.coords.longitude;
      //Set Coords as cookies
      //ipCookie('lat', this.coords.latitude);
      //ipCookie('long', this.coords.longitude);

      app.constant('coordinates', location.coords);
      app.constant('$BASEURL', $BASEURL);
      app.constant('$KEY', $KEY);
      console.log('Location::', location.coords);
      bootstrapApplication();

    }

    //Call the browser's geolocation method to get coords
    var getLocation = function(){
      navigator.geolocation.getCurrentPosition(this.setLocation);
      console.log('Getting Location..');
      return this;
    }
    var bootstrapApplication = function() {
          angular.element(document).ready(function() {
            angular.element('#loader').addClass('loaded');
              angular.bootstrap(document, ["app"]);
        });
    }
    getLocation();