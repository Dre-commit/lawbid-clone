"use strict";
app.controller("ActivityLogCtrl", ["$scope", "$http", "$cookies", "activityLogService",
    function ($scope, $http, $cookies, activityLogService) {

        var init = function () {
            $scope.adClick = function (title) {
                activityLogService.adClick(title).then(function (response) {
                    window.location = response.data.href;
                });
            };

            $scope.wideAds = [
                {
                    title: "wildings-employment-law-for-business",
                    src: "wildings-employment-law-for-business.jpg"
                }
            ];

            $scope.ads = [
                {
                    title: "summize",
                    src: "summize.png"
                },
                {
                    title: "whittakers",
                    src: "whittakers.jpg"
                },
                {
                    title: "bluebird",
                    src: "bluebird.jpg"
                },
                {
                    title: "madison-square-media",
                    src: "madison-square-media.png"
                },
                {
                    title: "lawbid-advertise-here",
                    src: "advertise-here.jpg"
                }
            ];

            $scope.activityHeader = "Today Activity";

            var fetchActivityLogs = function (period) {
                activityLogService.fetchActivityLogs(period).then(function (activityLogs) {
                    activityLogs = activityLogs.data;
                    if (activityLogs.code === 700) {
                        if (activityLogs.activities.length === 0) {
                            $scope.empty = true;
                        } else {
                            $scope.activities = activityLogs.activities;
                            for(var index = 0; index < $scope.activities.length; index ++){
                                if($scope.activities[index].Action === 'bidded'){
                                    $scope.activities[index].Action = 'bid';
                                }
                            }
                            $scope.empty = false;
                        }
                    }
                });
            };

            // 1 means "today"
            fetchActivityLogs(1);

            $scope.checkClass = function (action) {
                if (action == "interested") {
                    return "timeline-item warning";
                }
                else if (action == "not interested") {
                    return "timeline-item danger";
                }
                else if (action == "bid") {
                    return "timeline-item info";
                }
                else if (action == "accepted") {
                    return "timeline-item success";
                }
                else if (action == "asked for info") {
                    return "timeline-item primary";
                }
            };

            $scope.getActivity = function (period) {
                fetchActivityLogs(period);
            };

        };

        init();

    }]);
