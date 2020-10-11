'use strict';

(function () {
    var authService = function ($http, $state) {

        this.login = function (email, password) {
            var promise = $http({
                url: "/api/login",
                method: "POST",
                data: JSON.stringify({
                    email: email,
                    password: password
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

        this.logout = function () {
            var promise = $http({
                url: "/api/logout",
                method: "GET",
                headers: {
                    "Cache-Control": "no-cache"
                },
                //This parameter is meant stop IE from caching my responses
                params: {
                    timestamp: new Date()
                }
            }, function (data, status, headers, config) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };

        this.register = function (
                firstName,
                lastName,
                telephone,
                address,
                addressLine2,
                city,
                SRA,
                companyName,
                email,
                type,
                password,
                postcode,
                categories,
                countries,
                solicitorDescription,
                solicitorShow) {
            var promise = $http({
                url: "/api/register",
                method: "POST",
                data: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    telephone: telephone,
                    address: address,
                    addressLine2: addressLine2,
                    city: city,
                    SRA: SRA,
                    companyName: companyName,
                    email: email,
                    type: type,
                    password: password,
                    postcode: postcode,
                    categories: categories,
                    countries: countries,
                    description: solicitorDescription,
                    solicitor: solicitorShow
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
    };

    angular.module("app").service("authService", authService);
}());
