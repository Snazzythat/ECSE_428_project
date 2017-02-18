// Don't forget to change the VM ip and port here!
var virtual_vm_ip="104.236.220.130:9090/kevinnam.me/public_html/";
//var virtual_vm_ip="google.com/";

angular.module('starter.services', ['starter.controllers'])

// Factory not needed
.factory('BlankFactory', [function(){

}])

//~~~~~~~~~~~~~~~~~~~~~~~LOGIN SERVICE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Login servicecalled from controller when user provides all valid login functions and HTTP REST issues
.service('LoginService', ['$http', function($http)
{
  // callback is passed when the async registration call is done
  this.http_login_request = function(user_email, user_pswd, callback_to_login)
  {
    //TODO: complete the proper log in url sent towards the server
    var loginUrl = "http://" + virtual_vm_ip + "";
    var jsonObj = {uemail : user_email, upswd : user_pswd};

    // ~~~ASYNC CODE
    var request = new XMLHttpRequest();
    request.open("GET",loginUrl, true, user_email, user_pswd);
    request.setRequestHeader("Authorization", "Basic " + btoa(user_email + ':' + user_pswd));
    request.onreadystatechange = function() {
      //When request is answered, call back the login controller with result
      if (request.status == 200)
      {
          callback_to_login("login_success");
      }
      else if (request.status == 404)
      {
          callback_to_login("server_notfound");
      }
      else if (request.status == 500 || request.status == 502 || request.status == 503 )
      {
          callback_to_login("server_error");
      }
    }
    request.send();
    // ~~~ASYNC CODE END
  };
}])

//~~~~~~~~~~~~~~~~~~~~~~~LOGIN SERVICE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Sign up service called from controller when user provides all valid sign up data
.service('SignUpService',['$http', function($http)
{

  this.send_http_signup = function(user_name, user_pswd, user_email, callback_to_signup)
  {
    //TODO: complete the proper sign up url sent towards the server
    var signupURL = "http//" + virtual_vm_ip + ""; // + "/FitnessTracker/user-signup";
    var jsonObj = {uuid : user_name, upswd : user_pswd, uemail : user_email};

      // Issue new http POST request to the Server
      // TODO: dont forget to put the right server registration link.
      var request = new XMLHttpRequest();
      request.open("GET", "http://www.google.com", true);
      request.onreadystatechange = function() {
          //When request is answered, handle ASYNC here
          if (request.readyState == 4)
          {
              if (request.status == 200)
              {
                  callback_to_signup("signup_success");
              }
              else if (request.status == 404)
              {
                  callback_to_signup("server_notfound");
              }
          }
      }
      request.send();
  };

}]);
