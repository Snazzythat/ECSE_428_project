// Don't forget to change the VM ip and port here!
var virtual_vm_ip="104.236.220.130:9090/kevinnam.me/public_html/";
//var virtual_vm_ip="google.com/";

angular.module('starter.services', ['starter.controllers'])

.factory('BlankFactory', [function(){

}])

.service('LoginService', ['$http', function($http)
{
  this.http_signup_request = function(user_email, user_pswd)
  {
    //TODO: complete the proper log in url sent towards the server
    var loginUrl = "https://" + virtual_vm_ip + "";
    var jsonObj = {uemail : user_email, upswd : user_pswd};
    var request = new XMLHttpRequest();
    request.open("GET",loginUrl, true, user_email, user_pswd);
    request.setRequestHeader("Authorization", "Basic " + btoa(user_email + ':' + user_pswd));
    request.onreadystatechange = function() {
      //When request is answered, handle ASYNC here
      if (request.status == 200 || request.status == 0)
      {
          //navigator.notification.alert('Successful login!', function (){},'Success','Ok');
          //Switch to main meny @ successful login
          return true;
      }
      else
      {
          //navigator.notification.alert('Server is offline! Try again later', function (){},'Error','Ok');
          return false;
      }
    }
    request.send();
  };
}])

// Sign up service called from controller when user provides all valid sign up data
.service('SignUpService',['$http', function($http)
{

  this.send_http_signup = function(user_name, user_pswd, user_email)
  {
    //TODO: complete the proper sign up url sent towards the server
    var signupURL = "https://" + virtual_vm_ip + ""; // + "/FitnessTracker/user-signup";
    var jsonObj = {uuid : user_name, upswd : user_pswd, uemail : user_email};

      // Issue new http POST request to the Server
      // TODO: dont forget to put the right server registration link.
      var request = new XMLHttpRequest();
      request.open("GET", "http://www.google.com", true);
      request.onreadystatechange = function() {
          //When request is answered, handle ASYNC here
          if (request.readyState == 4) {
              if (request.status == 200 || request.status == 0)
              {
                  navigator.notification.alert('Successful registration!', function (){},'Success','Ok');
                  //Switch to main meny @ successful signup
              }
              else if (request.status == 404)
              {
                  navigator.notification.alert('Server is offline! Try again later', function (){},'Error','Ok');
              }
          }
      }
      request.send();
  };

}]);
