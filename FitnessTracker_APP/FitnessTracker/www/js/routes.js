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

// User Tabs Routes
  .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/Home-Tab.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.workouts', {
      url: "/workouts",
      views: {
        'workouts-tab': {
          templateUrl: "templates/Workouts-Tab.html",
          controller: 'WourkoutsCtrl'
        }
      }
    })
    .state('tabs.nutrition', {
      url: "/nutrition",
      views: {
        'nutrition-tab': {
          templateUrl: "templates/Nutrition-Tab.html",
          controller: 'NutritionCtrl'
        }
      }
    })
    // .state('tabs.about', {
    //   url: "/about",
    //   views: {
    //     'about-tab': {
    //       templateUrl: "templates/about.html"
    //     }
    //   }
    // })
    // .state('tabs.navstack', {
    //   url: "/navstack",
    //   views: {
    //     'about-tab': {
    //       templateUrl: "templates/nav-stack.html"
    //     }
    //   }
    // })
    // .state('tabs.contact', {
    //   url: "/contact",
    //   views: {
    //     'contact-tab': {
    //       templateUrl: "templates/contact.html"
    //     }
    //   }
    // })
$urlRouterProvider.otherwise('/login');
});
