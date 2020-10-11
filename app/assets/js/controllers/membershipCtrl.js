'use strict';
(function () {
    var MembershipController = function ($scope, $http, $state, userService, $cookies,
                                         SweetAlert, $stateParams, $ocLazyLoad, $uibModal, membershipService) {

        var init = function () {
            membershipService.fetchMembership().then(
                function (data) {
                    data = data.data;
                    if (data.code === 700) {
                        if (data.membership.MembershipType === 1) {
                            $scope.phrase = "<p>Currently you have a subscription to the <strong>Free</strong> package.</p>";
                        } else if (data.membership.MembershipType === 2) {
                            $scope.membershipType = 'Basic';
                            $scope.periodAvailable = '1 year';
                            $scope.daysLeft = data.membership.daysLeftOfMembership;
                            $scope.phrase = "Currently you have a subscription to the <strong>Basic</strong> package " +
                                "which is available for 1 year. (you have <strong>" + $scope.daysLeft + "</strong> days left)";
                        } else if (data.membership.MembershipType === 3) {
                            $scope.membershipType = 'Pro';
                            $scope.periodAvailable = '1 year';
                            $scope.daysLeft = data.membership.daysLeftOfMembership;
                            $scope.phrase = "Currently you have a subscription to the <strong>Premium</strong> package " +
                                "which is available for 1 year. (you have <strong>" + $scope.daysLeft + "</strong> days left)";
                        } else if (data.membership.MembershipType === 4) {
                            $scope.membershipType = 'Enterprise';
                            $scope.periodAvailable = '1 year';
                            $scope.daysLeft = data.membership.daysLeftOfMembership;
                            $scope.phrase = "Currently you have a subscription to the <strong>Enterprise</strong> package " +
                                "which is available for 1 year. (you have <strong>" + $scope.daysLeft + "</strong> days left)";
                        }
                        $scope.casesLeft = data.membership.casesLeft;
                        $scope.phrase += "<p>You have <strong>" + $scope.casesLeft + "</strong> cases remaining.</p>";
                    }
                }, function (data) {
                    console.log(data);
                });

            $scope.noticeEnterpriseRequest = function () {
                membershipService.noticeMembershipClick("Enterprise");
                SweetAlert.swal({
                    title: "Upgrade to Enterprise?",
                    text: "If you would like to upgrade to our bespoke Enterprise Subscription package, we will contact you for further details.",
                    type: "info",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonColor: "#007AFF",
                    cancelButtonText: "Not yet",
                    confirmButtonText: "Accept"
                }, function (isConfirmed) {
                    if (isConfirmed) {
                        membershipService.noticeEnterpriseRequest().then(function(success){
                            var data = success.data;

                            if (data.code === 600) {
                                SweetAlert.swal({
                                    title: "Confirmation",
                                    text: "Your request has been sent." +
                                    " We will contact you shortly.",
                                    type: "success",
                                    confirmButtonColor: "#007AFF"
                                }, function () {
                                    $state.transitionTo($state.current, $stateParams, {
                                        reload: true,
                                        inherit: false,
                                        notify: true
                                    });
                                });
                            }
                        }, function (error) {
                            console.log(error);
                        });
                    }
                });
            };

            $scope.changeMembership = function (newType) {
                membershipService.noticeMembershipClick(newType);

                SweetAlert.swal({
                    title: "Upgrade Subscription?",
                    text: "If you decide to upgrade we will send an invoice via email. The subscription package will" +
                    " commence once payment has been made.",
                    type: "info",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonColor: "#007AFF",
                    cancelButtonText: "Not yet",
                    confirmButtonText: "Accept"
                }, function (isConfirmed) {
                    var newMembership = newType;

                    if (isConfirmed) {
                        membershipService.sendPaymentInvoice(newMembership).then(function (data) {
                            data = data.data;
                            if (data.code === 600) {
                                SweetAlert.swal({
                                    title: "Confirmation",
                                    text: "We have now sent you a proforma invoice. Your subscription upgrade will" +
                                    " commence once payment has been made.",
                                    type: "success",
                                    confirmButtonColor: "#007AFF"
                                }, function () {
                                    $state.transitionTo($state.current, $stateParams, {
                                        reload: true,
                                        inherit: false,
                                        notify: true
                                    });
                                });
                            } else {
                                if (data.code === 601) {
                                    SweetAlert.swal({
                                        title: "",
                                        text: "A subscription update of this type has already been requested by you." +
                                        " Please make payment to access your upgrade features.",
                                        type: "error",
                                        confirmButtonColor: "#007AFF"
                                    }, function (isConfirmed) {
                                        $state.transitionTo($state.current, $stateParams, {
                                            reload: true,
                                            inherit: false,
                                            notify: true
                                        });
                                    });
                                }
                            }
                        }, function (error) {
                            console.log(error);
                        });
                    }
                });
            };
        };
        init();
    };

    MembershipController.$inject = ["$scope", "$http", "$state", 'userService', '$cookies',
        'SweetAlert', '$stateParams', '$ocLazyLoad', '$uibModal', 'membershipService'];
    angular.module('app')
        .controller('MembershipController', MembershipController);

}());
