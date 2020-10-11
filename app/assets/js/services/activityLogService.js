/**
 * Created by Admin on 5/25/2016.
 */
(function () {
    var activityLogService = function ($http, $state, $cookies) {

        this.fetchActivityLogs = function (period) {
            var promise = $http({
                url: "/api/fetchActivityLogs",
                method: "GET",
                params: {
                    period : period
                },
                headers: {"Content-Type": "application/json"}
            }, function (data, status, headers, config) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };

        this.adClick = function (title) {
            return $http({
                url: "/api/click/" + title,
                method: "GET",
                headers: {"Content-Type": "application/json"}
            });
        };
    };

    angular.module('app').service('activityLogService', activityLogService);

}());
