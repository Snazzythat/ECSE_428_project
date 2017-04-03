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

// Additional Pages
  .state('trainee', {
      url: '/trainee',
      templateUrl: 'templates/TraineePage.html',
      controller: 'TraineeCtrl'
  })

 .state('trainer-info', {
      url: '/trainer-info',
      templateUrl: 'templates/trainer-info.html',
      controller: 'TraineeCtrl'
 })

 .state('trainee-requests', {
     url: '/trainee-requests',
     templateUrl: 'templates/trainee-requests.html',
     controller: 'RequestGetCtrl'
 })

  .state('trainer', {
      url: '/trainer',
      templateUrl: 'templates/TrainerPage.html',
      controller: 'TrainerCtrl'
  })

  .state('passwordrecovery', {
      url: '/passwordrecovery',
      templateUrl: 'templates/PasswordRec.html',
      controller: 'PasswordRecCtrl'
  })

  .state('nutritionplan', {
      url: '/nutritionplan',
      templateUrl: 'templates/nutritionplan.html',
      controller: 'NutritionPlanCtrl'
  })

  .state('nutritionplan-create', {
      url: '/nutritionplan/add',
      templateUrl: 'templates/nutritionplan-create.html',
      controller: 'NutritionPlanCtrl'
  })

  .state('exerciselookup', {
      url: '/exerciselookup',
      templateUrl: 'templates/ExerciseLookup.html',
      controller: 'ExerciseLookupCtrl'
  })

 .state('workouts', {
      url: '/workouts',
      templateUrl: 'templates/Workouts.html',
      controller: 'WorkoutsController'
  })

 .state('workouts-edit', {
     url: '/workouts/edit',
     templateUrl: 'templates/Workouts-edit.html',
     controller: 'WorkoutsController'
 })

 .state('request-create', {
     url: '/request/create',
     templateUrl: 'templates/trainer-request-create.html',
     controller: 'RequestCtrl'
 })

  $urlRouterProvider.otherwise('/login');
});
