angular.module("moduleGroup", [])
.controller("ctrlGroup", ["$scope", "$routeParams", "$location", "sData_pupilsByGroups", "sData_eventsByGroups", "sData_CUDHandler", "sData_allData", "sData_teaches",
                function ($scope, $routeParams, $location, sData_pupilsByGroups, sData_eventsByGroups, sData_CUDHandler, sData_allData, sData_teaches) {

    $scope.idGradeGroup = $routeParams.idGradeGroup;
    $scope.data = {};
    $scope.data.displayModalEvent = false;
    $scope.data.displayModalPupil = false;
    $scope.colPupils = {};

    $scope.idGradeSubject = $scope.getSubjectOfGroup();
    sData_pupilsByGroups.fillData().then(function(response){
        $scope.colPupils = sData_pupilsByGroups.data[$scope.idGradeGroup];
    }, function(response){
        console.log("error loading pupils by groups: " + response);
    })
    sData_teaches.fillData({idGradeSubject: $scope.idGradeSubject}).then(function(response){
        $scope.teaches = findTeaches();
    }, function(response){
        console.log("error loading teaches: " + response);
    })
    $scope.colEvents = sData_eventsByGroups.data[$scope.idGradeGroup];
    
    
    /*
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
    */

    $scope.getSubjectOfGroup = function(){
        var retVal = null;
        var colGroups = sData_allData.data.groups;
        for(var i = 0; i < colGroups.length && retVal == null; i++)
        {
            if(colGroups[i].idGradeGroup = $scope.idGradeGroup)
                retVal = colGroups[i].idGradeSubject;
        }

        return retVal;
    }

    $scope.switchModalEvent = function(){
        $scope.data.displayModalEvent = !$scope.data.displayModalEvent; 
    }
    $scope.switchModalPupil = function(){
        $scope.data.displayModalPupil = !$scope.data.displayModalPupil;
    }
    $scope.navBack = function(){
        $location.path("/overview");
    }

    $scope.navToPupil = function(idPupil){
        $location.path("/pupil/" + idPupil + "/" + $scope.idGradeGroup);
    }

    $scope.insertNewEvent = function(){
        var data = {
            idGradeGroup : $scope.idGradeGroup, 
            fkTeaches : $scope.teaches.idTeaches, 
            eventDate: $scope.newEvent.eventDate, 
            eventDescription: $scope.newEvent.eventDescription
        };
        sData_CUDHandler.insertEvent(data).then(function(response){
            console.log("successfuly inserted event: " + response);

            var dataInner = {};
            dataInner.idGradeEvent = response.idGradeEvent;
            dataInner.colPupils = [];
            for(var i = 0; i < $scope.colPupils.length; i++)
            {
                dataInner.colPupils.push({
                    fkPupil: $scope.colPupils[i].idUser,
                    grade: 0,
                    abscent: 0
                });
            }

            sData_CUDHandler.insertParticipation(dataInner).then(function(responseData){
                console.log("successfully inserted participations");
            }, function(response){
                console.log("error inserting participations" + response);
            });

        }, function(response){
            console.log("error inserting event: " + response);
        });
    }

    function findTeaches(){
        var retVal = null;
        var colTeaches = sData_allData.data.teaches;
        for(var i = 0; i < colTeaches.length && retVal == null; i++)
        {
            if(colTeaches[i].fkGradeGroup = $scope.idGradeGroup)
                retVal = colTeaches[i];
        }

        return retVal;
    }
}]);