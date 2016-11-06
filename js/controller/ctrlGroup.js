angular.module("moduleGroup", [])
.controller("ctrlGroup", ["$scope", "$routeParams", "$location", //"sData_pupilsByGroups", "sData_eventsByGroups", "sData_CUDHandler", "sData_allData",
                function ($scope, $routeParams, $location) {
    $scope.idGradeGroup = $routeParams.idGradeGroup;
    //$scope.colPupils = sData_pupilsByGroups.data[idGradeGroup];
    //$scope.colEvents = sData_eventsByGroups.data[idGradeGroup];
    $scope.teaches = findTeaches();
    

    $scope.colPupils = [
        {idUser: 1, fkClass: 1, forename: "Bört", surname: "enson", email: "on@pisse.ru", password: "1m4G0d"},
        {idUser: 2, fkClass: 1, forename: "Üx", surname: "Finanzminister", email: "wüllst@aGöld.at", password: "hypo4SaVin"},
        {idUser: 3, fkClass: 1, forename: "Andreas", surname: "Grißeszlera", email: "scheißLackna@hell.666", password: "StehstDuAuchAufSpeedmetal?"},
    ];

    $scope.colEvents = [
        {idGradeEvent: 1, fkTeaches: 1, eventDate: "1.1.2017", eventDescription: "SUA"},
        {idGradeEvent: 2, fkTeaches: 1, eventDate: "1.2.2017", eventDescription: "Abgabe1"},
        {idGradeEvent: 3, fkTeaches: 1, eventDate: "1.3.2017", eventDescription: "Abgabe2"},
    ];



    $scope.navBack = function(){
        $location.path("/overview");
    }

    $scope.navToPupil = function(idPupil){
        $location.path("/pupil/" + idPupil + "/" + $scope.idGradeGroup);
    }

    $scope.insertNewEvent = function(){
        console.log("function commented out");
        /*
        var data = {
            idGradeGroup : $scope.idGradeGroup, 
            fkTeaches : $scope.teaches.idTeaches, 
            eventDate: $scope.newEvent.eventDate, 
            eventDescription: $scope.newEvent.eventDescription
        };
        sData_CUDHandler.insertEvent(function(response){
            console.log("successfuly inserted event: " + response);
        }, function(response){
            console.log("error inserting event: " + response);
        }, data);
        */
    }

    function findTeaches(){
        var retVal = 1;

        /*
        var colTeaches = sData_allData.data.teaches;
        for(var i = 0; i < colTeaches.length; i++)
        {
            if(colTeaches[i].fkGradeGroup = $scope.idGradeGroup)
                retVal = colTeaches[i];
        }
        */

        return retVal;
    }
}]);