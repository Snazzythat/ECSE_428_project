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
      console.log("Data from successfull user login received from server: " + loginData);

      console.log("Creating a User object with all the data received...");

      var parsed_data = JSON.parse(loginData);

      //Unlike sign up, we have to request data at successful login.
      UserFactory.set('name', parsed_data.name);
      UserFactory.set('username', parsed_data.username);
      UserFactory.set('email', parsed_data.email);
      UserFactory.set('d_o_b', parsed_data.d_o_b);
      UserFactory.set('trainer_list', null); //For the pusposes of reaccess

      console.log("Switching to main menu after successful USER login!");

      $state.go('trainee'); //Default tabs for now
    }
    //TODO: be able to login onto trainer menu
    else if (loginResult == "login_success_trainer")
    {
      console.log("Data from successfull trainer login received from server: " + loginData);

      console.log("Creating a Trainer object with all the data received...");

      var parsed_data = JSON.parse(loginData);

      //Unlike sign up, we have to request data at successful login.
      TrainerFactory.set('name', parsed_data.name);
      TrainerFactory.set('username', parsed_data.username);
      TrainerFactory.set('email', parsed_data.email);
      TrainerFactory.set('d_o_b', parsed_data.d_o_b);
      TrainerFactory.set('trainee_list', null); //For the purposes of reaccess

      console.log("Switching to main menu after successful TRAINER login!");

      $state.go('trainer'); //Default tabs for now
    }
    else if(loginResult == "user_notfound")
    {
      console.error("User not found!");
      navigator.notification.alert('Incorrect user name or password. Make sure you signed up.', function (){},'Error','Ok');
    }
    else if(loginResult == "server_error")
    {
      console.error("Server error!");
      navigator.notification.alert('Server error. Please contact the support.', function (){},'Error','Ok');
    }
    else if(loginResult == "server_notfound")
    {
      console.error("Server not found!");
      navigator.notification.alert('Server is offline. Please try again later.', function (){},'Error','Ok');
    }
    else if(loginResult == "bad_request")
    {
      console.error("Bad signup request");
      navigator.notification.alert('Server encountered a bad login request, make sure all data is valid.', function (){},'Error','Ok');
    }
    else if(loginResult == "bad_password")
    {
      console.error("Bad password!");
      navigator.notification.alert('User name exists, but wrong password!', function (){},'Wrong Password','Try again');
    }
  };

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

  // Password recovery feature.
  // Contacts web server with email or username.
  // WS needs to send an email with password recovery.
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

