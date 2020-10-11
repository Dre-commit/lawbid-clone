'use strict';
app.controller("FeaturedCasesCtrl", ["$scope", "$http", "$cookies", "$filter", "ngTableParams", "solicitorService", "userService", "caseService",
    function ($scope, $http, $cookies, $filter, ngTableParams, solicitorService, userService, caseService) {
        if (Number.prototype.toRadians === undefined) {
            Number.prototype.toRadians = function () {
                return this * Math.PI / 180;
            };
        }

        function reloadTable() {
            caseService.fetchFeaturedCases().then(function (featuredCases) {
                featuredCases = featuredCases.data;

                if (featuredCases.code === 700) {
                    var allCases = [];

                    //Computation to check the distance between locations
                    featuredCases.validCases.forEach(function (element, index, array) {
                        allCases.push(element);
                    });

                    allCases.forEach(function (caseData) {
                        caseData.types =
                            caseService.allCaseTypesString(caseData);

                        if (caseData.lastActivity) {
                            switch (caseData.lastActivity.Action) {
                                case "bidded":
                                    caseData.lastActivity.icon = "fa fa-gavel";
                                    caseData.lastActivity.tooltip = "You placed a bid";
                                    break;
                                case "interested":
                                    caseData.lastActivity.icon = "fa fa-star";
                                    caseData.lastActivity.tooltip = "You are interested";
                                    break;
                                case "not interested":
                                    caseData.lastActivity.icon = "far fa-star";
                                    caseData.lastActivity.tooltip = "You are no longer interested";
                                    break;
                                case "asked for info":
                                    caseData.lastActivity.icon = "fa fa-question-circle";
                                    caseData.lastActivity.tooltip = "You asked a question";
                                    break;
                            }
                        } else {
                            caseData.lastActivity = {
                                icon: "far fa-circle text-muted",
                                tooltip: "You have no activity for this case",
                            };
                        }
                    });

                    if (allCases.length > 0) {
                        $scope.nodata = false;
                        $scope.allCases = allCases;
                        $scope.cases = allCases;

                        // separate controller merged into this controller
                        // needed for the ng-tables on dashboard view
                        // new ngTableParams( {settings}, {data} )
                        $scope.tableParams = new ngTableParams({
                            page: 1, // show first page
                            count: 10, // count per page
                        }, {
                            total: $scope.cases.length, // length of data
                            getData: function ($defer, params) {
                                // use build-in angular filter
                                var orderedData = params.filter() ? $filter('filter')($scope.cases, params.filter()) : $scope.cases;

                                $scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                                params.total(orderedData.length);
                                // set total for recalc pagination
                                $defer.resolve($scope.users);
                            }
                        });
                    } else {
                        $scope.nodata = true;
                    }
                }
            });
        }

        var init = function () {
            $scope.filter = { search: '' };
            $scope.filterResults = function (q) {
                function containsQ(str) {
                    return str.toLowerCase().includes(q.toLowerCase());
                }
                $scope.cases = $scope.allCases.filter(function (caseData) {
                    return (
                        containsQ(caseData.Title)
                        || containsQ(caseData.types)
                        || containsQ(caseData.formatedDate)
                        || containsQ(caseData.Description)
                    );
                });
                $scope.tableParams.reload();
            };
            reloadTable();
            setInterval(function () {
                reloadTable();
            }, 60 * 1000);
        };

        init();

    }
]);
