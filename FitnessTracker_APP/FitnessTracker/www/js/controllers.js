// Injecting services to the controllers module which interacts directly with UI

angular.module('starter.controllers', ['starter.services'])

//~~~~~~~~~~~~~~~~~~~~~~~LOGIN CONTROLLER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.controller('loginCtrl', ['$scope', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $ionicPopup)
{

  $scope.user = {};  //declares the object user
  // Switches from current login state to the next state defined in routes.js
  // Simply call $state.go(whateverpage)
  $scope.switchTo = function(newPage)
  {
    $state.go(newPage);
  };

  // Autherntification for user
  // TODO: Async call to the server and DB to authentificate the user (if exists or if noes not exist)
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

//~~~~~~~~~~~~~~~~~~~~~~~SIGNUP CONTROLLER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.controller('signupCtrl', ['$scope', '$state', 'SignUpService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, SignUpService) {

  //creating a new user object that we will get the new sign up parameters

  $scope.user = {};

  var valid_parameters=false;

  $scope.signUpProcess = function()
  {
    var new_users_name = String($scope.user.name);
    var new_users_email = String($scope.user.email);
    var new_users_password = String($scope.user.password);

    // Verify first if no fields are empty
    // Name must not be empty
    // Email must not be empty and must consist of a certain format
    // Password cant be empty
    if (new_users_password === "undefined" || new_users_name === "undefined" || new_users_email === "undefined" || new_users_password === "" || new_users_name === "" || new_users_email === "" )
    {
      //navigator objects WILL NOT work in the ionic testing webserver, native device ONLY
      navigator.notification.alert('One of the fields is empty!', function (){},'Error','Retry');
      navigator.notification.vibrate(1000);
    }

    // Email must not be empty and must consist of a certain format (somestring@domain.com)
    if (new_users_email != "undefined")
    {
      if (new_users_email.indexOf('@') <= 0 || new_users_email.indexOf('.com') <= 0)
      {
        navigator.notification.alert('Email has invalid format. Please use @domain.com', function (){},'Error','Retry');
      }
      else
      {
        valid_parameters = true;
      }
    }

    // Proceed building login request only at when all parameters are valid
    if(valid_parameters)
    {
      // TODO: make sure to use a valid url with out webserver and see what it accepts.
      // Make a login php script
      SignUpService.send_http_signup(new_users_name,new_users_password,new_users_email);
    }
  };


}])
