// Don't forget to change the VM ip and port here!
// var virtual_vm_ip="104.236.220.130:9090/kevinnam.me/public_html/";
//var virtual_vm_ip="localhost:8001";
var virtual_vm_ip="104.236.220.130:8001";
var login_URI="/WebServices/login/";
var signup_URI="/WebServices/signup/";
var exercise_URI="/WebServices/exercise/";
var nutrition_URI="/WebServices/nutrition/";
var nutrition_create_URI="/WebServices/nutrition/create";
var password_rec_URI="/WebServices/passwordrecovery/";
var workout_get_URI ="/WebServices/workout/getAll";
var trainee_list_get_URI="/WebServices/social/getMyTrainees";
var trainer_list_get_URI="/WebServices/social/getMyTrainers"; // --> To be user for the trainee to get the trainers
var workout_create_URI = "";
var currentUser={};

angular.module('starter.services', ['starter.controllers'])

//~~~~~~~~~~~~~~~~~~~~~~~ LOGIN SERVICE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Login servicecalled from controller when user provides all valid login functions and HTTP REST issues
.service('LoginService', ['$http', function($http)
{
  // callback is passed when the async registration call is done
  this.http_login_request = function(user_email, user_pswd, callback_to_login)
  {
    //TODO: complete the proper log in url sent towards the server

    var loginUrl = "http://" + virtual_vm_ip + login_URI + user_email + '/' + user_pswd;

    // ~~~ASYNC CODE
    var request = new XMLHttpRequest();
    try
    {
        request.open("GET",loginUrl);
    }
    catch(err)
    {
        callback_to_login("user_notfound",{});
    }
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function() {
      //When request is answered, call back the login controller with result
      // SUCESS USER LOGIN
      if(request.readyState === 4)
      {
        if (request.status == 200)
        {
            // At successful login, pass the object data to the callback
            callback_to_login("login_success_user",request.responseText);
        }
        // SUCESS TRAINER LOGIN
        else if (request.status == 202)
        {
            callback_to_login("login_success_trainer",request.responseText);
        }
        else if (request.status == 404)
        {
            callback_to_login("user_notfound",{});
        }
        else if (request.status == 500 || request.status == 502 || request.status == 503)
        {
            callback_to_login("server_error",{});
        }
        else if (request.status == 400)
        {
            callback_to_login("bad_request",{});
        }
        else if (request.status == 401)
        {
            callback_to_login("bad_password",{});
        }
      }
  };
    request.send();
    // ~~~ASYNC CODE END
  };
}])

//~~~~~~~~~~~~~~~~~~~~~~~ SIGNUP SERVICE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Sign up service called from controller when user provides all valid sign up data
.service('SignUpService',['$http', function($http)
{

  this.send_http_signup = function(user_name, user_pswd, user_email, actual_name, user_birthday, selected_acc_type,callback_to_signup)
  {
    //TODO: complete the proper sign up url sent towards the server
    var signupURL = "http://" + virtual_vm_ip + signup_URI;
    var signup_Data = JSON.stringify({username : user_name, d_o_b: user_birthday, password : user_pswd, name: actual_name, email : user_email, type: selected_acc_type});

      // Issue new http POST request to the Server
      // TODO: dont forget to put the right server registration link.
      var request = new XMLHttpRequest();
      request.open("POST", signupURL);
      request.setRequestHeader("Content-Type", "application/json");
      request.onreadystatechange = function() {
          //When request is answered, handle ASYNC here
          if (request.readyState == 4)
          {
              if (request.status == 201)
              {
                  callback_to_signup("signup_success");
              }
              else if (request.status == 404)
              {
                  callback_to_signup("server_notfound");
              }
              else if (request.status == 500 || request.status == 502 || request.status == 503)
              {
                    callback_to_login("server_error");
              }
              else if (request.status == 400)
              {
                  callback_to_signup("bad_request");
              }
              else if (request.status == 405)
              {
                  callback_to_signup("user_exists_byusername");
              }
              else if (request.status == 306)
              {
                  callback_to_signup("user_exists_byemail");
              }
          }
      };
      request.send(signup_Data);
  };

}])

