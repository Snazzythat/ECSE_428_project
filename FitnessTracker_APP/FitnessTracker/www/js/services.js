// Don't forget to change the VM ip and port here!
var virtual_vm_ip="104.236.220.130";

angular.module('starter.services', ['starter.controllers'])

.factory('BlankFactory', [function(){

}])

.service('LoginService', [function(){
  this.http_signup_request = function() {
      /// your code here
  };

}])

// Sign up service called from controller when user provides all valid sign up data
.service('SignUpService',['$http', function($http){

  this.send_http_signup = function(user_name, user_pswd, user_email)
  {
    var signupURL="http://" + virtual_vm_ip; // + "/FitnessTracker/user-signup";
    var jsonObj = {uuid : user_name, upswd : user_pswd, uemail : user_email};

    $http({
            url: signupURL
            , method: 'POST'
            , data: jsonObj
            , header: {'content-type':'application/text',"Access-Control-Request-Method": "GET","Access-Control-Request-Headers": "X-Custom-Header"}
        }).then(function(res)
                {
                  alert('Failure!');
                  var signup_status = res.status;

                  if (signup_status == "404"){
                    navigator.notification.alert('Server is offline!', function (){},'Error','OK');
                  }
                });
  };

}]);
