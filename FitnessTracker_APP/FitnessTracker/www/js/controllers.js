angular.module('starter.controllers', [])


.controller('loginCtrl', ['$scope', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state,$ionicPopup)
{

  $scope.user = {};  //declares the object user
  // Switches from current login state to the next state defined in routes.js
  // Simply call $state.go(whateverpage)
  $scope.switchTo = function(newPage)
  {
    $state.go(newPage);
  };

  // Autherntification for user
  // TODO: Async call to the server and DB to authentificate the user
  $scope.authentificateUser = function()
  {
    var users_email = $scope.user.email;
    var users_password = $scope.user.password;
  };

  // State switch to proceed to main screen of the app
  $scope.proceedToMainScreen =  function()
  {

  };

}])

.controller('signupCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
