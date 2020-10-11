'use strict';
app.controller('UserCaseCtrl', ['$scope', '$http', '$cookies', '$stateParams', 'caseService', 'clientService',
    'solicitorService', '$state', 'SweetAlert', '$aside', 'bowser', 'userService', '$q', 'Upload', 'toaster',
    '$uibModal',
    function ($scope, $http, $cookies, $stateParams, caseService, clientService,
        solicitorService, $state, SweetAlert, $aside, bowser, userService, $q,
        Upload, toaster, $uibModal) {
        var isItInternetExplorer = function () {
            if (bowser.msie) {
                $scope.internetExplorer = true;
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

        var init = function () {
            var imagesUploaded = {};
            $scope.accepted = false;
            $scope.awaitingApproval = false;
            $scope.editingTitle = false;
            $scope.editingArea = false;
            $scope.internetExplorer = false;
            $scope.disableButton = false;
            $scope.settingsOpen = false;
            $scope.answerFormShow = {};
            $scope.allowedMimetypes = [
                "text/plain",
                "image/gif",
                "image/jpeg",
                "image/png",
                "image/bmp",
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "application/vnd.mspowerpoint",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.oasis.opendocument.text",
                "application/vnd.oasis.opendocument.spreadsheet",
                "application/vnd.oasis.opendocument.presentation",
            ].join(',');

            isItInternetExplorer();

            $scope.distances = [
                { value: 3, name: "3 miles" },
                { value: 5, name: "5 miles" },
                { value: 10, name: "10 miles" },
                { value: 50, name: "50 miles" },
                { value: 100, name: "100 miles" },
                { value: 1500, name: "Nationwide" }
            ];

            $scope.showAnswerForm = function (index) {
                $scope.answerFormShow[index] = true;
            };

            $scope.hideAnswerForm = function (index) {
                $scope.answerFormShow[index] = false;
            };

            $scope.isObjectEmpty = function () {
                if ($scope.case !== undefined)
                    return Object.getOwnPropertyNames($scope.case.questions).length === 0;
            };

            $scope.toggleSettings = function () {
                $scope.settingsOpen = !$scope.settingsOpen;
            };
            $scope.changeIcon = function (action, index, bidMessage) {
                // This varies if there are multiple bids, some of which containing messages, some of them not
                // [indexTooltip] that would be used by angular.element is different to the [$index] of the bid
                var indexTooltip;

                for (var i = 0; i < angular.element(".tooltip").length; i++) {
                    if (angular.element(".tooltip")[i].children[1].textContent == bidMessage) {
                        indexTooltip = i;
                        break;
                    }
                }

                if (action == "open") {
                    $scope.showCommmentIcon[index] = false;
                    $scope.showCloseIcon[index] = true;
                    $scope.tooltipOpen[index] = true;
                    if (angular.element(".tooltip")[indexTooltip]) {
                        angular.element(".tooltip")[indexTooltip].style.display = "block";
                    }
                } else if (action == "close") {
                    $scope.showCommmentIcon[index] = true;
                    $scope.showCloseIcon[index] = false;
                    angular.element(".tooltip")[indexTooltip].style.display = "none";
                }
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

            $scope.editTitle = function (title) {
                $scope.editingTitle = true;
                $scope.newTitle = title;
            };
            $scope.editArea = function (area) {
                $scope.editingArea = true;
                $scope.newArea = Math.ceil(area);
            };

            $scope.cancelEditingTitle = function () {
                $scope.editingTitle = false;
            };
            $scope.cancelEditingArea = function () {
                $scope.editingArea = false;
            };

            $scope.getBidClass = function (_type) {
                if (_type == 1) {
                    return "fa fa-gavel";
                }
                if (_type == 2) {
                    return "fa fa-clock";
                }
                if (_type == 3) {
                    return "fa fa-suitcase";
                }
                if (_type == 4) {
                    return "fa fa-info";
                }
            };

            $scope.getBidTypeText = function (_type) {
                if (_type == 1) {
                    return "Full case";
                }
                if (_type == 2) {
                    return "Hourly rate";
                }
                if (_type == 3) {
                    return "Consultation";
                }
                if (_type == 4) {
                    return "Other";
                }
            };

            function getBid(bidID) {
                return $scope.case.bids.find(function (bid) {
                    return bid.BidID == bidID;
                });
            }

            /**
             * Initialize all the information in the case view.
             * Bids information, interested solicitors information, questions, title, description etc.
             */
            caseService.getInformationOfACaseForClient($stateParams.caseID).then(function (caseInfo) {
                var checkImagesPromises = [];
                caseInfo = caseInfo.data;
                if (caseInfo.code === 700) {
                    $scope.case = caseInfo.case;
                    $scope.caseIcon = caseService.caseTypeIconClass($scope.case.Type);

                    if (caseInfo.case.interested.length === 0) {
                        $scope.interestShown = false;
                    } else if (caseInfo.case.interested.length > 0) {
                        $scope.interestShown = true;
                    }

                    for (var index = 0; index < caseInfo.case.interested.length; index++) {
                        var element = caseInfo.case.interested[index];
                        element.avatarDetails = {
                            initials: element.FirstName.charAt(0).toUpperCase() + '' + element.LastName.charAt(0).toUpperCase(),
                            backgroundColour: stringToColour(element.Email)
                        };
                    }

                    for (var elementt in $scope.case.questions) {
                        var x = $scope.case.questions[elementt];
                        x.avatarDetails = {
                            initials: x.solicitorName.charAt(0).toUpperCase() + '' + x.solicitorLName.charAt(0).toUpperCase(),
                            backgroundColour: stringToColour(x.solicitorEmail)
                        };

                        var fullPath = "../assets/images/users/" + x.solicitorID;

                        checkImagesPromises.push(clientService.isImage(fullPath, x.solicitorID));
                    }

                    if ($scope.case.HTMLDescription) {
                        $scope.case.description = $scope.case.HTMLDescription;
                    } else {
                        $scope.case.description = $scope.case.Description;
                    }

                    $q.all(checkImagesPromises).then(function (results) {
                        angular.forEach(results, function (result, index) {
                            imagesUploaded[result.solicitorID] = result.state;
                        });

                        $scope.imagesUploaded = imagesUploaded;
                    });

                    for (var elementtt in $scope.case.bids) {
                        var y = $scope.case.bids[elementtt];
                        y.avatarDetails = {
                            initials: y.FirstName.charAt(0).toUpperCase() + '' + y.LastName.charAt(0).toUpperCase(),
                            backgroundColour: stringToColour(y.Email)
                        };
                    }

                    caseService.getDocumentRequests($stateParams.caseID).then(function (result) {
                        $scope.case.documentRequests = result.items;
                        result.items.forEach(function (docReq, i) {
                            caseService.getSolicitorForCase(docReq.userID).then(function (userDetails) {
                                var solicitor = userDetails.data.solicitor;
                                solicitor.ID = docReq.userID;
                                solicitor.avatarDetails = {
                                    initials: solicitor.FirstName.charAt(0).toUpperCase() + '' + solicitor.LastName.charAt(0).toUpperCase(),
                                    backgroundColour: stringToColour(solicitor.Email)
                                };
                                var fullPath = "../assets/images/users/" + solicitor.ID;
                                clientService.isImage(fullPath, solicitor.ID).then(function (result) {
                                    solicitor.hasAvatar = result.state;
                                }).catch(function (err) {
                                    solicitor.hasAvatar = false;
                                });
                                $scope.case.documentRequests[i].user = solicitor;
                            });
                        });
                    });

                    function bidTypeMessageFromInt(n) {
                        if (n === 1) {
                            return "full case";
                        } else if (n === 2) {
                            return "hourly rate";
                        } else if (n === 3) {
                            return "consultation";
                        } else if (n === 4) {
                            return "message attached";
                        } else {
                            throw "Invalid argument to bidTypeMessageFromInt;" +
                                " expected integer in range [1, 4], instead found " + n;
                        }
                    }

                    caseInfo.case.bids.forEach(function (element) {
                        if (element.Accepted === 1 || element.AwaitingApproval === 1) {
                            $scope.bid = {
                                Value: element.Value,
                                typeMessage: bidTypeMessageFromInt(element.Type),
                                FirstName: element.FirstName,
                                LastName: element.LastName,
                                Email: element.Email,
                                Message: element.Message,
                                Telephone: element.Telephone,
                                Postcode: element.Postcode,
                                SRA: element.SRA,
                                CompanyName: element.CompanyName,
                                BidID: element.BidID,
                                UserID: element.UserID,
                                MembershipType: element.MembershipType,
                                City: element.City,
                                Address: element.Address
                            };
                            $scope.accepted = true;
                        }
                    });

                    $scope.showCommmentIcon = [];
                    $scope.showCloseIcon = [];
                    $scope.tooltipOpen = [];

                    for (var i = 0; i < $scope.case.bids.length; i++) {
                        $scope.showCommmentIcon[i] = true;
                        $scope.showCloseIcon[i] = false;
                        $scope.tooltipOpen[i] = false;
                    }
                }
            });

            $scope.openModalForChosenSolicitor = function (email, firstName, lastName, userID) {
                if ($scope.bid) {
                    if (userID === $scope.bid.UserID) {
                        $scope.openAside(email, 'right', firstName, lastName, userID, 'accepted', $scope.bid.BidID);
                    } else {
                        $scope.openAside(email, 'right', firstName, lastName, userID, 'interested');
                    }
                } else {
                    $scope.openAside(email, 'right', firstName, lastName, userID, 'interested');
                }
            };

            /**
             * @param  {solicitor}
             * @callback {send an email to the solicitor informing him that the bid is too high}
             */
            $scope.tooHigh = function (solicitor) {
                $scope.disableButton = true;
                clientService.noticeSolicitorBidIsTooHigh(solicitor.Email, $scope.case.Title, solicitor.FirstName, $stateParams.caseID, solicitor.BidID).then(function () {
                    SweetAlert.swal({
                        title: "Your notice will be sent to the specific solicitor",
                        type: "success",
                        confirmButtonColor: "#007AFF"
                    }, function (isConfirmed) {
                        $scope.disableButton = false;
                    });
                });
            };

            $scope.updateTitle = function (CaseID, NewTitle) {
                $scope.disableButton = true;
                caseService.updateTitle(CaseID, NewTitle).then(function (result) {
                    var data = result.data;

                    if (data.code == 700) {
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    }
                });
            };

            $scope.updateArea = function (CaseID, NewArea) {
                $scope.disableButton = true;
                caseService.updateArea(CaseID, NewArea).then(function (result) {
                    var data = result.data;

                    if (data.code == 700) {
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    }
                });
            };

            $scope.accept = function (bidID, userID, value, type, caseID) {
                $scope.disableButton = true;
                clientService.acceptBidOfSolicitor(bidID, $scope.case.Title, value, type, userID, caseID)
                    .then(function (result) {
                        var data = result.data;
                        if (data.code == 900) {
                            // pop up a success message
                            toaster.pop({
                                type: "success",
                                body: "The Solicitor will make contact with you as soon as possible by telephone/email"
                            });
                            $scope.accepted = true;
                            $scope.bid = getBid(bidID);
                            $scope.bid.typeMessage = bidTypeMessageFromInt($scope.bid.Type);
                        } else if (data.code == 903) {
                            SweetAlert.swal({
                                title: "",
                                text: data.message,
                                type: "warning",
                                confirmButtonColor: "#007AFF"
                            }, function (isConfirmed) {

                            });
                        }
                    });
            };

            $scope.answearQuestion = function (questionID, solicitorID, caseID, answer, question) {
                $scope.disableButton = true;
                if (typeof (answer) !== 'undefined' && answer != '') {
                    if (caseService.containsPersonalDetails(answer)) {
                        SweetAlert.swal({
                            title: "Contact details detected",
                            text:
                                "It looks like you are attempting to provide your contact " +
                                "details. Doing so is in breach of the terms of using LawBid.\n\n" +
                                "Please remove any phone numbers or email addresses from your " +
                                "answer and try again.",
                            type: "error"
                        }, function (isConfirmed) {
                            $scope.disableButton = false;
                        })
                    } else if (answer.length <= 900) {
                        clientService.answerQuestionFromSolicitor(questionID, solicitorID, caseID, answer, question, $scope.case.Title)
                            .then(function (result) {
                                var data = result.data;

                                if (data.code === 906) {
                                    SweetAlert.swal({
                                        title: "Please provide an answer",
                                        type: "error",
                                        confirmButtonColor: "#007AFF"
                                    });
                                } else {
                                    SweetAlert.swal({
                                        title: "",
                                        text: "Your answer has been sent to the solicitor",
                                        type: "success",
                                        confirmButtonColor: "#007AFF"
                                    }, function (isConfirmed) {
                                        if (isConfirmed) {
                                            $state.transitionTo($state.current, $stateParams, {
                                                reload: true,
                                                inherit: false,
                                                notify: true
                                            });
                                        } else {
                                            $scope.disableButton = false;
                                        }
                                    });
                                }
                            });
                    } else {
                        $scope.warning = "Please limit your answer to 400 characters.";
                    }
                } else {
                    $scope.warning = "Please complete the form to give a answer.";
                }
            };

            /**
             * Initialise the openAside controller.
             * This will control the logic of the solicitor details, leave review and leave rating.
             */
            $scope.openAside = function (email, position, solicitorFirstName, solicitorLastName, userID, action, bidID) {
                /**
                 * Auxiliary functions for the modal controller.
                 */
                var setRatingAvailableOrNot = function () {
                    if (action == 'interested' || action == 'bidded') {
                        return false;
                    }

                    return true;
                };
                $aside.open({
                    templateUrl: 'asideContent.html',
                    placement: position,
                    size: 'sm',
                    backdrop: true,
                    controller: function ($scope, $uibModalInstance, clientService, $q) {
                        //Create the name to be displayed
                        var getReviews = function () {
                            solicitorService.getSolicitorReviews(userID).then(function (result) {
                                var data = result.data;

                                if (data.code == 600) {
                                    $scope.reviewers = [];
                                    data.reviewers.forEach(function (element) {
                                        if (element.Review != "") {
                                            $scope.reviewers.push(element);
                                        }
                                    });
                                    if ($scope.reviewers.length == 0) {
                                        $scope.noreview = true;
                                    } else {
                                        $scope.noreview = false;
                                    }

                                    $scope.userID = userID;
                                    var fullPath = "../assets/images/users/" + userID;
                                    clientService.isImage(fullPath, userID).then(function (isImageData) {
                                        $scope.reviewImage = isImageData.state;

                                    });

                                    var imagesUploadedReviews = {};
                                    var checkImagesPromises = [];
                                    for (var element in $scope.reviewers) {
                                        $scope.reviewers[element].avatarDetails = {
                                            initials: $scope.reviewers[element].FirstName.charAt(0).toUpperCase() + '' + $scope.reviewers[element].LastName.charAt(0).toUpperCase(),
                                            backgroundColour: stringToColour($scope.reviewers[element].Email)
                                        };

                                        var temporaryPath = "../assets/images/users/" + $scope.reviewers[element].ID;

                                        checkImagesPromises.push(clientService.isImage(temporaryPath, $scope.reviewers[element].ID));
                                    }

                                    $q.all(checkImagesPromises).then(function (results) {
                                        angular.forEach(results, function (result, index) {
                                            imagesUploadedReviews[result.solicitorID] = result.state;
                                        });

                                        $scope.imagesUploadedReviews = imagesUploadedReviews;
                                    });
                                }
                            });
                        };
                        var getRating = function () {
                            solicitorService.getSolicitorRating(userID).then(function (result) {
                                var data = result.data;

                                if (data.code == 900) {
                                    if (data.rating.Rating === null) {
                                        $scope.starRating = 0;
                                    } else {
                                        $scope.starRating = data.rating.Rating.toFixed(2);
                                    }
                                }
                            });
                        };
                        if (action === "accepted") {
                            $scope.name = solicitorFirstName + ' ' + solicitorLastName;
                        } else {
                            $scope.name = solicitorFirstName;
                        }
                        $scope.firstName = solicitorFirstName;
                        $scope.lastName = solicitorLastName;
                        $scope.email = email;
                        $scope.avatarDetails = {
                            initials: $scope.firstName.charAt(0).toUpperCase() + '' + $scope.lastName.charAt(0).toUpperCase(),
                            backgroundColour: stringToColour($scope.email),
                            userID: userID
                        };
                        $scope.imgSrc = "assets/images/users/" + userID;
                        $scope.rate = setRatingAvailableOrNot();
                        getRating();
                        getReviews();
                        solicitorService.getSolicitorDescription(userID).then(function (result) {
                            var data = result.data;

                            if (data.code == 600) {
                                if (data.description != "" && data.description != undefined && data.description != null) {
                                    $scope.description = data.description;
                                } else {
                                    $scope.description = "Seems like this solicitor has not yet uploaded a description";
                                }
                            }
                        });
                        $scope.rateSolicitor = function (rate) {
                            if (action == 'accepted') {
                                clientService.rateSolicitor(userID, rate, bidID).then(function (result) {
                                    var data = result.data;

                                    if (data.code == 900) {
                                        SweetAlert.swal({
                                            title: "",
                                            text: "Thank you for your feedback",
                                            type: "success",
                                            confirmButtonColor: "#007AFF"
                                        }, function (isConfirmed) {
                                            getRating();
                                        });
                                    }
                                });
                            }
                        };

                        $scope.leaveReview = function (review, event) {
                            if (review != undefined && review != "" && review != null) {
                                clientService.reviewSolicitor(bidID, review).then(function (result) {
                                    var data = result.data;

                                    if (data.code == 900) {
                                        SweetAlert.swal({
                                            title: "",
                                            text: "Your review has been posted",
                                            type: "success",
                                            confirmButtonColor: "#007AFF"
                                        }, function (isConfirmed) {
                                            getReviews();
                                        });
                                    }
                                });
                            } else {
                                SweetAlert.swal({
                                    title: "Please fill the review box.",
                                    type: "warning",
                                    confirmButtonColor: "#007AFF"
                                });
                            }
                        };
                        $scope.ok = function (e) {
                            $uibModalInstance.close();
                            e.stopPropagation();
                        };
                        $scope.cancel = function (e) {
                            $uibModalInstance.dismiss();
                            e.stopPropagation();
                        };
                    }
                });
            };

            $scope.uploadFiles = function (request, files, invalidFiles) {
                // Upload some files
                angular.forEach(files, function (file) {
                    var doc = { name: file.name };
                    $scope.case.documentRequests[request].documents.push(doc);
                    file.upload = Upload.upload({
                        url: '/api/cases/' + $stateParams.caseID + '/docrequests/' + $scope.case.documentRequests[request].id + '/documents/',
                        data: {file: file}
                    }).then(function (response) {
                        file.result = response.data;
                    }, function (response) {
                        if (response.status > 0) {
                            console.log(response.status, ": ", response.data);
                            toaster.pop({
                                type: "error",
                                title: "Error uploading document '" + file.name + "'",
                                body: response.data
                            });
                        }
                    }, function (event) {
                        file.progress = Math.min(
                            100, 100 * event.loaded / event.target);
                    });
                });
                angular.forEach(invalidFiles, function (file) {
                    toaster.pop({
                        type: "error",
                        title: "Error uploading document '" + file.name + "'",
                        body: "You may only upload documents with a maximum size of 50Mb " +
                            "and of certain common file types, such as PDF documents, " +
                            "Microsoft Word documents and images"
                    });
                });
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

            $scope.download = function (request, filename) {
                caseService.downloadDocument($stateParams.caseID, request, filename);
            };

            $scope.deleteDocument = function (request, filename) {
                // Truncate long filenames
                var maxlength = 16;
                var shownFileName;
                if (filename.length > maxlength) {
                    shownFileName = filename.substring(0, maxlength) + "…";
                } else {
                    shownFileName = filename;
                }
                SweetAlert.swal({
                    title: "Delete '" + shownFileName + "'?",
                    type: "warning",
                    confirmButtonColor: "#007AFF",
                    confirmButtonText: "Delete",
                    showCancelButton: true
                }, function (isConfirmed) {
                    if (isConfirmed) {
                        var requestIndex;
                        for (var i = 0; i < $scope.case.documentRequests.length; ++i) {
                            if ($scope.case.documentRequests[i].id === request) {
                                requestIndex = i;
                                break;
                            }
                        }
                        caseService.deleteDocument($stateParams.caseID, request, filename)
                            .then(function (result) {
                                var docs = $scope.case.documentRequests[requestIndex].documents.filter(function (doc) {
                                    return doc.name !== filename;
                                });
                                $scope.case.documentRequests[requestIndex].documents = docs;
                            });
                    }
                });
            };
        };
        init();
    }
]);
