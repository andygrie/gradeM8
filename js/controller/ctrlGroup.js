angular.module("moduleGroup", ['ngMaterial'])
.controller("ctrlGroup", ["$scope", "$routeParams", "$location", "sData_pupilsByGroups", "sData_eventsByGroups", 
                            "sData_CUDHandler", "sData_allData", "sData_teaches", "sData_classes", "sData_pupilsByClass", "sData_participationsByEvent",
                function ($scope, $routeParams, $location, sData_pupilsByGroups, sData_eventsByGroups, 
                            sData_CUDHandler, sData_allData, sData_teaches, sData_classes, sData_pupilsByClass, sData_participationsByEvent) {

    $scope.idGradeGroup = $routeParams.idGradeGroup;
    $scope.data = {};
    $scope.data.displayModalEvent = false;
    $scope.data.displayModalPupil = false;
    $scope.data.displayModalEventDetail = false;
    $scope.classesSelected = false;
    $scope.colPupils = [];
    $scope.colClasses = [];
    $scope.colAdPupils = []; //Maybe [] because push() is called
    $scope.colSelectedClasses = [];
    $scope.colSelectedPupils = [];
    $scope.colParticipations = [];
    $scope.colEvents = [];

// Autocomplete
    $scope.auto = {};
    $scope.auto.selectedItem = null;
    $scope.auto.searchText = null;
    /**
     * Return the proper object when the append is called.
     */
    $scope.auto.transformChip = function transformChip(chip) {
      // If it is an object, it's already a known chip
      if (angular.isObject(chip)) {
        return chip;
      }

      // Otherwise, create a new one
      return { name: chip };
    }

    /**
     * Search for classes.
     */
    $scope.auto.querySearch = function querySearch (query) {
      var results = query ? $scope.colClasses.filter(createFilterFor(query)) : [];
      return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(paramClass) {
        return (paramClass.name.toLowerCase().indexOf(lowercaseQuery) === 0);
      };

    }
//Check
    $scope.check = {};

    $scope.check.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        }
        else {
          list.push(item);
        }
      };

    $scope.check.exists = function (item, list) {
    return list.indexOf(item) > -1;
    };

    $scope.check.isIndeterminate = function() {
        return ($scope.colSelectedPupils.length !== 0 &&
            $scope.colSelectedPupils.length !== $scope.colAdPupils.length);
    };

    $scope.check.isChecked = function() {
        return $scope.colSelectedPupils.length === $scope.colAdPupils.length;
    };

    $scope.check.toggleAll = function() {
        if ($scope.colSelectedPupils.length === $scope.colAdPupils.length) {
        $scope.colSelectedPupils = [];
        } else if ($scope.colSelectedPupils.length === 0 || $scope.colSelectedPupils.length > 0) {
        $scope.colSelectedPupils = $scope.colAdPupils.slice(0);
        }
    };

// Other Functions
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

    $scope.displayAddPupil = function(){
        $scope.switchModalPupil();
        $scope.loadClasses();
    }

    $scope.registerPupils = function(){
        var paramData = {
            idGradeGroup: $scope.idGradeGroup,
            pupils: $scope.colSelectedPupils
        }

        sData_CUDHandler.registerPupils(paramData).then(function(response){
            console.log(response);
            $scope.colPupils = sData_pupilsByGroups.data[$scope.idGradeGroup];
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
            $scope.classesSelected = true;
            console.log("successfully loaded Pupils of selected Classes");
            console.log(msg);
        }, function(msg){
            console.log("error loading pupils");
            console.log(msg);
        })
    }

    function loadPupilsOfClass(classnames, index, onDone, onError){
        sData_pupilsByClass.fillData({classname: classnames[index].name}).then(function(response){
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
        $scope.data.displayModalEventDetail = !$scope.data.displayModalEventDetail;
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