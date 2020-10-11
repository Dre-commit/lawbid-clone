/**
 * Created by Admin on 5/25/2016.
 */
(function() {
    var membershipService = function($http, $cookies) {
        this.fetchMembership = function(){
            var promise  = $http({
                url: '/api/fetchMembershipPlan',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control' : 'no-cache'
                }
            });

            return promise;
        };

        this.noticeEnterpriseRequest = function(){
            var promise  = $http({
                url: '/api/noticeEnterpriseRequest',
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control' : 'no-cache'
                }
            });

            return promise;
        };

        this.noticeMembershipClick = function(newType){
            var promise  = $http({
                url: '/api/noticeMembershipClick',
                method: "POST",
                data: JSON.stringify({
                    newType: newType
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control' : 'no-cache'
                }
            });

            return promise;
        };

        this.sendPaymentInvoice = function(newMembership){
            var promise = $http({
                url: '/api/sendPaymentInvoice',
                method: "POST",
                data: JSON.stringify({
                    newMembership: newMembership
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control' : 'no-cache'
                }
            }, function (success) {

            }, function(error){
                console.log(error);
            });

            return promise;
        };
    };

    angular.module('app').service('membershipService', membershipService);

}());