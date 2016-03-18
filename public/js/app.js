angular.module('diplomka', ['ui.router', 'ngMaterial']).
config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/login");
  $stateProvider.
    state('login', {
      url: '/login',
      templateUrl: 'js/home/views/login.tpl.html',
      controller: ''
    })
    .state('/', {
      url: '/',
      templateUrl: 'js/home/views/home.html',
      controller: 'HomeCtrl'
    })
    .state('registration', {
      url: '/registration',
      templateUrl: 'js/home/views/registration.tpl.html',
      controller: 'RegCtrl'
    });
});