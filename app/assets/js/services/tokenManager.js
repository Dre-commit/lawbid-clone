/**
 * Created by Admin on 2/2/2017.
 */
(function () {
    var tokenManager = function (jwtHelper, $localStorage, $rootScope, $http) {
        var getTokenExpirationDate = function(token) {
            var decoded = jwtHelper.decodeToken(token);
            if(typeof decoded.exp === "undefined") {
                return null;
            }
            return decoded.exp;
        };

        var isTokenExpired = function(token, offsetSeconds) {
            var d = getTokenExpirationDate(token);
            offsetSeconds = offsetSeconds || 0;
            if (d === null) {
                return false;
            }
            return !(d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
        };

        this.checkAuthOnRefresh = function(){
            $rootScope.$on('$locationChangeStart', function () {
                var token = $localStorage.applicationData.token;
                if (token) {
                    if (!isTokenExpired(token)) {
                        authenticate();
                    } else {
                        $rootScope.$broadcast('tokenHasExpired', token);
                    }
                }
            });
        };

        this.refreshToken = function(){
             var promise = $http({
                url: "/api/refreshToken",
                method: "GET",
                headers: {
                    "Cache-Control": "no-cache"
                }
            }, function (data) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };

        function authenticate() {
            $rootScope.isAuthenticated = true;
        }
    };

    angular.module('app').service('tokenManager', tokenManager);

}());