//~~~~~~~~~~~~~~~~~~~~~~~ Trainer Page Controller ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.controller('TrainerCtrl', ['$scope', '$state','TrainerFactory','getMyTraineesService', 'WorkoutsService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state,TrainerFactory,getMyTraineesService, WorkoutsService)
{

  console.log("Presently in Trainer controller...");


  // ~~~~~~~~~~~~~~~~~~~~~~~~~ Getting trainee list dynamically here.
  // TODO: Service allowing to return the list of traineees belonging to trainer.
  var traineeGetterCallback = function(traineeGetResult, traineesObj)
  {
    console.log("Server answered. Trainee list getting  outcome is " + traineeGetResult);

    var parsedList=[]

    if (traineeGetResult == "trainees_success")
    {

      console.info("Got the trainee object: " + traineesObj);

      var trainees_object = JSON.parse(traineesObj);

      if (trainees_object != {})
      {
          for(var key in trainees_object)
          {
            if (key != "trainer_username" && trainees_object[key] != null)
            {
              parsedList.push(trainees_object[key]); //Pushes all
            }
          }
      }
      else
      {
        console.info('Looks like this trainer does not have any trainees in database..');
        parsedList.push('You did not assign any trainees yet!');
      }
    }
    else if (traineeGetResult == "trainees_not_found")
    {
      console.info('Looks like this trainer does not have any trainees in database..');
      parsedList.push('You did not assign any trainees yet!');
    }

      TrainerFactory.set('trainee_list', parsedList);

      $scope.visible_trainee_list = parsedList;
      $scope.$apply()
  }


  //***Logic to get trainees
  //This happens only once at login. Once we get the list once after the login and set it in the factory, the list will be accessable directly
  if (TrainerFactory.get('trainee_list') == null)
  {
    console.info("Trainees list is null! Getting trainee list now!");
    getMyTraineesService.getTrainees(TrainerFactory.get('username'), traineeGetterCallback);
  }
  else
  {
    // After above has been run once, this list must be always accessable till the logout.
    console.info("Trainee list already exists, all good!");
    $scope.visible_trainee_list = TrainerFactory.get('trainee_list');
  }

  var workoutAssignCallback = function(result){
    if(result == "workout_assign_success")
    {
      navigator.notification.alert('Workout successfully assigned.', function (){},'Success!','Ok');
    }
    else if(result == "workout_already_exists")
    {
      navigator.notification.alert('Workout already assigned to trainee.', function (){},'Error!','Ok');
    }
    else if(result == "server_error")
    {
      navigator.notification.alert('Server error, try again later.', function (){},'Error!','Ok');
    }
  }

  var getWorkoutsCallback = function(result, data){
    $scope.workoutList = JSON.parse(data);
    for(var i = $scope.workoutList.length-1; i >= 0; i--){
      var id = $scope.workoutList[i].workoutId;
      for(var j = 0; j < $scope.workoutList.length; j++){
        if($scope.workoutList[i].workoutId == $scope.workoutList[j].workoutId && i != j){
          $scope.workoutList.splice(i, 1);
          break;
        }
      }
    }
  }

  WorkoutsService.get_workout(TrainerFactory.get('username'), getWorkoutsCallback);

  $scope.assign = function(trainee, workoutId){
    WorkoutsService.assign_workout(TrainerFactory.get('username'), trainee, workoutId, workoutAssignCallback);
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~

  $scope.visible_user_name = TrainerFactory.get('name');

  $scope.switchTo = function(newPage)
  {
    console.log("Switching to " + newPage);
    $state.go(newPage);
  };
}])

// //~~~~~~~~~~~~~~~~~~~~~~~ Trainee Page Controller ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.controller('TraineeCtrl', ['$scope', '$state','$ionicSideMenuDelegate','UserFactory', 'getMyTrainersService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state,$ionicSideMenuDelegate,UserFactory,getMyTrainersService)
{
  console.log("Presently in Trainee controller...");

  $scope.visible_user_name = UserFactory.get('name');
  $scope.shouldShowDelete = true;
  $scope.listCanSwipe = true
  $scope.switchTo = function(newPage)
  {
    console.log("Switching to " + newPage);
    $state.go(newPage);
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~ Getting trainers belonging to currently logged in trainee list dynamically here.
  // TODO: Service allowing to return the list of trainers linked to this trainee.
  var trainerGetterCallback = function(trainerGetResult, trainersObj)
  {
    console.log("Server answered. Trainer list getting  outcome is " + trainerGetResult);

    var parsedList=[]

    if (trainerGetResult == "trainers_success")
    {

      console.info("Got the trainer object: " + trainersObj);

      var trainers_object = JSON.parse(trainersObj);

      if (trainers_object != {})
      {
          for(var key in trainers_object)
          {
            if (key != "trainee_username" && trainers_object[key] != null)
            {
              parsedList.push(trainers_object[key]); //Pushes all
            }
          }
      }
      else
      {
        console.info('Looks like this trainee does not have any trainers in database..');
        parsedList.push('You have not been assigned to any trainer yet!');
      }
    }
    else if (trainerGetResult == "trainers_not_found")
    {
      console.info('Looks like this trainer does not have any trainees in database..');
      parsedList.push('You did not assign any trainees yet!');
    }

      UserFactory.set('trainer_list', parsedList);

      $scope.visible_trainer_list = parsedList;
      $scope.$apply()
  }


  //***Logic to get trainers from server
  //This happens only once at login. Once we get the list once after the login and set it in the factory, the list will be accessable directly
  if (UserFactory.get('trainer_list') == null)
  {
    console.info("Trainees list is null! Getting trainee list now!");
    getMyTrainersService.getTrainees(UserFactory.get('username'), trainerGetterCallback);
  }
  else
  {
    // After above has been run once, this list must be always accessable till the logout.
    console.info("Trainer list already exists, all good!");
    $scope.visible_trainer_list = UserFactory.get('trainer_list');
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  $scope.toggleSideMenu = function()
  {
    console.log("Toggling");
    $ionicSideMenuDelegate.toggleLeft();
  };

}])


