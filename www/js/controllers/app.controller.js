angular.module('app.controller', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, User, $location) {
  // Form data for the login modal
  $scope.loginData = {};
  //Token Expiration Date
  $scope.loginData.ttl = 1209600000;
  
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $scope.loginResult = User.login($scope.loginData,
      function(data){
        //success
        console.log('You Have Successfully Logged In!', data);
        $rootScope.user = User.getCurrent();
        $scope.modal.hide();
      },
      function(res){
        //error
        console.log('ERROR::', res);
      });

  };
})

