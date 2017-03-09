// Injecting services to the controllers module which interacts directly with UI

angular.module('starter.controllers', ['starter.services'])

//~~~~~~~~~~~~~~~~~~~~~~~LOGIN CONTROLLER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.controller('loginCtrl', ['$scope', '$state', 'LoginService','UserFactory','TrainerFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, LoginService,UserFactory,TrainerFactory)
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
  // The call back gets the status code of the request as well as the data that the server returns
  // at successful login. Any error will result in an empty data dictionnary
  var postLoginCallback = function(loginResult,loginData)
  {
    console.log("Server answered. Login outcome is " + loginResult);
    if (loginResult == "login_success_user")
    { 
      console.log("Data from successfull user login received from server: " + JSON.stringify(loginData));

      console.log("Creating a User object with all the data received...");

      //Unlike sign up, we have to request data at successful login.
      UserFactory.set('name', loginData.name);
      UserFactory.set('username', loginData.username);
      UserFactory.set('email', loginData.email);
      UserFactory.set('d_o_b', loginData.d_o_b);

      console.log("Switching to main menu after successful USER login!");

      $state.go('trainee'); //Default tabs for now
    }
    //TODO: be able to login onto trainer menu
    else if (loginResult == "login_success_trainer")
    {
      console.log("Data from successfull trainer login received from server: " + JSON.stringify(loginData));

      console.log("Creating a Trainer object with all the data received...");

      //Unlike sign up, we have to request data at successful login.
      TrainerFactory.set('name', loginData.name);
      TrainerFactory.set('username', loginData.username);
      TrainerFactory.set('email', loginData.email);
      TrainerFactory.set('d_o_b', loginData.d_o_b);

      console.log("Switching to main menu after successful TRAINER login!");

      $state.go('trainer'); //Default tabs for now
    }
    else if(loginResult == "user_notfound")
    {
      console.error("User not found!");
      navigator.notification.alert('You have not signed up yet! Please sign up first!', function (){},'Error','Ok');
    }
    else if(loginResult == "server_error")
    {
      console.error("Server error!");
      navigator.notification.alert('Server error. Please contact the support.', function (){},'Error','Ok');
    }
    else if(signupResult == "server_notfound")
    {
      console.error("Server not found!");
      navigator.notification.alert('Server is offline. Please try again later.', function (){},'Error','Ok');
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

.controller('signupCtrl', ['$scope', '$state', 'SignUpService','UserFactory','TrainerFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, SignUpService, UserFactory,TrainerFactory) {

  //creating a new user object that we will get the new sign up parameters
  console.log("Presently in signup controller...");
  $scope.user = {};

  var valid_parameters=false;
  var userType='';
  var userName='';
  var userActualName='';
  var userEmail='';
  var usersBirthday='';

  $scope.switchTo = function(newPage)
  {
    console.log("Switching to " + newPage);
    $state.go(newPage);
  };

  // Confirmation message button callback necessary for user to confirm
  // If he wants to sign in with his email because account exists already 
  var confirm_user_exists_by_email = function(buttonIndex)
  {
    // User chose to login
    if (buttonIndex == 1)
    {
      // TODO: get current users or trainers email and switch to login with it in the form
      if (userType == 'Trainer')
      {
        TrainerFactory.set('email', userEmail);
        $state.go('login');
      }
      else if (userType == 'User')
      {
        UserFactory.set('email', userEmail);
        $state.go('login');
      }
    }
      // User ignores and will potentially chose another email
    else
    {
      //Ignore
    }
  };

  // Take action after signup was called
  // If successful, simply switch to main mainMenu
  // Otherwise notify the user about failure
  var postSignupCallback = function(signupResult)
  {
    console.log("Server answered. Login outcome is " + signupResult);
    if (signupResult == "signup_success")
    {
      navigator.notification.alert('Successful sign up. Welcome!', function (){},'Welcome!','Ok');
      console.log("Switching to main menu after successful signup!");

      //Now go to main menu depending as who did we sign up
      if (userType == 'Trainer')
      {
        //Creating the actual object for Trainer before switching to trainer menu
        //Can do it directly without having to access the server since we have all data already. 
        console.log("Creating a Trainer object with all the data received...");

        TrainerFactory.set('name', userActualName);
        TrainerFactory.set('username', userName);
        TrainerFactory.set('email', userEmail);
        TrainerFactory.set('d_o_b', usersBirthday);
        
        $state.go('trainer');
      }
      else if (userType == 'User')
      {
        //Creating the actual object for Trainer before switching to trainer menu
        //Can do it directly without having to access the server since we have all data already.
        console.log("Creating a User object with all the data received...");

        UserFactory.set('name', userActualName);
        UserFactory.set('username', userName);
        UserFactory.set('email', userEmail);
        UserFactory.set('d_o_b', usersBirthday);

        $state.go('trainee');
      }
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
      navigator.notification.alert('Server encountered a bad sign up request, make sure all data is valid.', function (){},'Server Error!','Ok');
    }
    else if(signupResult == "user_exists_byusername")
    {
      navigator.notification.alert('This user name is already taken! Try another user name.', function (){},'Use name taken!','Ok');
    }
    else if(signupResult == "user_exists_byemail")
    {
      navigator.notification.confirm('This email is already taken! Do you want to login with this email?', confirm_user_exists_by_email, 'Email exists!',['Ok,login','Cancel']);
    }
  };

  $scope.signUpProcess = function()
  {
    varList = [];
    var new_users_username = String($scope.user.username);
    varList.push(new_users_username);
    userName = new_users_username;
    var new_users_email = String($scope.user.email);
    varList.push(new_users_email);
    userEmail = new_users_email;
    var new_users_password = String($scope.user.password);
    varList.push(new_users_password);
    var new_users_actualname = String($scope.user.name);
    varList.push(new_users_actualname);
    userActualName = new_users_actualname;
    var new_users_birthday = String($scope.user.birthday);
    varList.push(new_users_birthday);
    usersBirthday = new_users_birthday;
    var selected_acc_type = document.getElementById('acc_type').value;
    userType=selected_acc_type;

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
      if (new_users_email.indexOf('@') <= 0 || new_users_email.indexOf('.com') <= 0 )
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
      SignUpService.send_http_signup(new_users_username,new_users_password,new_users_email,new_users_actualname, new_users_birthday, selected_acc_type,postSignupCallback);
    }
  };
}])

