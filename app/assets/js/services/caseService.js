/**
 * Created by Admin on 5/25/2016.
 */
(function () {
    var caseService = function ($http, $state, $cookies) {
        this.getCaseUserID = function (caseID) {
            var promise = $http({
                url: "/api/caseCreator",
                method: "POST",
                data: JSON.stringify({
                    CaseID: caseID
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache"
                }
            }, function (data, status, headers, config) {
                if (data.code === 700) {
                    return data;
                } else {
                    return null;
                }
            }, function (data, status, headers, config) {

            });

            return promise;
        };


        this.updateTitle = function (CaseID, NewTitle) {
            var promise = $http({
                url: '/api/updateTitle',
                method: "POST",
                data: JSON.stringify({
                    CaseID: CaseID,
                    NewTitle: NewTitle
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            }, function(data, status, headers, config) {

            }, function(data, status, headers, config) {

            });

            return promise;
        };


        this.updateArea = function (CaseID, NewArea) {
            var promise = $http({
                url: '/api/updateArea',
                method: "POST",
                data: JSON.stringify({
                    CaseID: CaseID,
                    NewArea: NewArea
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            }, function(data, status, headers, config) {

            }, function(data, status, headers, config) {

            });

            return promise;
        };

        this.getSolicitorForCase = function (userid) {
            var solicitor = $http({
                url: "/api/getAcceptedSolicitorDetails",
                method: "POST",
                data: JSON.stringify({
                    UserID: userid
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache"
                }
            }, function (data, status, headers, config) {
                if (data.code === 700) {
                    return data.solicitor;
                } else {
                    return null;
                }
            }, function (data, status, headers, config) {

            });

            return solicitor;
        };

        this.getInformationOfACaseForSolicitor = function (caseID) {
            var promise = $http({
                url: "/api/getCaseInfo",
                method: "POST",
                data: JSON.stringify({
                    CaseID: caseID
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

        this.getInformationOfACaseForClient = function (caseID) {
            var promise = $http({
                url:  "/api/getUserCaseInfo",
                method: "POST",
                data: JSON.stringify({
                    CaseID: caseID
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

        this.fetchQuestionsAndAnswers = function (caseID) {
            var promise = $http({
                url: "/api/fetchQandA",
                method: "POST",
                data: JSON.stringify({
                    CaseID: caseID
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


        this.createInterestedRelation = function (CaseID, FirstName, Interested) {
            var promise = $http({
                url: "/api/createInterestedRelation",
                method: "POST",
                data: JSON.stringify({
                    CaseID: CaseID,
                    FirstName: FirstName,
                    Interested: Interested
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

        this.placeBid = function (bid, PostedByID, CaseTitle) {
            var promise = $http({
                url: "/api/createBid",
                method: "POST",
                data: JSON.stringify({
                    bid: bid,
                    PostedByID: PostedByID,
                    CaseTitle: CaseTitle
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

        this.askQuestion = function (CaseID, Message, PostedByID, CaseTitle) {
            var promise = $http({
                url: "/api/createAskInfo",
                method: "POST",
                data: JSON.stringify({
                    CaseID: CaseID,
                    Message: Message,
                    PostedByID: PostedByID,
                    CaseTitle: CaseTitle
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

        this.allCaseTypes = function (caseData) {
            var types = caseData.ExtraTypes;
            if (types === "") {
                types = [];
            } else {
                types = types.split(",");
            }
            types.unshift(caseData.Type);
            return types;
        }

        this.allCaseTypesString = function (caseData) {
            return this.allCaseTypes(caseData).join(", ");
        }

        this.fetchFeaturedCases = function (UserID) {
            var promise = $http({
                url: "/api/fetchFeaturedCases",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache"
                }
            }, function (data, status, headers, config) {

            }, function (data, status, headers, config) {

            });

            return promise;
        };

        this.fetchAcceptedCases = function () {
            var caseService = this;
            return $http({
                url: "/api/acceptedCases",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache"
                }
            }).then(function (res) {
                var cases = res.data.acceptedCases;
                cases.forEach(function (caseData) {
                    caseData.AllTypes =
                        caseService.allCaseTypesString(caseData);
                })
                return cases;
            })
        }

        this.markCaseAsSeen = function(caseID) {
            var promise = $http({
                url: '/api/markCaseAsSeen',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache"
                },
                data: JSON.stringify({ caseID: caseID })
            }, function (data, status, headers, config) {

            }, function (data, status, headers, config) {

            });
        }

        this.containsPersonalDetails = function (str) {
            var emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/;
            var telephoneRegex = /(\+44\ ?|0)?(\d\ ?){9,10}/;
            var urlRegex = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/;
            return (
                emailRegex.test(str)
                    || telephoneRegex.test(str)
                    || urlRegex.test(str)
            );
        }

        this.containsPrice = function (str) {
            var priceRegex = /£[0-9,]+(\.[0-9]+)?/
            return priceRegex.test(str)
        }

        this.caseTypeIconClass = function (category) {
            switch (category) {
                case "Employment":
                    return "fa fa-briefcase";
                case "Immigration":
                    return "fa fa-plane";
                case "Personal Injury":
                    return "fa fa-ambulance";
                case "Litigation":
                    return "fa fa-balance-scale";
                case "Property":
                    return "fa fa-home";
                case "Tax Services":
                    return "fa fa-pound-sign";
                case "Business matters":
                    return "fa fa-building";
                case "Crime/Motoring offences":
                    return "fa fa-car";
                case "Family":
                    return "fa fa-home";
                case "Debt":
                    return "fa fa-credit-card";
                case "Corporate":
                    return "fa fa-user-tie";
                case "Wills and Probate":
                    return "fa fa-pen-square";
            }
        }

        this.postDocumentRequest = function (caseID, message) {
            return $http({
                url: '/api/cases/' + caseID + '/docrequests/',
                method: 'POST',
                data: {
                    message: message
                }
            });
        };

        this.getDocumentRequests = function (caseID) {
            return $http({
                url: '/api/cases/' + caseID + '/docrequests/',
                method: 'GET'
            }).then(function (result) {
                return result.data;
            });
        };

        this.getDocuments = function (caseID, requestID) {
            return $http({
                url: '/api/cases/' + caseID + '/docrequests/' + requestID + '/documents/',
                method: 'GET',
            }).then(function (result) {
                return result.data;
            });
        };

        this.openDocument = function (caseID, requestID, doc) {
            return $http({
                url: '/api/cases/' + caseID + '/docrequests/' + requestID + '/documents/' + doc,
                method: "GET",
                responseType: "blob"
            }).then(function (result) {
                var mimetype = result.headers()["content-type"];
                var blob = result.data;
                var data = window.URL.createObjectURL(blob);
                return { url: data, mimetype: mimetype, name: doc };
            });
        };

        this.downloadDocument = function (caseID, requestID, doc) {
            return $http({
                url: '/api/cases/' + caseID + '/docrequests/' + requestID + '/documents/' + doc,
                method: "GET",
                responseType: "blob"
            }).then(function (result) {
                var mimetype = result.headers()["content-type"];
                var blob = result.data;

                // IE compatibility
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(blob);
                    return;
                }

                var data = window.URL.createObjectURL(blob);
                var link = document.createElement("a");
                link.href = data;
                link.download = doc;
                link.click();
                setTimeout(function () {
                    window.URL.revokeObjectURL(data);
                }, 100);
            });
        };

        this.deleteDocument = function (caseID, requestID, doc) {
            return $http({
                url: '/api/cases/' + caseID + '/docrequests/' + requestID + '/documents/' + doc,
                method: "DELETE",
            });
        };

    };

    angular.module("app").service("caseService", caseService);

}());
