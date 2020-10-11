'use strict';

app.controller("RegisterController", ["$scope", "$http", "$state", "authService", "userService", "$localStorage",
    function ($scope, $http, $state, authService, userService, $localStorage) {
        var init = function () {
            $scope.warning = "";
            $scope.btnClass = "btn btn-primary btn-warning";
            $scope.btnMessage = "Check";
            $scope.btnIcon = "fa fa-info";
            $scope.valid = false;
            $scope.solicitorShow = false;
            $scope.checkbox = { value13: 'General' };
            $scope.solicitorDescription = "";
            $scope.agreeChecked = false;
            $scope.passwordsMatched = false;
            $scope.descriptionCompanyValid = false;
            $scope.user = {};

            $scope.$watch("user.type", function (value) {
                if (parseInt(value) === 1) {
                    $scope.solicitorShow = false;
                } else if (parseInt(value) === 2) {
                    $scope.solicitorShow = true;
                }
            });

            $scope.$watch("user.country", function (value) {
                if (value != "England") {
                    $scope.user.SRA = "000000";
                } else {
                    $scope.user.SRA = undefined;
                }
            });

            $scope.$watch("agreeChecked" , function(value) {
                if (value === undefined) {
                    value = false;
                }
                $scope.agreeChecked = value;
            });

            $scope.$watch("[user.password,user.confirmPassword]", function (newValue, oldValue) {
                var newPassword  = newValue[0];
                var newConfirmPassword = newValue[1];

                if (newPassword !== undefined && (newPassword === newConfirmPassword)) {
                    $scope.passwordsMatched = true;
                } else {
                    $scope.passwordsMatched = false;
                }

            }, true);

            $scope.$watch("user.postcode", function(newPostCode) {
                if($scope.valid === true) {
                    $scope.btnClass = "btn btn-primary btn-warning";
                    $scope.btnMessage = "Check";
                    $scope.btnIcon = "fa fa-info";
                    $scope.valid = false;
                }
            });

            $scope.$watch("solicitorDescription", function(newText) {
                if (newText !== undefined && (newText.length > 2 && newText.length < 500)) {
                    $scope.descriptionCompanyValid = true;
                } else {
                    $scope.descriptionCompanyValid = false;
                }
            });


            // Utility function to format the names taken from the landing page.
            function capitalize(string) {
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
            }

            $scope.register = function (validForm) {

                if (validForm) {
                    // TODO: This should be refactored
                    var categories = [];
                    if ($scope.solicitorShow) {
                        categories.push($scope.checkbox.value1);
                        categories.push($scope.checkbox.value2);
                        categories.push($scope.checkbox.value3);
                        categories.push($scope.checkbox.value4);
                        categories.push($scope.checkbox.value5);
                        categories.push($scope.checkbox.value6);
                        categories.push($scope.checkbox.value7);
                        categories.push($scope.checkbox.value8);
                        categories.push($scope.checkbox.value9);
                        categories.push($scope.checkbox.value10);
                        categories.push($scope.checkbox.value11);
                        categories.push($scope.checkbox.value12);
                        categories.push($scope.checkbox.value13);
                        categories.push($scope.checkbox.value14);
                    }
                    var countries = {
                        England: $scope.user.country == "England",
                        Scotland: $scope.user.country == "Scotland",
                        NorthernIreland: $scope.user.country == "NorthernIreland",
                    }
                    authService.register(
                        $scope.user.firstName,
                        $scope.user.lastName,
                        $scope.user.telephone,
                        $scope.user.address,
                        $scope.user.addressLine2,
                        $scope.user.city,
                        $scope.user.SRA,
                        $scope.user.companyName,
                        $scope.user.email,
                        $scope.user.type,
                        $scope.user.password,
                        $scope.user.postcode,
                        categories,
                        countries,
                        $scope.solicitorDescription,
                        $scope.solicitorShow,
                        $scope.user.legalAid,
                        $scope.user.proBono)
                        .then(function (registerInfo) {
                            registerInfo = registerInfo.data;
                            if (registerInfo.code === 620) {
                                if (registerInfo.userType === 1) {
                                    $state.go("login.verify-client-account");
                                }else{
                                    authService.login(registerInfo.userData.Email, $scope.user.password).then(function (loginInfo) {
                                        loginInfo = loginInfo.data;
                                        if (loginInfo.code === 600) {
                                            $localStorage.applicationData.token = loginInfo.token;
                                            $http.defaults.headers.common.Authorization = 'JWT ' +  $localStorage.applicationData.token;
                                            $state.go("app.dashboard");
                                        }
                                    });
                                }
                            } else {
                                $scope.warning = registerInfo.message;
                            }
                        });
                }
            };

            $scope.checkPostCode = function (postcode) {
                var url = "https://api.postcodes.io/postcodes/" + postcode + "/validate";

                userService.checkPostCode(url).then(function (postcodeInfo) {
                    postcodeInfo = postcodeInfo.data;
                    if (postcodeInfo.result) {
                        $scope.btnClass = "btn btn-primary btn-success-custom";
                        $scope.btnMessage = "Valid";
                        $scope.btnIcon = "fa fa-check";
                        $scope.valid = true;
                    }
                    else {
                        $scope.btnClass = "btn btn-primary btn-danger";
                        $scope.btnMessage = "Invalid";
                        $scope.btnIcon = "fa fa-exclamation-triangle";
                        $scope.valid = false;
                    }
                });
            };


        };

        init();

    }
]);
