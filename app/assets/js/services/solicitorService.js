'use strict';
/**
 * Created by Admin on 5/25/2016.
 */
(function() {
    var solicitorService = function($http, $cookies, userService) {

        this.getUserMembership = function (){
            var promise = $http({
                url: "/api/fetchMembershipPlan",
                method: "POST",
                data: JSON.stringify({
                    UserID: JSON.parse($cookies.get("userSession")).ID
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control" : "no-cache"
                }
            }, function (data, status, headers, config) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };

        this.getSolicitorDescription = function(userID){
            var promise = $http({
                url: '/api/getDescription',
                method: "POST",
                data: JSON.stringify({
                    UserID: userID
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            }, function (data, status, headers, config) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };

        this.getSolicitorReviews = function(userID){
            var promise = $http({
                url: '/api/getReviews',
                method: "GET",
                params: {
                    UserID: userID
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            }, function (data, status, headers, config) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };

        this.getSolicitorRating = function(userID){
            var promise = $http({
                url: '/api/fetchRating',
                method: "POST",
                data: JSON.stringify({
                    UserID: userID
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            }, function (data, status, headers, config) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };

        this.getDemoRequests = function () {
            return $http.get("/api/demoRequests").then(function (data) {
                return data.data;
            });
        }

        this.addDemoRequest = function (wantsDemo) {
            return $http.post("/api/demoRequests", {wantsDemo: wantsDemo});
        }
    };

    angular.module("app").service("solicitorService", ["$http", "$cookies", "userService", solicitorService]);

}());
