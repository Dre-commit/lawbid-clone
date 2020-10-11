'use strict';
app.controller('CaseCtrl', ['$scope', '$http', '$state', '$cookies', '$stateParams', 'SweetAlert', 'caseService', 'solicitorService', 'toaster', '$uibModal',
    function ($scope, $http, $state, $cookies, $stateParams, SweetAlert, caseService, solicitorService, toaster, $uibModal) {

        var init = function () {
            $scope.popUpBox = false;
            $scope.questions = [];
            $scope.questionsVisibility = "";
            $scope.dataLoaded = false;
            $scope.bidMakeMenu = false;
            $scope.emptyBid = {
                value: 0,
                type: 0,
                comment: null,
            };

            $scope.newDocumentRequest = {
                message: ""
            };

            function bidTypeMessageFromInt(n) {
                if (n === 1) {
                    return "Full case";
                } else if (n === 2) {
                    return "Hourly rate";
                } else if (n === 3) {
                    return "Consultation";
                } else if (n === 4) {
                    return "";
                } else {
                    throw "Invalid argument to bidTypeMessageFromInt;" +
                    " expected integer in range [1, 4], instead found " + n;
                }
            }

            function contactDetailsAlert() {
                SweetAlert.swal({
                    title: "Contact details detected",
                    text:
                        "It looks like you are attempting to provide your contact " +
                        "details. Doing so is in breach of the terms of using LawBid.\n\n" +
                        "Please remove any phone numbers or email addresses from your " +
                        "question and try again.",
                    type: "error",
                    // confirmButtonColor: "#ff6c00"
                }, function (isConfirmed) {
                    $scope.disableButton = false;
                })
            }

            function updateDocumentRequests() {
                caseService.getDocumentRequests($stateParams.caseID).then(function (requests) {
                    $scope.my_requests = requests.items.filter(function (request) {
                        return request.yours;
                    });
                    $scope.other_requests = requests.items.filter(function (request) {
                        return !request.yours;
                    });
                }).catch(function (err) {
                    $scope.my_requests = [];
                    $scope.other_requests = [];
                });
            }

            function refreshQuestions() {
                var caseID = $stateParams.caseID;
                caseService.fetchQuestionsAndAnswers(caseID).then(function (QandA) {
                    QandA = QandA.data;
                    $scope.personalQuestions = QandA.personalQuestions;
                    $scope.otherQuestions = QandA.otherQuestions;
                    $scope.questionsVisibility = QandA.visibility;
                    $scope.dataLoaded = true;
                });
            }

            caseService.getInformationOfACaseForSolicitor($stateParams.caseID).then(function (caseInfo) {
                caseInfo = caseInfo.data;
                if (caseInfo.code === 700) {
                    if (caseInfo.case) {
                        $scope.case = caseInfo.case;
                        $scope.caseIcon = caseService.caseTypeIconClass($scope.case.Type);
                        var countries = {
                            "england": "England and Wales",
                            "scotland": "Scotland",
                            "northernIreland": "Northern Ireland"
                        }
                        $scope.case.country = countries[$scope.case.country]
                        if (caseInfo.case.bid) {
                            $scope.bidValue = $scope.case.bid.Value;
                            var typeMessage = bidTypeMessageFromInt(caseInfo.case.bid.Type)
                            if (typeMessage !== "") {
                                $scope.case.bid.typeMessage = typeMessage
                            } else {
                                $scope.case.bid.typeMessage = $scope.case.bid.Message
                            }
                        } else {
                            $scope.bidValue = 0;
                        }
                        if ($scope.case.interested) {
                            $scope.interestedButtonText = 'Not interested';
                            $scope.interestedButtonClass = "btn btn-danger btn-wide";
                            $scope.interestedIcon = "thumbs-down";
                            $scope.interestedButtonTooltip = "Stop receiving notifications for this case"
                        } else {
                            $scope.interestedButtonText = 'Interested';
                            $scope.interestedButtonClass = "btn btn-success btn-wide";
                            $scope.interestedIcon = "thumbs-up";
                            $scope.interestedButtonTooltip = "Receive notifications for this case"
                        }

                        if ($scope.case.HTMLDescription) {
                            $scope.case.description = $scope.case.HTMLDescription;
                        } else {
                            $scope.case.description = $scope.case.Description;
                        }

                        refreshQuestions();

                        caseService.markCaseAsSeen($scope.case.CaseID)
                    }
                } else if (caseInfo.code === 702) {
                    $state.go('app.caseTaken');
                } else if (caseInfo.code === 703) {
                    $state.go('app.caseDoesNotExist');
                } else if (caseInfo.code === 704) {
                    $state.go('app.notAllowed');
                }
            });


            $scope.popUpMessageBox = function (_value) {
                if (_value && _value !== '0') {
                    $scope.bidMakeMenu = true;
                } else {
                    $scope.bidMakeMenu = false;
                }
            };

            $scope.changePopUpBox = function (newBid) {
                $scope.popUpBox = parseInt(newBid.type) === 4;
            };

            $scope.sortQuestion = function (question) {
                var date = new Date(question.CreationDate);
                return date;
            };

            $scope.getArea = function (number) {
                number = Math.ceil(number);
                if (number == 1500) {
                    number = "Nationwide";
                }
                else {
                    number += " miles";
                }
                return number;
            };

            $scope.roundDistance = function (number) {
                var round = Math.round(number);
                var text;

                if (round === 1)
                    text = " mile";
                else
                    text = " miles";

                return round + text;
            };

            function offerDemoRequest() {
                solicitorService.getDemoRequests().then(function (data) {
                    if (data.requiresFeedback) {
                        if (data.postponementsRemaining > 0) {
                            var tagLine;
                            switch (data.postponementsRemaining) {
                                case 4:
                                    tagLine = "Our most successful LawBid solicitors have all had a 5 minute LawBid Demo.";
                                    break;
                                case 3:
                                    tagLine = "How do I get this free Demo? Easy - click 'Request Demonstration', we'll do the rest.";
                                    break;
                                case 2:
                                    tagLine = "Secure new cases faster with our top tips 5 minute Demo. Click 'Request Demonstration' now!";
                                    break;
                                case 1:
                                    tagLine = "Book a 5 minute Demo now - start securing cases immediately!";
                                    break;
                            }
                            SweetAlert.swal({
                                title: "Request a Free Demonstration",
                                text: tagLine,
                                type: "info",
                                closeOnClickOutside: false,
                                closeOnEsc: false,
                                showCancelButton: true,
                                confirmButtonText: "Request Demonstration",
                                confirmButtonColor: "#ff6c00",
                                cancelButtonText: "Later",
                            }, function (isConfirmed) {
                                solicitorService.addDemoRequest(isConfirmed);
                            });
                        } else if (data.postponementsRemaining === 0) {
                            SweetAlert.swal({
                                title: "Request a Demonstration",
                                text: "Last chance for a 5 minute Demo to make you a more effective user.",
                                type: "info",
                                closeOnClickOutside: false,
                                closeOnEsc: false,
                                showCancelButton: true,
                                confirmButtonText: "Request Demonstration",
                                cancelButtonText: "No thanks",
                                confirmButtonColor: "#ff6c00",
                            }, function (isConfirmed) {
                                solicitorService.addDemoRequest(isConfirmed);
                            });
                        }
                    }
                });
            }

            $scope.interested = function () {
                caseService.createInterestedRelation($stateParams.caseID, $scope.case.FirstName, $scope.case.interested)
                    .then(function (interestedInfo) {
                        interestedInfo = interestedInfo.data;

                        if (interestedInfo.code === 700) {
                            $scope.interestedButtonText = 'Not interested';
                            $scope.interestedButtonClass = "btn btn-danger btn-wide";
                            $scope.interestedIcon = "thumbs-down";
                            $scope.interestedButtonTooltip = "Stop receiving notifications for this case";
                            $scope.case.interested = true;

                            // pop up a success message
                            toaster.pop({
                                type: "success",
                                title: "You are now interested",
                                body: "You will now be notified of activity on this case",
                            });

                            // If necessary ask if user wants demo
                            offerDemoRequest();
                        } else if (interestedInfo.code === 701) {
                            $scope.interestedButtonText = 'Interested';
                            $scope.interestedButtonClass = "btn btn-success btn-wide";
                            $scope.interestedIcon = "thumbs-up";
                            $scope.interestedButtonTooltip = "Receive notifications for this case"
                            $scope.case.interested = false;

                            // pop up a message
                            toaster.pop({
                                type: "info",
                                title: "You are no longer interested",
                                body: "You will no longer recieve notifications regarding this matter",
                            });
                        } else if (interestedInfo.code === 702) {
                            SweetAlert.swal({
                                title: "You have no credits remaining",
                                text: "You may not mark yourself as interested in a case if " +
                                    "you have no case credits remaining. Please consider a " +
                                    "<a href=\"#!/app/membership\" onclick=\"swal.close()\">membership package</a> " +
                                    "if you wish to remain active on LawBid.",
                                html: true,
                                confirmButtonColor: "#ff6c00",
                                type: "error"
                            });
                        }
                        refreshQuestions();
                        updateDocumentRequests();
                    });
            };

            $scope.bid = function (newBid) {
                var bidVal = newBid.value.replace(/,/g, ""); // Commas in bid
                var _value = parseFloat(bidVal);
                var _type = newBid.type;
                var _comment = newBid.comment;
                var bidFunction = this;
                if (_value === 0) {
                    SweetAlert.swal({
                        title: "Invalid bid",
                        text: "Value must be greater than 0",
                        type: "warning",
                        confirmButtonColor: "#ff6c00",
                    });
                } else {
                    if (_type == 4 && (_comment == null || _comment == undefined || _comment == "")) {
                        SweetAlert.swal({
                            title: "Provide a message",
                            text: "Attach a message to clarify your bid ONLY. Not to be used for Question & Answer.",
                            type: "warning",
                            confirmButtonColor: "#ff6c00",
                        });
                    } else {
                        if (_comment == null) {
                            _comment = "No extra information.";
                        }

                        if (_type === undefined || _type === 0) {
                            SweetAlert.swal({
                                title: "Please select a type for your bid",
                                text: "Please select one of the four types of bids available.",
                                type: "warning",
                                confirmButtonColor: "#ff6c00",
                            });
                        } else if (caseService.containsPersonalDetails(_comment)) {
                            contactDetailsAlert();
                        } else {
                            var bid = {
                                "CaseID": $stateParams.caseID,
                                "Message": _comment,
                                "Value": _value || 0,
                                "Type": _type,
                                "Accepted": 0,
                                "GivenRating": 0,
                                "Review": ''
                            };

                            return caseService.placeBid(bid, $scope.case.UserID, $scope.case.Title).then(function (bidInfo) {
                                bidInfo = bidInfo.data;
                                if ($scope.case.bid === undefined) {
                                    $scope.case.bid = bid;
                                }

                                if (bidInfo.code === 900) {
                                    $scope.bidValue = bid.Value;
                                    $scope.case.bid.typeMessage =
                                        bidTypeMessageFromInt(parseInt(bid.Type)) || bid.Message;
                                    bidFunction.newBid = angular.copy($scope.emptyBid);
                                    toaster.pop({
                                        type: "success",
                                        title: "You placed a bid of £" + bid.Value
                                    });
                                    offerDemoRequest();
                                    return Promise.resolve();
                                } else if (bidInfo.code === 901) {
                                    SweetAlert.swal({
                                        title: "Invalid bid",
                                        text: bidInfo.message,
                                        type: "warning",
                                        confirmButtonColor: "#ff6c00"
                                    });
                                } else if (bidInfo.code === 903) {
                                    SweetAlert.swal({
                                        title: "Case Limit Reached!",
                                        text: bidInfo.message,
                                        type: "warning",
                                        confirmButtonColor: "#ff6c00"
                                    });
                                } else if (bidInfo.code === 904) {
                                    SweetAlert.swal({
                                        title: "Invalid bid",
                                        text: bidInfo.message,
                                        type: "warning",
                                        confirmButtonColor: "#ff6c00"
                                    });
                                }
                                return Promise.reject();
                            });
                        }
                    }
                }
                return Promise.reject();
            };

            function askQuestion(_caseID, _comment) {
                caseService.askQuestion(_caseID, _comment, $scope.case.UserID, $scope.case.Title)
                    .then(function (questionInfo) {
                        questionInfo = questionInfo.data;

                        if (questionInfo.code === 906) {
                            SweetAlert.swal({
                                title: "Do you have a question ?",
                                text: questionInfo.message,
                                type: "warning",
                                confirmButtonColor: "#ff6c00"
                            }, function (isConfirmed) {
                                $scope.disableButton = false;
                            });
                        } else if (questionInfo.code === 903) {
                            SweetAlert.swal({
                                title: "Case limit reached",
                                text: "You may not request information if " +
                                    "you have no case credits remaining. Please consider a " +
                                    "<a href=\"#!/app/membership\" onclick=\"swal.close()\">membership package</a> " +
                                    "if you wish to remain active on LawBid.",
                                type: "error",
                                html: true,
                                confirmButtonColor: "#ff6c00"
                            }, function (isConfirmed) {
                                $scope.disableButton = false;
                            });
                        } else {
                            SweetAlert.swal({
                                title: "Your question has been sent",
                                type: "success",
                                confirmButtonColor: "#ff6c00"
                            }, function (isConfirmed) {
                                if (isConfirmed) {
                                    $state.transitionTo($state.current, $stateParams, {
                                        reload: true,
                                        inherit: false,
                                        notify: true
                                    });
                                } else {
                                    $scope.disableButton = true;
                                }
                            });
                        }
                    });
            }

            function quoteDetectedAlert() {
                SweetAlert.swal({
                    title: "Quote detected",
                    text:
                    "Information you submit here is public, " +
                    "therefore if you provide a quote here " +
                    "another solicitor may outbid you.\n\n" +
                    "If you wish to place a bid, enter the amount into the " +
                    "field below, select 'Other' and clarify your bid in the " +
                    "box that appears.",
                    type: "error",
                    confirmButtonColor: "#ff6c00"
                });
            }

            $scope.askInfo = function (_caseID, _comment) {
                $scope.disableButton = true;
                if (_comment == "" || _comment == " " || _comment == null) {
                    SweetAlert.swal({
                        title: "Did you have a question?",
                        text: "Please complete this field in less than 900 characters.",
                        type: "warning",
                        confirmButtonColor: "#ff6c00"
                    }, function (isConfirmed) {
                        $scope.disableButton = false;
                    });
                } else if (caseService.containsPersonalDetails(_comment)) {
                    contactDetailsAlert();
                } else if (caseService.containsPrice(_comment)) {
                    quoteDetectedAlert();
                    $scope.disableButton = false;
                } else {
                    askQuestion(_caseID, _comment);
                }
            };

            updateDocumentRequests();

            $scope.download = function (request, filename) {
                caseService.downloadDocument($stateParams.caseID, request, filename);
            };

            $scope.openDocument = function (request, filename) {
                caseService.openDocument($stateParams.caseID, request, filename).then(function (f) {
                    $uibModal.open({
                        templateUrl: 'fileViewer.html',
                        controller: function ($scope, $uibModalInstance, caseService, $q) {
                            $scope.doc = f.url;
                            $scope.isImage = f.mimetype.match(/^image/g) !== null;
                            $scope.docName = f.name;
                            $scope.mimetype = f.mimetype;
                            $scope.close = function () {
                                $uibModalInstance.close();
                            };
                        }
                    }).closed.then(function () {
                        window.URL.revokeObjectURL(data);
                    });
                });
            }

            $scope.sendDocumentRequest = function () {
                var msg = $scope.newDocumentRequest.message.trim();

                // Check message is not empty
                if (msg === "") {
                    SweetAlert.swal({
                        title: "Please enter a message",
                        type: "error",
                        confirmButtonColor: "#ff6c00"
                    });
                    return;
                }

                // Check for contact details
                if (caseService.containsPersonalDetails(msg)) {
                    contactDetailsAlert();
                    return;
                }

                // Check for price
                if (caseService.containsPrice(msg)) {
                    quoteDetectedAlert();
                    return;
                }

                caseService.postDocumentRequest($stateParams.caseID, msg).then(function (result) {
                    // Notify document request has been posted
                    toaster.pop({
                        type: "success",
                        title: "Document request sent",
                        body: "The client may now upload one or more documents in response",
                    });

                    // Clear box
                    $scope.newDocumentRequest.message = "";

                    // Add request to list
                    $scope.my_requests.push({ message: msg, documents: [] });
                }).catch(function (err) {
                    toaster.pop({
                        type: "error",
                        title: "Error sending document request",
                        body: "There was a problem sending the document request. " +
                            "Please try again later."
                    });
                });

            };
        };

        init();

    }
]);