//~~~~~~~~~~~~~~~~~~~~~~~ Password Recovery Page Controller ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.controller('PasswordRecCtrl', ['$scope', '$state','PasswordRecoveryService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, PasswordRecoveryService)
{
  console.log("Presently in Password Recovery controller...");

  $scope.user = {};

  var recovery_callback = function(recovery_result)
  {
    console.log("Server answered. Server recovery outcome is " + recovery_result);

    if (recovery_result == "recovery_request_success")
    {
      navigator.notification.alert('The email containing your password has been sent', function (){},'Success','Ok');
    }
    else if(recovery_result == "recovery_request_failure")
    {
      navigator.notification.alert('You were not registered. Please register first.', function (){},'Email not found!','OK');
    }
    else if(recovery_result == "server_notfound")
    {
      navigator.notification.alert('Server is offline, try again later.', function (){},'Server offline.','Ok');
    }
    else if(recovery_result == "server_error")
    {
      navigator.notification.alert('Error occured on the server. Contact support. ', function (){},'Server error!','Ok');
    }
  };

  $scope.switchTo = function(newPage)
  {
    console.log("Switching to " + newPage);
    $state.go(newPage);
  };

  $scope.getMyPassword = function()
  {
    var recovery_email = String($scope.user.email);

    // Call asynchronous HTTP call to WS to make it send an email to us with out password
    // If we dont exist in the database, error will be returned.
    PasswordRecoveryService.recover_pswd(recovery_email,recovery_callback);
  };

}])