// //~~~~~~~~~~~~~~~~~~~~~~~TABSCONTROLLERs ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.controller('HomeTabCtrl', ['$scope', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state)
{
  console.log("Presently in home tab controller...");

  $scope.switchTo = function(newPage)
  {
    console.log("Switching to " + newPage);
    $state.go(newPage);
  };
}])

.controller('WourkoutsCtrl', ['$scope', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state)
{
  console.log("Presently in workouts tab controller...");

  $scope.switchTo = function(newPage)
  {
    console.log("Switching to " + newPage);
    $state.go(newPage);
  };
}])

.controller('NutritionCtrl', ['$scope', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state)
{
  console.log("Presently in nutrition tab controller...");

  $scope.switchTo = function(newPage)
  {
    console.log("Switching to " + newPage);
    $state.go(newPage);
  };
}])


//~~~~~~~~~~~~~~~~~~~~~~~Trainer Page Controller ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.controller('TrainerCtrl', ['$scope', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state)
{
  console.log("Presently in Trainer controller...");

  $scope.switchTo = function(newPage)
  {
    console.log("Switching to " + newPage);
    $state.go(newPage);
  };
}])

// //~~~~~~~~~~~~~~~~~~~~~~~Trainee Page Controller ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.controller('TraineeCtrl', ['$scope', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state)
{
  console.log("Presently in Trinee controller...");

  $scope.switchTo = function(newPage)
  {
    console.log("Switching to " + newPage);
    $state.go(newPage);
  };
}]);