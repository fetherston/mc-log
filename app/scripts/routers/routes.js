"use strict";

angular.module('myApp.routes', ['ngRoute'])

   // configure views; the authRequired parameter is used for specifying pages
   // which should only be available while logged in
   .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/home', {
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'views/partials/home.html',
         controller: 'HomeCtrl'
      });

      $routeProvider.when('/admin', {
         // adminRequired: true, // must be an admin
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'views/partials/admin.html',
         controller: 'AdminCtrl'
      });

      $routeProvider.when('/motorcycles', {
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'views/partials/motorcycles.html',
         controller: 'MotorcylesCtrl'
      });

      $routeProvider.when('/motorcycles/:machineId', {
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'views/partials/motorcycle.html',
         controller: 'MotorcyleCtrl'
      });

      $routeProvider.when('/account', {
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'views/partials/account.html',
         controller: 'AccountCtrl'
      });

      $routeProvider.when('/login', {
         templateUrl: 'views/partials/login.html',
         controller: 'LoginCtrl'
      });

      $routeProvider.otherwise({redirectTo: '/home'});
   }]);