//~~~~~~~~~~~~~~~~~~~~~~~ Nutrition Plan Page Controller ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.controller('NutritionPlanCtrl', ['$scope', '$state', 'NutritionService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, NutritionService)
{
    console.log("Presently in NutritionPlan controller...");

    $scope.switchTo = function(newPage)
    {
      console.log("Switching to " + newPage);
      $state.go(newPage);
    };

    $scope.onHold = function(n) {
      $scope.nutrition_list.splice($scope.nutrition_list.indexOf(n), 1);
    }

    var nutritionCallback = function(result, data) {
      var nutrition_data = JSON.parse(data);
      $scope.nutrition_list = nutrition_data
      console.log(nutrition_data);
    }

     $scope.editNutrition = function() {
      console.log("click");
    }

    NutritionService.get_nutrition(nutritionCallback);

    $scope.addNutritionProcess = function()
    {
      var valid_parameters = true;

      var varList = [];
      var name = String($scope.nutrition.name);
      var protein = String($scope.nutrition.protein);
      var fat = String($scope.nutrition.fat);
      var calories = String($scope.nutrition.calories);
      var carbohydrate = String($scope.nutrition.carbohydrate);
      varList.push(name);
      varList.push(protein);
      varList.push(fat);
      varList.push(calories);
      varList.push(carbohydrate);

      var nutrition = {name : name, protein : protein, fat : fat, calories : calories, carbohydrate : carbohydrate};

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
        valid_parameters = false;
      }

      if (isNaN(protein)) {
        console.error("Input error!");
        //navigator objects WILL NOT work in the ionic testing webserver, native device ONLY
        navigator.notification.alert('Protein must be a number', function (){},'Error','Retry');
        navigator.notification.vibrate(1000);
        valid_parameters = false;
      }

      if (isNaN(carbohydrate)) {
        console.error("Input error!");
        //navigator objects WILL NOT work in the ionic testing webserver, native device ONLY
        navigator.notification.alert('Carbohydrate must be a number', function (){},'Error','Retry');
        navigator.notification.vibrate(1000);
        valid_parameters = false;
      }

      if (isNaN(fat)) {
        console.error("Input error!");
        //navigator objects WILL NOT work in the ionic testing webserver, native device ONLY
        navigator.notification.alert('Fat must be a number', function (){},'Error','Retry');
        navigator.notification.vibrate(1000);
        valid_parameters = false;
      }

      if (isNaN(calories)) {
        console.error("Input error!");
        //navigator objects WILL NOT work in the ionic testing webserver, native device ONLY
        navigator.notification.alert('Calories must be a number', function (){},'Error','Retry');
        navigator.notification.vibrate(1000);
        valid_parameters = false;
      }


      // Proceed building login request only at when all parameters are valid
      if(valid_parameters)
      {
        console.log("Sending async signup request...");
        NutritionService.add_nutrition(nutrition, function() {
          $state.go('nutritionplan');
        });
      }
    }
}])
//~~~~~~~~~~~~~~~~~~~~~~~ Make A Request Page Controller ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.controller('RequestCtrl', ['$scope', '$state', 'RequestService', 'UserFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, RequestService, UserFactory)
{
    console.log("Presently in Request controller...");

    // TODO: how do we get the username of the current user?
    var userName = UserFactory.get('username');
    console.log("Got user" + userName);

    $scope.switchTo = function(newPage)
    {
      console.log("Switching to " + newPage);
      $state.go(newPage);
    };

    /*var requestCallback = function(result, data) {
      var request_data = JSON.parse(data);
      $scope.request_list_for_a_trainer = request_data
      console.log(request_data);
    }
    */
    //RequestService.get_request_for_a_trainer(userName, requestCallback);

    $scope.make_a_request_to_a_trainer = function()
    {
      var valid_parameters = true;

      var trainer_username = String($scope.request.trainer_username);

      var trainer_request = {trainer_username : trainer_username, trainee_username : userName, status : 'PENDING'};

      // Verify first if no fields are empty
      // Name must not be empty
      // Email must not be empty and must consist of a certain format
      // Password cant be empty
      if (!trainer_username)
      {
        console.error("Input error!");
        //navigator objects WILL NOT work in the ionic testing webserver, native device ONLY
        navigator.notification.alert('Trainer username cannot be empty', function (){},'Error','Retry');
        navigator.notification.vibrate(1000);
        valid_parameters = false;
      }

      // Proceed building login request only at when all parameters are valid
      if(valid_parameters)
      {
        console.log("Sending async create request...");
        RequestService.create_request(trainer_request, function(response) {

          if (response == 'request_success')
          {
            navigator.notification.alert('Successfully sent a request to ' + trainer_username + '.', function (){
            },'Success!','Ok');
            $state.go('trainee');
          }
          else if (response == 'request_already_made')
          {
            navigator.notification.alert('You already sent a request to ' + trainer_username + '.', function (){
            },'Error!','Ok');
          }
        });
      }
    }
}])


