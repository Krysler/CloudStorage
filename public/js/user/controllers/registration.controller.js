angular.module('diplomka')
  .controller('RegCtrl', ['$rootScope','$scope', '$location', 'API', function ($rootScope,$scope , $location, API) {

    $scope.regData = {};

    $scope.loggedIn = API.Auth.isLoggedIn();

    $rootScope.$on('$routeChangeStart', function(){
      $scope.loggedIn = API.Auth.isLoggedIn();

      API.Auth.getUser()
        .then(function (data) {
          $scope.user = data.data;
        });
    });

    $scope.doRegister = function () {

      $scope.processing = true;

      $scope.error = '';

      API.Users.create($scope.regData)
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


  }]);
