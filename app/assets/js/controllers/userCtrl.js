'use strict';
app.controller('UserCtrl', ["$stateParams", "$state", "$scope", "userService", "clientService", "caseService", "$http", "Upload", "$timeout", "$cookies", "SweetAlert",
    function ($stateParams, $state, $scope, userService, clientService, caseService, $http, Upload, $timeout, $cookies, SweetAlert) {
        var initializeValueOfCheckboxes = function (categories) {
            var index = 1;
            for (var category in categories) {
                //stop from looping if I start to find prototype properties
                if (!categories.hasOwnProperty(category)) {
                    continue;
                }
                if (category != "CategoryID" && category != "UserID") {
                    if (categories[category] == 1) {
                        $scope.checkbox["value" + index] = category;
                    } else {
                        $scope.checkbox["value" + index] = false;
                    }
                    index++;
                }
            }
        };

        var stringToColour = function (str) {
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

        var isEmpty = function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }

            return true && JSON.stringify(obj) === JSON.stringify({});
        };

        var init = function () {
            $scope.renderAvatar = false;
            $scope.showData = false;
            $scope.picFile = "";
            $scope.userNewPassword = {};
            $scope.form = { editing: false };

            userService.getUserInformation().then(function (userData) {
                $scope.checkbox = {};
                $scope.changePicture = false;
                $scope.userInfo = userData.data.details.info;
                $scope.userInfo.avatar = "assets/images/users/" + $scope.userInfo.ID;
                $scope.userInfo.categories = userData.data.details.categories;
                $scope.userInfo.countries = userData.data.details.countries;

                $scope.avatarDetails = {
                    initials: $scope.userInfo.FirstName.charAt(0).toUpperCase() + '' + $scope.userInfo.LastName.charAt(0).toUpperCase(),
                    backgroundColour: stringToColour($scope.userInfo.Email)
                };
                $scope.renderAvatar = true;

                if ($scope.userInfo.avatar == '') {
                    $scope.noImage = true;
                }
                $scope.userInfo.LegalAid = "" + $scope.userInfo.LegalAid;
                $scope.userInfo.ProBono = "" + $scope.userInfo.ProBono;
                $scope.showSubmit = false;

                if($scope.userInfo.categories){
                    delete $scope.userInfo.categories.CategoryID;
                    delete $scope.userInfo.categories.UserID;
                }

                initializeValueOfCheckboxes($scope.userInfo.categories);
                $scope.changePictureAction = function () {
                    $scope.changePicture = !$scope.changePicture;
                    $scope.progress -= $scope.progress;
                };

                $scope.resendEmail = function () {
                    clientService.resendActivationEmail().then(function (result) {
                        if (result.data.code == 620) {
                            SweetAlert.swal({
                                title: "Email resent",
                                text: "Your request for a new verification link has been received. " +
                                "We will now send an email to the email address you used to register," +
                                " please follow the verification link within to activate your account.",
                                type: "info",
                                confirmButtonColor: "#007AFF"
                            });
                        }
                    });
                };


                $scope.$watch("picFile", function () {
                    if ($scope.picFile == null) {
                        $scope.showSubmit = false;
                    }
                    else {
                        $scope.showSubmit = true;
                    }
                });


                /**
                 * Upload new picture as profile.
                 * @param dataUrl
                 * @param name
                 */
                $scope.upload = function (dataUrl, name) {
                    $scope.disableButton = true;
                    Upload.upload({
                        url: '/api/upload',
                        data: {
                            file: Upload.dataUrltoBlob(dataUrl, name)
                        }
                    }).then(function (response) {
                        /*$timeout(function () {*/
                        $scope.result = response.data;
                        /*});*/
                    }, function (response) {
                        if (response.status > 0) $scope.errorMsg = response.status
                            + ': ' + response.data;
                    }, function (evt) {
                        $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                        if ($scope.progress == 100) {
                            $scope.changePicture = false;
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                    });
                };
                $scope.showData = true;

                $scope.updateDetails = function () {
                    $scope.disableButton = true;
                    var data,
                        categories = [];

                    if (!isEmpty($scope.userInfo.categories)) {
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

                    if (caseService.containsPersonalDetails($scope.userInfo.UserDescription)) {
                        SweetAlert.swal({
                            title: "Contact details detected",
                            text:
                                "It looks like you are attempting to provide your contact " +
                                "details. Doing so is in breach of the terms of using LawBid.\n\n" +
                                "Please remove any phone numbers or email addresses from the " +
                                "description and try again.",
                            type: "error",
                            // confirmButtonColor: "#ff6c00"
                        }, function (isConfirmed) {
                            $scope.disableButton = false;
                        })
                        return
                    }

                    userService.updateUserDetails(categories, $scope.userNewPassword.newPassword, $scope.userInfo).then(function (result) {
                        data = result.data;
                        if (data.code === 900) {
                            SweetAlert.swal({
                                title: "Your details have been updated",
                                type: "success",
                                confirmButtonColor: "#007AFF"
                            }, function (isConfirm) {
                                $state.transitionTo($state.current, $stateParams, {
                                    reload: true,
                                    inherit: false,
                                    notify: true
                                });
                            });
                        } else if (data.code === 901) {
                            SweetAlert.swal({
                                title: "Email already used",
                                text: "Seems like this e-mail is already used by another user.",
                                type: "error",
                                confirmButtonColor: "#007AFF"
                            }, function(){
                                $scope.disableButton = false;
                            });
                        } else if (data.code === 902) {
                            SweetAlert.swal({
                                title: "Invalid Postcode",
                                text: "This postcode is not valid !",
                                type: "error",
                                confirmButtonColor: "#007AFF"
                            }, function(){
                                $scope.disableButton = false;
                            });
                        } else if (data.code === 903) {
                            SweetAlert.swal({
                                title: "Email invalid",
                                text: "This email address is not valid !",
                                type: "error",
                                confirmButtonColor: "#007AFF"
                            }, function () {
                                $scope.disableButton = false;
                            });
                        } else if (data.code === 904) {
                            SweetAlert.swal({
                                title: "Phone number too long",
                                text: data.message,
                                type: "error",
                                confirmButtonColor: "#007AFF"
                            }, function () {
                                $scope.disableButton = false;
                            });
                        } else if (data.code === 905) {
                            SweetAlert.swal({
                                title: "First Name invalid",
                                text: data.message,
                                type: "error",
                                confirmButtonColor: "#007AFF"
                            });
                        } else if (data.code === 906) {
                            SweetAlert.swal({
                                title: "Last Name invalid",
                                text: data.message,
                                type: "error",
                                confirmButtonColor: "#007AFF"
                            }, function () {
                                $scope.disableButton = false;
                            });
                        } else if (data.code === 907) {
                            SweetAlert.swal({
                                title: "Password invalid",
                                text: data.message,
                                type: "error",
                                confirmButtonColor: "#007AFF"
                            }, function () {
                                $scope.disableButton = false;
                            });
                        } else if (data.code === 908) {
                            SweetAlert.swal({
                                title: "Address invalid",
                                text: data.message,
                                type: "error",
                                confirmButtonColor: "#007AFF"
                            }, function () {
                                $scope.disableButton = false;
                            });
                        } else if (data.code === 909) {
                            SweetAlert.swal({
                                title: "Telephone invalid",
                                text: data.message,
                                type: "error",
                                confirmButtonColor: "#007AFF"
                            }, function () {
                                $scope.disableButton = false;
                            });
                        } else if (data.code === 910) {
                            SweetAlert.swal({
                                title: "City invalid",
                                text: data.message,
                                type: "error",
                                confirmButtonColor: "#007AFF"
                            }, function () {
                                $scope.disableButton = false;
                            });
                        } else if (data.code === 911) {
                            SweetAlert.swal({
                                title: "SRA invalid",
                                text: data.message,
                                type: "error",
                                confirmButtonColor: "#007AFF"
                            }, function () {
                                $scope.disableButton = false;
                            });
                        } else if (data.code === 912) {
                            SweetAlert.swal({
                                title: "Company Name invalid",
                                text: data.message,
                                type: "error",
                                confirmButtonColor: "#007AFF"
                            }, function () {
                                $scope.disableButton = false;
                            });
                        } else if (data.code === 913) {
                            SweetAlert.swal({
                                title: data.message,
                                text: "If your location has changed please contact us.",
                                type: "error",
                                confirmButtonColor: "#007AFF"
                            }, function () {
                                $scope.disableButton = false;
                            });
                        }
                    });
                };
            });
        };

        init();
    }]);
