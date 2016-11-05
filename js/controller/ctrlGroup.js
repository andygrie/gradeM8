angular.module("moduleGroup", [])
.controller("ctrlGroup", ["$scope", "$routeParams", //"sData_pupilsByGroups", "sData_eventsByGroups",
                function ($scope, $routeParams) {
    $scope.idGradeGroup = $routeParams.idGradeGroup;
    //$scope.colPupils = sData_pupilsByGroups.data[idGradeGroup];
    //$scope.colEvents = sData_eventsByGroups.data[idGradeGroup];

    $scope.colPupils = [
        {idUser: 1, fkClass: 1, forename: "Bört", surname: "enson", email: "on@pisse.ru", password: "1m4G0d"},
        {idUser: 2, fkClass: 1, forename: "Üx", surname: "Finanzminister", email: "wüllst@aGöld.at", password: "hypo4SaVin"},
        {idUser: 3, fkClass: 1, forename: "Andreas", surname: "Grißeszlera", email: "scheißLackna@hell.666", password: "StehstDuAuchAufSpeedmetal?"},
    ];

    $scope.colEvents = [
        {idGradeEvent: 1, fkTeaches: 1, eventDate: "1.1.2017", eventDescription: "SUA"},
        {idGradeEvent: 2, fkTeaches: 1, eventDate: "1.2.2017", eventDescription: "Abgabe1"},
        {idGradeEvent: 3, fkTeaches: 1, eventDate: "1.3.2017", eventDescription: "Abgabe2"},
    ]
    $scope.navBack = function(){
        $window.history.back();
    }
}]);