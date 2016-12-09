angular.module("moduleGroup", [])
.controller("ctrlGroup", ["$scope", "$routeParams", "$location", "sData_pupilsByGroups", "sData_eventsByGroups", 
                            "sData_CUDHandler", "sData_allData", "sData_teaches", "sData_classes", "sData_pupilsByClass", "sData_participationsByEvent",
                function ($scope, $routeParams, $location, sData_pupilsByGroups, sData_eventsByGroups, 
                            sData_CUDHandler, sData_allData, sData_teaches, sData_classes, sData_pupilsByClass, sData_participationsByEvent) {

    $scope.idGradeGroup = $routeParams.idGradeGroup;


    $scope.data = {};
    $scope.data.displayModalEvent = false;
    $scope.data.displayModalPupil = false;
    $scope.colPupils = {};
    $scope.colClasses = {};
    $scope.colAdPupils = []; //Maybe [] because push() is called
    $scope.colSelectedClasses = {};
    $scope.colSelectedPupils = [];
    $scope.colParticipations = [];
    $scope.colEvents = [];


                    $scope.show = true;

                    var groupname = function(){ var group;
                        sData_allData.data.groups.forEach(function(entry){
                        if(entry.idGradeGroup == $routeParams.idGradeGroup){

                            group = entry.name;
                        }
                    });
                        window.alert(group);
                    return group;};


                    $scope.breadcrumb = "Group - " + groupname();

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

    $scope.idGradeSubject = $scope.getSubjectOfGroup();
    sData_pupilsByGroups.fillData({idGradeGroup: $scope.idGradeGroup}).then(function(response){
        console.log(response);
        console.log(sData_pupilsByGroups.data);
        $scope.colPupils = sData_pupilsByGroups.data[$scope.idGradeGroup];
    }, function(response){
        console.log("error loading pupils by groups: " + response);
    })
    sData_teaches.fillData({idGradeSubject: $scope.idGradeSubject}).then(function(response){
        $scope.teaches = findTeaches();
    }, function(response){
        console.log("error loading teaches: " + response);
    })
    sData_eventsByGroups.fillData().then(function(response){
        $scope.colEvents = sData_eventsByGroups.data[$scope.idGradeGroup];
    }, function(response){
        console.log("error loading pupils by groups: " + response);
    })
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

    $scope.displayParticipationsOfEvent = function(paramEventId){
        $scope.switchModalEventDetail();
        $scope.loadParticipationsByEvent(paramEventId);
    }

    $scope.loadParticipationsByEvent = function(paramEventId) {
        sData_participationsByEvent.fillData({idGradeEvent: paramEventId}).then(function(response){
            console.log(response);
            $scope.colParticipations = sData_participationsByEvent.data;
        }, function(response){
            console.log(response);
        });
    }

    $scope.registerPupils = function(){
        var paramData = {
            idGradeGroup: $scope.idGradeGroup,
            pupils: $scope.colSelectedPupils
        }

        sData_CUDHandler.registerPupils(paramData).then(function(response){
            console.log(response);
            $scope.switchModalPupil();
        }, function(response){
            console.log(response);
        })
    }

    $scope.loadClasses = function(){
        sData_classes.fillData().then(function(response){
            console.log(response);
            $scope.colClasses = sData_classes.data;
        }, function(response){
            console.log("error filling classes: ");
            console.log(response);
        });
    }
    
    $scope.loadAdPupils = function(){
        loadPupilsOfClass($scope.colSelectedClasses, 0, function(msg){
            console.log("successfully loaded Pupils of selected Classes");
            console.log(msg);
        }, function(msg){
            console.log("error loading pupils");
            console.log(msg);
        })
    }

    function loadPupilsOfClass(classnames, index, onDone, onError){
        sData_pupilsByClass.fillData(classname[index]).then(function(response){
            for(var i = 0; i < response.length; i++)
            {
                $scope.colAdPupils.push(response[i]);
            }

            index++;
            if(index < classnames.length)
            {
                loadPupilsOfClass(classnames, index, onDone, onError);
            }
            else
            {
                onDone($scope.colAdPupils);
            }
        }, onError)
    }

    $scope.switchModalEvent = function(){
        $scope.data.displayModalEvent = !$scope.data.displayModalEvent; 
    }
    $scope.switchModalPupil = function(){
        $scope.data.displayModalPupil = !$scope.data.displayModalPupil;
    }
    $scope.switchModalEventDetail = function(){

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
                $scope.switchModalEvent();
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