'use strict';
app.controller('MyCasesCtrl', ['$scope', '$http', '$cookies', 'clientService', 'caseService',
function ($scope, $http, $cookies, clientService, caseService) {
    var init = function(){
        var data;

        $scope.chartConfig = {
            chart: {
                type: 'bar'
            },
            series: [{
                data: [10, 15, 12, 8, 7],
                id: 'series1'
            }],
            title: {
                text: 'Hello'
            }
        };

        clientService.getCasesForClient().then(function(result){
            data = result.data;

            if(data.code === 700) {
                if(data.cases.length > 0){
                    $scope.nodata = false;
                    $scope.cases = data.cases;
                    $scope.cases.forEach(function(theCase, index){
                        theCase.Bids.forEach(function(bid){
                            if(bid.Accepted == 1){
                                caseService.getSolicitorForCase(bid.UserID).then(function(solicitor){
                                    $scope.cases[index].acceptedSolicitor = solicitor.data.solicitor;
                                });
                            }
                        });
                        theCase.description = theCase.HTMLDescription || theCase.Description;
                    });
                }else{
                    $scope.nodata = true;
                }
            }
        });

        $scope.getArea = function(number){
            number = Math.ceil(number);
            if (number == 1500) {
                number = "Nationwide";
            }
            else {
                number += " miles";
            }
            return number ;
        };

        $scope.fetchQuestionsStats = function(questionsArray){
            var questionsStats = {},
                number = 0,
                answered = 0,
                pending = 0;

            if(questionsArray && questionsArray.length != 0){
                questionsArray.forEach(function(question){
                    if(question.Answered == 1) {
                        answered++;
                    }
                    if(question.Answered == 0) {
                        pending++;
                    }
                });
            }
            number = questionsArray.length;
            questionsStats.number = number;
            questionsStats.answered = answered;
            questionsStats.pending = pending;

            return questionsStats;
        };

        $scope.fetchStats = function(bidsArray){
            var highest = 0,
                sum = 0,
                lowest = Number.MAX_VALUE,
                stats;
            stats = {};

            if(bidsArray.length != 0){
                bidsArray.forEach(function(bid){
                    if(bid.Value > highest) {
                        highest = bid.Value;
                    }
                    if(bid.Value < lowest) {
                        lowest = bid.Value;
                    }
                    sum += bid.Value;
                });
                stats.highest = highest;
                stats.lowest = lowest;
                stats.average = sum/bidsArray.length;
            } else {
                stats.highest = 0;
                stats.lowest = 0;
                stats.average = 0;
            }
            return stats;
        };
    };

    init();
}]);