//~~~~~~~~~~~~~~~~~~~~~~~Exercise SERVICE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exercise service contains all functions related to exercises
.service('ExerciseService',['$http', function($http)
{
    this.get_Exercise = function(callback_to_exercise)
    {
        var exerciseURL = "http://" + virtual_vm_ip + exercise_URI;

          // Issue new http GET request to the Server
          var request = new XMLHttpRequest();
          request.open("GET", exerciseURL);
          request.setRequestHeader("Content-Type", "application/json");
          request.onreadystatechange = function() {
              //When request is answered, handle ASYNC here
              if (request.readyState == 4)
              {
                  if (request.status == 200)
                  {
                      callback_to_exercise("exercises_retrieved", request.responseText);
                  }
                  else if (request.status == 404)
                  {
                      callback_to_exercise("server_notfound", {});
                  }
                  else if (request.status == 500 || request.status == 502 || request.status == 503)
                  {
                        callback_to_exercise("server_error", {});
                  }
                  else if (request.status == 400)
                  {
                      callback_to_exercise("bad_request", {});
                  }
              }
          };
          request.send();
    };

    this.get_Exercise_name = function(exercise_name, callback_to_exercise)
    {
        var exerciseURL = "http://" + virtual_vm_ip + exercise_URI;

          // Issue new http GET request to the Server
          var request = new XMLHttpRequest();
          request.open("GET", exerciseURL);
          request.setRequestHeader("Content-Type", "application/json");
          request.onreadystatechange = function() {
              //When request is answered, handle ASYNC here
              if (request.readyState == 4)
              {
                  if (request.status == 200)
                  {
                      callback_to_exercise("exercises_retrieved", request.responseText);
                  }
                  else if (request.status == 404)
                  {
                      callback_to_exercise("server_notfound", {});
                  }
                  else if (request.status == 500 || request.status == 502 || request.status == 503)
                  {
                        callback_to_exercise("server_error", {});
                  }
                  else if (request.status == 400)
                  {
                      callback_to_exercise("bad_request", {});
                  }
              }
          };
          request.send();
    };
}])

//~~~~~~~~~~~~~~~~~~~~~~~Nutrition SERVICE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Nutrition service contains all functions related to nutrition
.service('NutritionService',['$http', function($http)
{
    this.add_nutrition = function(nutrition, callback) {
      var nutritionURL = "http://" + virtual_vm_ip + nutrition_create_URI;
      var request = new XMLHttpRequest();
      console.log(nutrition);
      request.open("POST", nutritionURL);
      request.setRequestHeader("Content-Type", "application/json");
      request.send(JSON.stringify(nutrition));
      callback();
    };

    this.get_nutrition = function(callback)
    {
        var nutritionURL = "http://" + virtual_vm_ip + nutrition_URI;

          // Issue new http GET request to the Server
          var request = new XMLHttpRequest();
          request.open("GET", nutritionURL);
          request.setRequestHeader("Content-Type", "application/");
          request.onreadystatechange = function() {
              //When request is answered, handle ASYNC here
              if (request.readyState == 4)
              {
                  if (request.status == 200)
                  {
                      callback("retrieved", request.responseText);
                  }
                  else if (request.status == 404)
                  {
                      callback("server_notfound", {});
                  }
                  else if (request.status == 500 || request.status == 502 || request.status == 503)
                  {
                        callback("server_error", {});
                  }
                  else if (request.status == 400)
                  {
                      callback("bad_request", {});
                  }
              }
          };
          request.send();
    };
}])


//~~~~~~~~~~~~~~~~~~~~~~~ PASSWORD RECOVERY SERVICE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Password recovery service issuing request to server
// so that the server sends an email with password to keys
.service('PasswordRecoveryService',['$http', function($http)
{
  this.recover_pswd = function(user_email,callback_to_recovery)
  {
      var signupURL = "http://" + virtual_vm_ip + password_rec_URI;

      var recovery_Data = JSON.stringify({email : user_email});
      // Issue new http POST request to the Server
      var request = new XMLHttpRequest();
      request.open("POST", signupURL);
      request.setRequestHeader("Content-Type", "application/json");

      request.onreadystatechange = function() {
          //When request is answered, handle ASYNC here
          if (request.readyState == 4)
          {
              if (request.status == 200)
              {
                  callback_to_recovery("recovery_request_success");
              }
              else if (request.status == 404)
              {
                  callback_to_recovery("server_notfound");
              }
              else if (request.status == 400)
              {
                  callback_to_recovery("recovery_request_failure");
              }
              else if (request.status == 500 || request.status == 502 || request.status == 503)
              {
                   callback_to_recovery("server_error");
              }
          }
      };
      request.send(recovery_Data);
  };
}])


