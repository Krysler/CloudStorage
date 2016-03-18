angular.module('diplomka')
  .controller('LoginCtrl', ['$rootScope','$scope', '$location', 'API', function ($rootScope,$scope , $location, API) {

    $scope.loginData = {};

    $scope.loggedIn = API.Auth.isLoggedIn();

    $rootScope.$on('$routeChangeStart', function(){
      $scope.loggedIn = API.Auth.isLoggedIn();

      API.Auth.getUser()
        .then(function (data) {
          $scope.user = data.data;
        });
    });

    $scope.doLogin = function () {

      $scope.processing = true;

      $scope.error = '';

      API.Auth.login($scope.loginData.username, $scope.loginData.password)
        .success(function (data) {
          $scope.processing = false;

          API.Auth.getUser()
            .then(function (data) {
              $scope.user = data.data;
            });

          if(data.success)
            $location.path('/');
          else
            $scope.error = data.message;
        });

    };

    $scope.doLogout = function () {
      API.Auth.logout();
      $location.path('/logout');
    }



  }]);
