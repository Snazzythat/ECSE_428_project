// Injecting services to the controllers module which interacts directly with UI

angular.module('starter.controllers', ['starter.services'])

//~~~~~~~~~~~~~~~~~~~~~~~LOGIN CONTROLLER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.controller('loginCtrl', ['$scope', '$state', 'LoginService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, LoginService)
{
  console.log("Presently in login controller...");
  $scope.user = {};  //declares the object user

  var valid_parameters=false;

  // Switches from current login state to the next state defined in routes.js
  // Simply call $state.go(whateverpage)
  $scope.switchTo = function(newPage)
  {
    console.log("Switching to " + newPage);
    $state.go(newPage);
  };

  // Take action after login was called
  // If successful, simply switch to main mainMenu
  // Otherwise notify the user about failure
  var postLoginCallback = function(loginResult)
  {
    console.log("Server answered. Login outcome is " + loginResult);
    if (loginResult == "login_success")
    {
      console.log("Switching to main menu after successful login!");
      $state.go('mainmenu');
    }
    else if(loginResult == "server_notfound")
    {
      console.error("Server not found!");
      navigator.notification.alert('Server is offline. Please try again later.', function (){},'Error','Ok');
    }
    else if(loginResult == "server_error")
    {
      console.error("Server error!");
      navigator.notification.alert('Server error. Please contact the support.', function (){},'Error','Ok');
    }
    else if(signupResult == "bad_request")
    {
      console.error("Bad signup request");
      navigator.notification.alert('Server encountered a bad login request, make sure all data is valid.', function (){},'Error','Ok');
    }  
  }

  // Autherntification for user
  // TODO: Async call to the server and DB to authentificate the user (if exists or if noes not exist)
  $scope.authentificateUser = function()
  {
    var users_email = $scope.user.email;
    var users_password = $scope.user.password;

    console.log("Collected user info: User email is: " + users_email + " and password is: " + users_password);

    if (users_email === "undefined" || users_password === "undefined" || users_email === "" || users_password === "")
    {
      console.error("Wrong input format!");
      navigator.notification.alert('One of the fields is empty!', function (){},'Error','Retry');
      navigator.notification.vibrate(1000);
      valid_parameters=false;
    }
    else
    {
      valid_parameters=true;
    }

    // Async registration call
    if(valid_parameters)
    {
      console.log("Sending async login request...");
      LoginService.http_login_request(users_email,users_password, postLoginCallback);
    }
  };
}])

//~~~~~~~~~~~~~~~~~~~~~~~SIGNUP CONTROLLER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.controller('signupCtrl', ['$scope', '$state', 'SignUpService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, SignUpService) {

  //creating a new user object that we will get the new sign up parameters
  console.log("Presently in signup controller...");
  $scope.user = {};

  var valid_parameters=false;

  $scope.switchTo = function(newPage)
  {
    console.log("Switching to " + newPage);
    $state.go(newPage);
  };

  // Take action after signup was called
  // If successful, simply switch to main mainMenu
  // Otherwise notify the user about failure
  var postSignupCallback = function(signupResult)
  {
    console.log("Server answered. Login outcome is " + signupResult);
    if (signupResult == "signup_success")
    {
      navigator.notification.alert('Successful sign up. Welcome!', function (){},'Error','Ok');
      console.log("Switching to main menu after successful signup!");
      $state.go('mainmenu');
    }
    else if(signupResult == "server_notfound")
    {
      console.error("Server not found!");
      navigator.notification.alert('Server is offline. Please try again later.', function (){},'Error','Ok');
    }
    else if(signupResult == "server_error")
    {
      console.error("Server error");
      navigator.notification.alert('Server error. Please contact the support.', function (){},'Error','Ok');
    }
    else if(signupResult == "bad_request")
    {
      console.error("Bad signup request");
      navigator.notification.alert('Server encountered a bad sign up request, make sure all data is valid.', function (){},'Error','Ok');
    }   
  }

  $scope.signUpProcess = function()
  {
    varList = [];
    var new_users_username = String($scope.user.username);
    varList.push(new_users_username);
    var new_users_email = String($scope.user.email);
    varList.push(new_users_email);
    var new_users_password = String($scope.user.password);
    varList.push(new_users_password);
    var new_users_actualname = String($scope.user.name);
    varList.push(new_users_actualname);
    var new_users_birthday = String($scope.user.birthday);
    varList.push(new_users_birthday);

    // Verify first if no fields are empty
    // Name must not be empty
    // Email must not be empty and must consist of a certain format
    // Password cant be empty
    if(varList.indexOf("undefined")>= 0 || varList.indexOf("")>= 0)
    {
      console.error("Input error!");
      //navigator objects WILL NOT work in the ionic testing webserver, native device ONLY
      navigator.notification.alert('One of the fields is empty!', function (){},'Error','Retry');
      navigator.notification.vibrate(1000);
    }

    // Email must not be empty and must consist of a certain format (somestring@domain.com)
    if (new_users_email != "undefined")
    {
      if (new_users_email.indexOf('@') <= 0 || new_users_email.indexOf('.com') <= 0)
      {
        console.error("Wrong email format!");
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
      console.log("Sending async signup request...");
      SignUpService.send_http_signup(new_users_username,new_users_password,new_users_email,new_users_actualname, new_users_birthday, postSignupCallback);
    }
  };
}])

//~~~~~~~~~~~~~~~~~~~~~~~MAIN MENU CONTROLLER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.controller('mainMenuCtrl', ['$scope', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state)
{
  console.log("Presently in main menu controller...");

  $scope.switchTo = function(newPage)
  {
    console.log("Switching to " + newPage);
    $state.go(newPage);
  };
}]);