//~~~~~~~~~~~~~~~~~~~~~~~ Get A Request Page Controller ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.controller('RequestGetCtrl', ['$scope', '$state', 'RequestService', 'TrainerFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, RequestService, TrainerFactory)
{
    console.log("Presently in Request controller...");

    // TODO: how do we get the username of the current user?
    var userName = TrainerFactory.get('username');
    console.log("Got trainer" + userName);
    
    trainees_that_requested = []
    
    $scope.switchTo = function(newPage)
    {
      console.log("Switching to " + newPage);
      $state.go(newPage);
    };

    var callbackToRequestGetter = function(trainerGetResult, requestsObj)
    {
      if (trainerGetResult == "retrieved")
      {
        console.info("Got the requests from trainees object: " + requestsObj);
        var requests_obj = JSON.parse(requestsObj)[0];
        console.info("Parsed object: " + requests_obj);

        if (requests_obj != {})
        {
            for(var key in requests_obj)
            {
              if (key != "trainer_username" && requests_obj[key] != null && key!= "status")
              {
                trainees_that_requested.push(requests_obj[key]); //Pushes all
                $scope.visible_requests=trainees_that_requested;
                $scope.$apply();
              }
            }
        }
        else
        {
          trainees_that_requested.push('You dont have any trainee requests yet!');
          $scope.visible_requests=trainees_that_requested;
          $scope.$apply();
        }

      }
      else if (trainerGetResult ==  "server_notfound")   
      {
        trainees_that_requested.push('You dont have any trainee requests yet!');
        scope.visible_requests=trainees_that_requested;
        $scope.$apply();
      }
      else if (trainerGetResult ==  "server_error")   
      {
        trainees_that_requested.push('You dont have any trainee requests yet!');
        $scope.visible_requests=trainees_that_requested;
        $scope.$apply();
      }
       else if (trainerGetResult ==  "bad_request")   
      {
        trainees_that_requested.push('You dont have any trainee requests yet!');
        $scope.visible_requests=trainees_that_requested;
        $scope.$apply();
      }
    }

    RequestService.get_request_for_a_trainer(userName,callbackToRequestGetter);

  $scope.onItemDelete = function (item) {
  $scope.items.splice($scope.items.indexOf(item), 1);
  };

  $scope.onItemAccept = function (item) {
      $scope.items.splice($scope.items.indexOf(item), 1);
  };
  
}])

//~~~~~~~~~~~~~~~~~~~~~~~ Workout Page Controller ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.controller('WorkoutCtrl', ['$scope', '$state', '$ionicHistory', 'WorkoutFactory', 'WorkoutsService',
function ($scope, $state, WorkoutFactory)
{
  console.log("Presently in Workout controller...");

  $scope.visible_workout = WorkoutFacotry.get('name');

  $scope.switchTo = function(newPage)
  {
    console.log("Switching to " + newPage);
    $state.go(newPage);
  };
}])

//~~~~~~~~~~~~~~~~~~~~~~~ Exercise Lookup Page Controller ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.controller('ExerciseLookupCtrl', ['$scope', '$state', '$ionicHistory', 'ExerciseFactory', 'ExerciseService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $ionicViewService, ExerciseFactory, ExerciseService)
{
    $scope.filterExerciseList = function()
    {
      var exercises = angular.copy(ExerciseFactory.get('exerciselist'));
      var toDelete = [];
      if($scope.typeFilter && $scope.typeFilter != ""){
        for(var i = exercises.length-1; i >= 0; i--){
          if(exercises[i].type != $scope.typeFilter){
            exercises.splice(i,1);
          }
        }
      }
      if($scope.muscleFilter && $scope.muscleFilter != ""){
        for(var i = exercises.length-1; i >= 0; i--){
          if(exercises[i].targeted_muscle != $scope.muscleFilter){
            exercises.splice(i,1);
          }
        }
      }
      $scope.exercise_list = angular.copy(exercises);
    }
    console.log("Presently in ExerciseLookup controller...");

    var exerciseCallback = function(exerciseResult, exerciseData)
    {
      console.log("Server answered. ExerciseLookup outcome is: " + exerciseResult);
      if (exerciseResult == "exercises_retrieved")
      {
        var exercise_data = JSON.parse(exerciseData);

        console.log("Displaying Exercises! Data received is: " + exercise_data);

        ExerciseFactory.set('exerciselist', exercise_data);

        $scope.exercise_list = ExerciseFactory.get('exerciselist');

        //console.log("Switching to exercise lookup page.");


        //$state.go('exerciselookup');
      }
      else if(exerciseResult == "server_error")

      {
        console.error("Server error!");
        navigator.notification.alert('Server error. Please contact the support.', function (){},'Error','Ok');
      }
      else if(exerciseResult == "server_notfound")
      {
        console.error("Server not found!");
        navigator.notification.alert('Server is offline. Please try again later.', function (){},'Error','Ok');
      }
      else if(exerciseResult == "bad_request")
      {
        console.error("Bad exercise lookup request");
        navigator.notification.alert('Server encountered a bad exercise lookup request, make sure all data is valid.', function (){},'Error','Ok');
      }

  };
    ExerciseService.get_Exercise(exerciseCallback);
}])