//~~~~~~~~~~~~~~~~~~~~~~~ Workouts SERVICE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.service('WorkoutsService',['$http', function($http)
{
  //Getter service for workouts
  this.get_workout = function(username,callback_to_workouts)
  {
      var workout_get_url = "http://" + virtual_vm_ip + workout_get_URI + '/' + username;
      // Issue new http POST request to the Server
      var request = new XMLHttpRequest();
      request.open("GET", workout_get_url);
      request.setRequestHeader("Content-Type", "application/json");
      console.log('Issuing get workout to server...');
      request.onreadystatechange = function() {
          //When request is answered, handle ASYNC here
          if (request.readyState == 4)
          {
              if (request.status == 200)
              {
                  callback_to_workouts("workout_get_success", request.responseText);
              }
              else if (request.status == 404)
              {
                  callback_to_workouts("workout_not_found",{});
              }
              else if (request.status == 500 || request.status == 502 || request.status == 503)
              {
                   callback_to_workouts("server_error",{});
              }
          }
      };
      request.send();
  };

  //Setter service for workouts
  this.create_workout = function(username,workout_object,callback_to_workouts)
  {
      var workout_create_url = "http://" + virtual_vm_ip + workout_create_URI + '/' + username;
      // Issue new http POST request to the Server
      var request = new XMLHttpRequest();
      request.open("GET", workout_create_url);
      request.setRequestHeader("Content-Type", "application/json");

      var workout_object_to_send = JSON.stringify(workout_object);

      request.onreadystatechange = function() {
          //When request is answered, handle ASYNC here
          if (request.readyState == 4)
          {
              if (request.status == 200)
              {
                  callback_to_workouts("workout_set_success",{});
              }
              else if (request.status == 405)
              {
                  callback_to_workouts("workout_already_exists",{});
              }
              else if (request.status == 404)
              {
                  callback_to_workouts("server_not_found",{});
              }
              else if (request.status == 500 || request.status == 502 || request.status == 503)
              {
                   callback_to_workouts("server_error",{});
              }
          }
      };
      request.send(workout_object_to_send);
  };
}])

//~~~~~~~~~~~~~~~~~~~~~~~ getMyTraineesService SERVICE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.service('getMyTraineesService',['$http', function($http)
{
  //Getter service for trainer to get all the trainees associated to that particular trainer
  //Returns a list of trainees
  this.getTrainees = function(trainers_username,callback_to_trainer_controller)
  {
    var trainee_getter_URL = "http://" + virtual_vm_ip + trainee_list_get_URI + '/' + trainers_username;

    var request = new XMLHttpRequest();
    request.open("GET", trainee_getter_URL);
    request.setRequestHeader("Content-Type", "application/json");
    
    console.info("Issuing request to get trainees and waiting for server response!");

      request.onreadystatechange = function()
      {
          //When request is answered, handle ASYNC here
          if (request.readyState == 4)
          {
              if (request.status == 200)
              {   
                  //At successful response arrival, extract trainee list here.
                  //Do JSON parsing here instead of actual controller to avoid lag at processing
                  //long lists
                  var trainees_object = JSON.parse(request.responseText);

                  console.info("Server answered, got the trainee object: " + trainees_object);  

                  callback_to_trainer_controller("trainees_success",trainees_object);
              }
              else if (request.status == 404)
              {
                  callback_to_trainer_controller("trainees_not_found",{});
              }
              else if (request.status == 500 || request.status == 502 || request.status == 503)
              {
                   callback_to_trainer_controller("server_error",{});
              }
          }
      };
      request.send();
  };
}])



//~~~~~~~~~~~~~~~~~~~~~~~ USER FACTORY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Represent a user 'object' and all properties associated to user will be recorded here.
// Will keep a "factory" dict that will define the user
.factory('UserFactory', [function(){

    // Object belonging to user. So far the obejct has keys: name, username, email, d_o_b
    // Gets filled at login/sign up
    var userObject = {};


    // return userObject;
    return{   // --> HAVE THE BRACKET ON THE SAME LINE AS return ELSE MINDFUCK
        set : function(key, value)
        {
            console.log("User factory setter called with key: " + key);
            console.log("User factory set an entry: " + key + ',' + value);
            userObject[key] = value;
        },
        get : function(key)
        {
            console.log("User factory getter called with key: " + key);
            console.log("User factory returns: "+ userObject[key]);
            return userObject[key];
        }
    };
}])

.factory('ExerciseFactory', [function(){
    var exerciseObject = {};

    return{
        set : function(key, value)
        {
            exerciseObject[key] = value;
        },
        get : function(key)
        {
            return exerciseObject[key];
        }
    };
}])

.factory('WorkoutsFactory', [function(){

    // Object belonging to trainer. So far the obejct has keys: name, username, email, d_o_b
    // Gets filled at login/sign up
    var workoutsObject = {};

    return{
        set : function(key, value)
        {
            workoutsObject[key] = value;
        },
        get : function(key)
        {
            return workoutsObject[key];
        }
    };
}])

//~~~~~~~~~~~~~~~~~~~~~~~ TRAINER FACTORY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Represent a user 'object' and all properties associated to user will be recorded here.
.factory('TrainerFactory', [function(){

    // Object belonging to trainer. So far the obejct has keys: name, username, email, d_o_b
    // Gets filled at login/sign up
    var trainerObject = {};

    return{
        set : function(key, value)
        {
            trainerObject[key] = value;
        },
        get : function(key)
        {
            return trainerObject[key];
        }
    };

}]);
