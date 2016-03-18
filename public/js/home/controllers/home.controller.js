angular.module('diplomka')
  .controller('HomeCtrl', ['$rootScope','$scope', '$location', 'API', function ($rootScope, $scope, $location, API) {

    $scope.loginData = {};
    $scope.mainFolderTree = '';
    $scope.folderPath = '';

    $scope.loggedIn = API.Auth.isLoggedIn();

    $rootScope.$on('$routeChangeStart', function(){
      $scope.loggedIn = API.Auth.isLoggedIn();

      API.Auth.getUser()
        .then(function (data) {
          $scope.user = data.data;
        });
    });

    $scope.doLogout = function () {
      API.Auth.logout();
      $location.path('/logout');
    };

    $scope.files = function(dirname, main) {
      if(!main){
        $scope.folderPath=$scope.folderPath+'/'+dirname;
      }else{
        $scope.folderPath = dirname;
      }
      API.FileSys.readDir($scope.folderPath)
        .then(function (files) {
          $scope.filesTree = [];
          $scope.subFolders = [];
          _.each(files.data.files, function (path) {
            var b = path.split($scope.folderPath+'/');
              $scope.filesTree.push(b[b.length-1]);
          });

          _.each(files.data.dirs, function (path) {
            var b = path.split($scope.folderPath+'/');
              $scope.subFolders.push(b[b.length-1]);
          });
        })
    };

    function folders(dirname) {
      API.FileSys.folderTree(dirname)
        .then(function (folders) {
          $scope.mainFolderTree = folders.data;
        })
    }

    folders('');


  }]);
