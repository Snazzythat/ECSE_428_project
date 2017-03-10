// Don't forget to change the VM ip and port here!
// var virtual_vm_ip="104.236.220.130:9090/kevinnam.me/public_html/";
var virtual_vm_ip="104.236.220.130:8001";
var login_URI="/WebServices/login/"
var signup_URI="/WebServices/signup/"
var password_rec_URI="/WebServices/passwordrecovery/"
var currentUser={}

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
    }
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
      }
      request.send(signup_Data);
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
      }
      request.send(recovery_Data);
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
            userObject[key] = value;
        },
        get : function(key)
        {
            return userObject[key];
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