//~~~~~~~~~~~~~~~~~~~~~~~ Workouts Page Controller ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.controller('WorkoutsController', ['$scope', '$state','WorkoutsService','WorkoutsFactory', 'UserFactory', 'TrainerFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function($scope, $state, WorkoutsService, WorkoutsFactory, UserFactory, TrainerFactory)
{
    console.log("Presently in Workouts controller...");

    $scope.userType = 'trainee';
    var userName = UserFactory.get('username');
    if(!userName){
      $scope.userType = 'trainer';
      userName = TrainerFactory.get('username');
    }

    console.log("Got user" + userName);

    $scope.shouldShowDelete = true;
    $scope.listCanSwipe = true
    $scope.switchTo = function(newPage)
    {
        console.log("Switching to " + newPage);
        $state.go(newPage);
    };

    var addTo = function(item, array){
      var found = false;
      for(var i in array){
        if(array[i].workoutId == item.workoutId){
          array[i].exercises.push({
            name: item.exerciseName
          })
          found = true;
          break;
        }
      }
      if(!found){
      array.push({
          workoutId: item.workoutId,
          exercises: [{name: item.exerciseName}]
        })
       }
    };


    var workout_callback = function(workout_result, workout_data)
    {
      console.log("Server answered. Server workout request outcome is " + workout_result);

      if(workout_result == "workout_get_success")
      {
        var workouts = JSON.parse(workout_data);
        console.log("Server answered. Server workout object received: " + workout_data);
        var parsed_data = []
        var indexes = []
        for(var i in workouts){
          addTo(workouts[i], parsed_data)
        }
        WorkoutsFactory.set('workout_list', parsed_data);
        $scope.visible_workout = parsed_data;
        $scope.$apply()
      }
      else if(workout_result == "workout_not_found")
      {
        console.log("Could not find workout with username: " + user_name);
        navigator.notification.alert('No workouts found.', function (){},'Error','Ok');
      }
      else if(workout_result == "server_error")
      {
        console.log("Could not connect to server.");
        navigator.notification.alert("Could not conect to server.", function(){}, 'Error','Ok');
      }
    };

    WorkoutsService.get_workout(userName, workout_callback);

    var workoutAssignCallback = function(result){
    if(result == "workout_assign_success")
    {
      navigator.notification.alert('Workout successfully assigned.', function (){},'Success!','Ok');
    }
    else if(result == "workout_already_exists")
    {
      navigator.notification.alert('Workout already assigned to trainee.', function (){},'Error!','Ok');
    }
    else if(result == "server_error")
    {
      navigator.notification.alert('Server error, try again later.', function (){},'Error!','Ok');
    }
  }

  if($scope.userType == 'trainer'){
    $scope.traineeList = TrainerFactory.get('trainee_list');
  }

  $scope.assign = function(trainee, workoutId){
    WorkoutsService.assign_workout(TrainerFactory.get('username'), trainee, workoutId, workoutAssignCallback);
  }

    /*
    $scope.showEditItem = function (item) {

        // Remember edit item to change it later
        $scope.tmpEditItem = item;

        // Preset form values
        $scope.form.description.$setViewValue(item.description);
        $scope.form.useAsDefault.$setViewValue(item.useAsDefault);
        // Open dialog
        $scope.showAddChangeDialog('change');
    };

    $scope.edit= function (workout) {
        var item = {};
        item.description = workout.description.$modelValue;
        item.useAsDefault = workout.useAsDefault.$modelValue;
        var editIndex = ListFactory.getList().indexOf($scope.tmpEditItem);
        $scope.list[editIndex] = item;
        // Set first item to default
        if ($scope.tmpEditItem.useAsDefault == true && item.useAsDefault == false) {
            $scope.list[0].useAsDefault = true;
        }
        ListFactory.setList($scope.list);
        if (item.useAsDefault) {
            $scope.makeDefault(item);
        }
        $scope.leaveAddChangeDialog();
    }
    */
}]);
