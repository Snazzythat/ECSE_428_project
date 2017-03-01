angular.module('starter.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('mainmenu', {
    url: '/mainmenu',
    templateUrl: 'templates/mainmenu.html',
    controller: 'mainMenuCtrl'
  })

  .state('user_menu', {
    url: '/user_menu',
    templateUrl: 'templates/User.html',
    controller: 'userMenuController'
  })

  .state('trainer_menu', {
    url: '/trainer_menu',
    templateUrl: 'templates/Trainer.html',
    controller: 'trainerMenuController'
  })

$urlRouterProvider.otherwise('/login')



});
