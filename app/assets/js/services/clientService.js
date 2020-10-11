'use strict';
/**
 * Created by Admin on 5/25/2016.
 */
(function() {
    var clientService = function($http, $cookies, userService, $q) {

        this.getSession = userService.getSession;


        this.getCasesForClient = function(){
            var promise = $http({
                url: "/api/fetchCases",
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }, function (data, status, headers, config) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };


        this.postCase = function(title, type, radius, casedescription){
            var promise = $http({
                url: "/api/postCase",
                method: "POST",
                data: JSON.stringify({
                    Title: title,
                    Type: type,
                    Area: radius * 0.00062137,
                    Description: casedescription,
                    Status: 0
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }, function (data, status, headers, config) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };


        /**
         *  This promise can be called to make a call for a new activation email with a new token.
         * @returns {*}
         */
        this.resendActivationEmail = function(){
            var promise = $http({
                url: "/api/sendVerificationOfAccountEmail",
                method: "GET",
                headers:{
                    "Cache-Control" : "no-cache"
                }
            }, function (data, status, headers, config) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };

        this.noticeSolicitorBidIsTooHigh = function(solicitorEmail, caseTitle, solicitorFirstName, caseID, BidID){
            var promise = $http({
                url: '/api/bidTooHighNoticeToSolicitor',
                method: "POST",
                data: JSON.stringify({
                    SolicitorEmail: solicitorEmail,
                    CaseTitle: caseTitle,
                    SolicitorName: solicitorFirstName,
                    CaseID : caseID,
                    BidID: BidID
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

        this.acceptBidOfSolicitor = function(bidID, caseTitle, bidValue, bidType, userID, caseID ){
            var promise = $http({
                url: '/api/acceptBid',
                method: "POST",
                data: JSON.stringify({
                    BidID: bidID,
                    CaseTitle: caseTitle,
                    Value: bidValue,
                    Type: bidType,
                    UserID: userID,
                    CaseID: caseID
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

        this.answerQuestionFromSolicitor = function(questionID, solicitorID, caseID, answer, question, caseTitle){
            var promise = $http({
                url: '/api/sendAnswearEmail',
                method: "POST",
                data: JSON.stringify({
                    QuestionID: questionID,
                    UserID: solicitorID,
                    CaseID: caseID,
                    Answear: answer,
                    Question: question,
                    CaseTitle: caseTitle
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

        this.rateSolicitor = function(userID, rate, bidID){
            var promise = $http({
                url: '/api/rateSolicitor',
                method: "POST",
                data: JSON.stringify({
                    UserID: userID,
                    Rating: rate,
                    BidID: bidID
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

        this.reviewSolicitor = function(bidID, review){
            var promise = $http({
                url: '/api/leaveReview',
                method: "POST",
                data: JSON.stringify({
                    BidID: bidID,
                    Review: review
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

        this.isImage = function isImage(src, solicitorID) {

            var deferred = $q.defer();

            var imageDoesntExist = {
                "solicitorID" : solicitorID,
                "state" : false
            };


            var imageExists = {
                "solicitorID" : solicitorID,
                "state" : true
            };

            var image = new Image();
            image.onerror = function() {
                deferred.resolve(imageDoesntExist);
            };
            image.onload = function() {
                deferred.resolve(imageExists);
            };
            image.src = src;

            return deferred.promise;
        }
    };

    angular.module("app").service("clientService", ["$http", "$cookies", "userService", "$q", clientService]);

}());
