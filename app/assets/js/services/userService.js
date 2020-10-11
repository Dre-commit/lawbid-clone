'use strict';

(function () {
    var userService = function ($http, $state, $cookies, $localStorage, SweetAlert) {

        this.getUserInformation = function () {
            var promise = $http({
                url: "/api/getUserDetails",
                method: "GET",
                headers: {
                    "Cache-Control": "no-cache"
                }
            }, function (user) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };

        this.updateUserDetails = function (categories, newPassword, newUserInfo) {
            var promise = $http({
                url: "/api/updateDetails",
                method: "POST",
                data: {
                    FirstName: newUserInfo.FirstName,
                    LastName: newUserInfo.LastName,
                    Email: newUserInfo.Email || "",
                    Telephone: newUserInfo.Telephone,
                    Postcode: newUserInfo.Postcode,
                    City: newUserInfo.City,
                    Address: newUserInfo.Address,
                    newPassword: newPassword,
                    Description: newUserInfo.UserDescription,
                    SRA: newUserInfo.SRA,
                    categories: categories,
                    countries: newUserInfo.countries,
                    CompanyName: newUserInfo.CompanyName,
                    LegalAid: newUserInfo.LegalAid,
                    ProBono: newUserInfo.ProBono

                },
                headers: {
                    "Cache-Control": "no-cache"
                }
            }, function (data, status, headers, config) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };

        this.checkPostCode = function (url) {
            var promise = $http({
                url: url,
                method: "GET"
            }, function (data, status, headers, config) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };

        this.recoverPassword = function (email) {
            var promise = $http({
                url: "/api/recoverPassword",
                method: "POST",
                data: JSON.stringify({
                    email: email
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache"
                }
            }, function (data, status, headers, config) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };

        this.dismissSetupDialog = function (userID) {
            return $http.post("/api/dismissSetupDialog", {userID: userID});
        }

        this.showSolicitorLoginDialog = function (userID) {
            var dismissSetupDialog = this.dismissSetupDialog;
            SweetAlert.swal({
                title: "Hello and welcome to LawBid!",
                text:
                    "<p>To make the most of LawBid, we " +
                    "strongly suggest that you select " +
                    "all of the specialisms that you " +
                    "can provide on " +
                    "<b><a ng-href=\"/app#!/app/pages/user\"" +
                    "onclick=\"swal.close()\">" +
                    "your&nbsp;profile</a></b>.</p><br>" +
                    "<p>You will only see cases relevant " +
                    "to the specialisms that you choose, " +
                    "so it is important to ensure that " +
                    "you select any that are of " +
                    "interest to you.</p>",
                html: true,
                confirmButtonText: "OK",
                confirmButtonColor: "#007AFF",
                showCancelButton: true,
                cancelButtonText: "Do Not Show This Again",
                cancelButtonColor: "#d33",
                allowEscapeKey: false
            }, function (showAgain) {
                if (!showAgain) {
                    dismissSetupDialog(userID);
                }
            });
        }

        this.getUpdatesInfo = function() {
            return $http({
                url: "/api/updatesInfo",
                method: "GET"
            }).then(function (result) {
                return result.data.items;
            });
        };

        this.updatesSeen = function (date) {
            return $http({
                url: "/api/updatesSeen",
                method: "PUT",
                data: JSON.stringify({
                    date: date
                })
            });
        };

        this.showUpdatesDialogs = function () {
            var that = this;
            function showDialogs(updates) {
                var update = updates.shift();
                if (update === undefined) {
                    return;
                }
                SweetAlert.swal({
                    title: update.title,
                    text: update.description,
                    html: true,
                    confirmButtonColor: "#007AFF",
                    allowEscapeKey: false,
                }, function () {
                    that.updatesSeen(new Date(update.date));
                    showDialogs(updates)
                });
            }
            this.getUpdatesInfo().then(showDialogs);
        };
    };

    angular.module("app").service("userService", userService);

}());
