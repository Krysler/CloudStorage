angular.module('diplomka')
  .controller('usersCtrl', ['$scope','API', function ($scope, API) {

    API.Users.allUsers()
      .then(function (data) {
        $scope.allUsers = data.data;
      })
  }]);
