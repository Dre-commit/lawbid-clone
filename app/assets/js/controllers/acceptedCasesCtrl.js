'use strict';

function acceptedCasesCtrl(
    $scope,
    caseService
) {
    caseService.fetchAcceptedCases().then(function (cases) {
        $scope.cases = cases;
    })
}

app.controller("AcceptedCasesCtrl", [
    "$scope",
    "caseService",
    acceptedCasesCtrl
]);