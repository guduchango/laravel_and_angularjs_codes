
app.config(['$routeProvider',function($routeProvider){
    $routeProvider.
    when('/',{controller:'mainController', templateUrl:'templates/main.html'}).
    when('/users',{controller:'userController',templateUrl:'templates/user.html'}).
    when('/comments',{controller:'commentController', templateUrl:'templates/comment.html'}).
    when('/tags',{controller:'tagController', templateUrl:'templates/tag.html'}).
    when('/login',{controller:'loginController', templateUrl:'templates/login.html'}).
    when('/logout',{controller:'logoutController', templateUrl:'templates/logout.html'}).
    when('/new',{controller:'newUserController', templateUrl:'templates/newuser.html'}).
    otherwise({redirectTo:'/'});
}]);

    app.controller('mainController',function ($scope,$http) {
        $scope.posts = [];
        $scope.$on('$viewContentLoaded', function(){
            $http.get("/laravel_and_angularjs_codes/blog/public/posts/last/3").then(function(response){
                $scope.posts = response.data;
            },function(response){
                notifyError(response);
            });
        });
    });

    app.controller('menuController',function ($scope,$http,$rootScope) {
        $scope.tags = [];
        $scope.comments = [];
        $http.get("menuinfo").then(function(response){
            //console.log(response);
            $scope.tags = response.data[0];
            $scope.comments = response.data[1];
            $rootScope.authuser = response.data[2];
        },function(response){
            notifyError(response);
        });
    });

    app.controller('userController',function ($scope,$http) {
        $scope.users = [];
        $scope.$on('$viewContentLoaded', function(){
            $http.get("/laravel_and_angularjs_codes/blog/public/users/posts").then(function(response){
                $scope.users = response.data;
            },function(response){
                notifyError(response);
            });
        });
    });

    app.controller('commentController',function ($scope,$http) {
        $scope.comments = [];
        $scope.$on('$viewContentLoaded', function(){
            $http.get("/laravel_and_angularjs_codes/blog/public/comments").then(function(response){
                $scope.comments = response.data;
            },function(response){
                notifyError(response);
            });
        });
    });

    app.controller('tagController',function ($scope,$http) {
        $scope.tags = [];
        $scope.$on('$viewContentLoaded', function(){
            $http.get("/laravel_and_angularjs_codes/blog/public/tags/posts").then(function(response){
                $scope.tags = response.data;
            },function(response){
                notifyError(response);
            });
        });
    });


app.controller('loginController',function ($scope,$http,$location,$rootScope) {

        $scope.user = {};

        $scope.doLogin = function(){
         if ($scope.form.$invalid) {
            console.warn("invalid form");
            return;
        }
        $http.post("/laravel_and_angularjs_codes/blog/public/login",
        {
            'email' : $scope.user.email,
            'password' : $scope.user.password
        }).then(function(response){
                            $rootScope.authuser = response.data;
                            $location.path('/');
                        },function(response){
                         notifyError(response);
                     });
        }
});

app.controller('newUserController',
    function ($scope,$http,$location,$rootScope) {
        $scope.user = {};
        $scope.createUser = function(){
         if ($scope.form.$invalid) {
            console.warn("invalid form");
            return;
        }
        $http.post("/user/newlogin",
        {
            'email' : $scope.user.email,
            'password' : $scope.user.password,
            'name':$scope.user.name
        }).then(function(response){
                            $rootScope.authuser = response.data;
                            $location.path('/');
                        },function(response){
                         notifyError(response);
                     });
        }
});

app.controller('logoutController',
    function ($scope,$http,$location,$rootScope) {
    $http.get("/logout").then(function(response){
        notifyOk("Logout realizado.");
        $rootScope.authuser = null;
        $location.path('#/');
    },function(response){
        notifyError(response);
    });
});
