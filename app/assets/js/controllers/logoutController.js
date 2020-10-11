'use strict';
app.controller("LogoutController", ["$scope", "$http", "$state", "userService", "$localStorage",
    function ($scope, $http, $state, userService, $localStorage) {
        $scope.renderAvatar = false;
        var stringToColour = function(str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            var colour = '#';
            for (var i = 0; i < 3; i++) {
                var value = (hash >> (i * 8)) & 0xFF;
                colour += ('00' + value.toString(16)).substr(-2);
            }
            return colour;
        };

        var init = function () {
            $scope.showData = false;
            userService.getUserInformation().then(function(user){
                user = user.data.details.info;
                $scope.firstName = user.FirstName;
                $scope.firstNameDisplay = $scope.firstName.split(" ")[0];
                $scope.lastName = user.LastName;
                $scope.avatar = "assets/images/users/" + user.ID;
                $scope.email = user.Email;

                $scope.avatarDetails = {
                    initials: $scope.firstName.charAt(0).toUpperCase() + '' + $scope.lastName.charAt(0).toUpperCase(),
                    backgroundColour: stringToColour($scope.email)
                };

                $scope.renderAvatar = true;
                $scope.showData = true;
            });
            $scope.logout = function () {
                delete $localStorage.applicationData.token;
                $http.defaults.headers.common.Authorization = '';
                $state.go('login.signin');
            };
        };

        init();
    }
]);
