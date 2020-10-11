'use strict';
app.controller("RecoverController", ["$scope", "$http", "$state", "userService",
    function ($scope, $http, $state, userService) {

        var init = function () {
            $scope.warning = "";

            $scope.recover = function () {
                userService.recoverPassword($scope.user.email).then(function (recoverInfo) {
                    recoverInfo = recoverInfo.data;

                    if (recoverInfo.code === 630) {
                        $scope.warning = recoverInfo.message;
                    } else {
                        $scope.warning = recoverInfo.message;
                    }
                });
            };
        };

        init();
    }
]);

