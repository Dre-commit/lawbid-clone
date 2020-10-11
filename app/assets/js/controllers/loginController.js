'use strict';
app.controller("LoginController", ["$scope", "$http", "$state", "userService", "authService", "$cookies", "$localStorage", "SweetAlert",
    function ($scope, $http, $state, userService, authService, $cookies, $localStorage, SweetAlert) {
        $scope.warning = "";
        $scope.user = {};

        $scope.login = function () {
            authService.login($scope.user.email, $scope.user.password).then(function (loginInfo) {
                loginInfo = loginInfo.data;

                if (loginInfo.code === 600) {
                    $localStorage.applicationData.token = loginInfo.token;
                    $http.defaults.headers.common.Authorization = 'JWT ' +  $localStorage.applicationData.token;
                    userService.showUpdatesDialogs();
                    userService.getUserInformation().then(function (userData) {
                        var userData = userData.data.details;

                        if (userData.info.type === 1 ) {
                            $state.go("app.cases");
                        } else {
                            $state.go("app.dashboard");
                        }
                    });
                } else {
                    $scope.warning = loginInfo.message;
                }
            });
        };
    }
]);
