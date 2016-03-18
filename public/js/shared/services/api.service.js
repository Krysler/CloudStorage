angular.module("diplomka")


  .factory("API", ['$q', '$http','AuthToken', function ($q, $http, AuthToken) {

    var api = {

      Auth: {

        login: function (username, password) {
          return $http.post('/api/login', {
            username: username,
            password:password
          })
            .success(function (data) {
              AuthToken.setToken(data.token);
              return data;
            });
        },

        logout: function () {
          AuthToken.setToken();
        },

        isLoggedIn: function () {
          if(AuthToken.getToken())
            return true;
          else
            return false;
        },

        getUser: function () {
          if(AuthToken.getToken())
            return $http.get('/api/me');
          else
            return $q.reject({message: "User has no token"});
        }
      },

      Users:{

        create: function (userData) {
          return $http.post('/api/signup', userData);
        },

        allUsers: function () {
          return $http.get('/api/users');
        }
      },

      FileSys:{

        readDir: function (dirname) {
          return $http.get('/api/filesystem',{
            headers:{'x-access-token':AuthToken.getToken(),
                     '0':dirname}
          })
        },

        folderTree: function (dirname) {
          return $http.get('/api/folderTree',{
            headers:{'x-access-token':AuthToken.getToken(),
                     '0':dirname}
          })
        }
      }
    };

    return api;

  }])

  .factory('AuthToken', ['$window', function ($window) {

    var token = {

      getToken: function () {
        return $window.localStorage.getItem('token');
      },

      setToken: function (token) {
        if(token)
          return $window.localStorage.setItem('token', token);
        else
          return $window.localStorage.removeItem('token');
      }
    };

    return token;
  }])

  .factory('AuthInterceptor', ['$q', '$location', 'AuthToken', function ($q, $location, AuthToken) {

    var interceptor = {

      request: function (config) {

        var token = AuthToken.getToken();

        if(token){
          config.headers['x-access-token'] = token;
        }

        return config;
      },

      responseError: function (response) {
        if(response.status == 403)
          $location.path('/login');

        return $q.reject(response);
      }
    }
  }]);
