angular.module("modulePupil", [])
.controller("ctrlPupil", ["$scope", "$routeParams", "sData_participationsByPupil", "sData_CUDHandler", "sData_allData", 
                            "sData_notesByPupil", "sData_noteHistory", "sData_participationHistory", "sData_eventsByGroups",
                function ($scope, $routeParams, sData_participationsByPupil, sData_CUDHandler, sData_allData, 
                            sData_notesByPupil, sData_noteHistory, sData_participationHistory, sData_eventsByGroups) {
                    $scope.show = true;
    $scope.data = {};
    $scope.formData = {};
    $scope.data.idPupil = $routeParams.idPupil;
    $scope.data.idGradeGroup = $routeParams.idGradeGroup;
    $scope.data.teaches = findTeaches();
    $scope.data.displayModalEvent = false;
    $scope.data.displayModalNote = false;
    $scope.data.displayModalGrade = false;

    $scope.partHistory = {};
    $scope.noteHistory = {};
    $scope.partHistory.colParticipation = [];
    $scope.noteHistory.colNotes = [];

    $scope.data.currentSettingstab = "Period";
    $scope.data.displayModalSettings = false;

    $scope.data.colNoteHistory = [];
    $scope.data.colParticipationHistroy = [];
    $scope.data.ungradedEvents = [];
    $scope.data.gradedEvents = [];
    $scope.data.ungradedParticipations = [];
    $scope.data.gradedParticipations = [];
    $scope.data.colEvents = findEvents();

    $scope.grade = {};
    $scope.grade.gradeOptions = [
        {grade: -1, description: "ungraded"},
        {grade: 0, description: "abscent"},
        {grade: 1, description: "1"},
        {grade: 2, description: "2"},
        {grade: 3, description: "3"},
        {grade: 4, description: "4"},
        {grade: 5, description: "5"}
    ];

    function generateBreadcrumb(){ 
        var group;
        sData_allData.data.groups.forEach(function(entry){
            if(entry.idGradeGroup == $routeParams.idGradeGroup){

                group = entry.name;
            }
        });
        var pupil;
        sData_allData.data.pupils.forEach(function(entry){
            if(entry.idPupil == $routeParams.idPupil){
                pupil = entry.name;
            }
        });


        return "Group-"+group+"-Pupil-"+pupil;
    };

    $scope.breadcrumb = generateBreadcrumb();




    var dataInit = {idPupil: $scope.data.idPupil, 
                idTeaches: $scope.data.teaches.idTeaches};
    sData_participationsByPupil.fillData(dataInit).then(function(response){
        console.log("successfuly loaded participations");
        $scope.data.colParticipations = sData_participationsByPupil.data;
        setGradedAndUngraded();
    }, function(response){
        console.log("error loading participations");
    });

    sData_notesByPupil.fillData(dataInit).then(function(response){
        console.log("successfully loaded notes");
        $scope.data.colNotes = sData_notesByPupil.data;
    }, function(response){
        console.log("error loading notes: " + response);
    });

    
    $scope.displayNoteHistory = function(paramIdNote) {
        $scope.switchModalNoteHistory();
        $scope.loadNoteHistory();
    }

    $scope.displayParticipationHistory = function(paramIdParticipation)
    {
        $scope.switchModalParticipationHistory();
        $scope.loadParticipationHistory();
    }

    $scope.loadNoteHistory = function(paramIdNote){
        sData_noteHistory.fillData(paramIdNote).then(function(response){
            console.log(response);
            $scope.noteHistory.colNotes = sData_noteHistory.data;
        }, function(response){
            console.log(response);
        });
    }

    $scope.loadParticipationHistory = function(paramIdParticipation){
        sData_participationHistory.fillData(paramIdParticipation).then(function(response){
            console.log(response);
            $scope.partHistory.colParticipation = sData_participationHistory.data;
        }, function(response){
            console.log(response);
        });
    }

    $scope.switchModalEvent = function(){
        $scope.data.displayModalEvent = !$scope.data.displayModalEvent;
    }
    $scope.switchModalNote = function(){
        $scope.data.displayModalNote = !$scope.data.displayModalNote;
    }
    $scope.switchModalGrade = function(){
        $scope.data.displayModalGrade = !$scope.data.displayModalGrade;
    }
    
    $scope.switchModalSettings = function(){
        $scope.data.displayModalSettings = !$scope.data.displayModalSettings;
    }

    $scope.setSettingTabToPeriod = function () {
        window.alert($scope.data.currentSettingstab);
        $scope.data.currentSettingstab = "Period";
    }

    $scope.setSettingTabToWeekdays = function () {
        window.alert($scope.data.currentSettingstab);
        $scope.data.currentSettingstab = "Weekdays";
    }

    $scope.switchModalNoteHistory = function() {

    }
    $scope.switchModalParticipationHistory = function() {
        
    }

    $scope.getTotalGrade = function(){
        var gradesSum = 0;

        for(var i = 0; i < $scope.data.gradedParticipations.length; i++)
        {
            gradesSum += parseInt($scope.data.gradedParticipations[i].grade);
        }
        return gradesSum / $scope.data.gradedParticipations.length;
    }

    $scope.insertNewNote = function(){

        var data = {
            idTeaches: $scope.data.teaches.idTeaches,
            idPupil: $scope.data.idPupil,
            note: $scope.newNote.note
        }
        console.log(data);

        sData_CUDHandler.insertNote(data).then(function(responseData){
            console.log("successfuly inserted note: " + responseData);
            $scope.data.colNotes.push(responseData);
            $scope.switchModalNote();
        }, function(response){
            console.log("error inserting note: " + response);
        });
    }

    $scope.insertNewEvent = function(){
        var data = {
            idGradeGroup : $scope.data.idGradeGroup, 
            fkTeaches : $scope.data.teaches.idTeaches, 
            eventDate: $scope.newEvent.eventDate, 
            eventDescription: $scope.newEvent.eventDescription
        };
        sData_CUDHandler.insertEvent(data).then(function(response){
            console.log("successfuly inserted event: " + response);

            var dataInner = {};
            dataInner.idGradeEvent = response.idGradeEvent;
            dataInner.colPupils = [{
                    fkPupil: parseInt($scope.data.idPupil),
                    grade: -1
                }];
            sData_CUDHandler.insertParticipation(dataInner).then(function(responseData){
                console.log("successfully inserted participations, now should follow response data <.<");
                console.log(responseData);

                $scope.data.ungradedEvents.push(response);
                $scope.data.ungradedParticipations.push(responseData[0]);
                $scope.data.colParticipations.push(responseData[0]);

                $scope.switchModalEvent();
            }, function(response){
                console.log("error inserting participations" + response);
            })

        }, function(response){
            console.log("error inserting event: " + response);
        });
    }

    $scope.toggleView = function(){
        $scope.data.showOverview = !$scope.data.showOverview;
    }

    $scope.getEventOfParticipation = function(id){
        var retVal = {};
        var found = false;
        for(var i = 0; i < $scope.data.gradedEvents.length && !found; i++)
        {
            if($scope.data.gradedEvents[i].idGradeEvent == id)
            {
                console.log("found");
                console.log(i);
                console.log($scope.data.gradedEvents[i]);
                retVal = $scope.data.gradedEvents[i];
                found = true;
            }
        }
        return retVal;
    }

    $scope.viewGrade = function(event){
        var participation = getParticipationOfEvent(event.idGradeEvent);
        console.log(participation);
        $scope.data.eventToBeGraded = event;
        $scope.data.participationToBeConfigured = participation;

        $scope.switchModalGrade();
        $scope.formData.grade = participation.grade;
    }

    $scope.submitGrade = function(){
        if($scope.formData.grade != $scope.data.participationToBeConfigured.grade)
        {
            if($scope.formData.grade == 0 &&
                $scope.data.participationToBeConfigured.grade != 0)
            {
                moveEventToUngraded($scope.data.eventToBeGraded, $scope.data.participationToBeConfigured);
            } 
            else
            {
                moveEventToGraded($scope.data.eventToBeGraded, $scope.data.participationToBeConfigured);
            }
                
            $scope.data.participationToBeConfigured.grade = $scope.formData.grade;
            var data = {idParticipation: $scope.data.participationToBeConfigured.idParticipation, 
                fkGradeEvent: $scope.data.participationToBeConfigured.fkGradeEvent,
                fkPupil: $scope.data.participationToBeConfigured.fkPupil,
                grade: $scope.formData.grade};
            
            console.log(data);
            sData_CUDHandler.putParticipation(data).then(function(response){
                console.log(response);
                //moveEventToGraded($scope.data.eventToBeGraded);
                $scope.switchModalGrade();
            }, function(response){
                console.log("error trying to update participation: " + response)
            });
        }
    }

    function moveEventToUngraded(event, participation){
        var found = false;
        var lEvent = $scope.data.gradedEvents.length;
        var lPart = $scope.data.gradedParticipations.length;
        
        for(var i = 0; i < lEvent && !found; i++)
        {
            if($scope.data.gradedEvents[i].idGradeEvent == event.idGradeEvent)
            {
                $scope.data.ungradedEvents.push($scope.data.gradedEvents[i]);
                $scope.data.gradedEvents.splice(i,1);
                found = true;
            }
            
        }

        found = false
        for(var i = 0; i < lPart && !found; i++)
        {
            if($scope.data.gradedParticipations[i].idParticipation == participation.idParticipation)
            {
                $scope.data.gradedParticipations[i].grade = $scope.formData.grade;

                $scope.data.ungradedParticipations.push($scope.data.gradedParticipations[i]);
                $scope.data.gradedParticipations.splice(i,1);
                found = true;
            }
        }
    }

    function moveEventToGraded(event, participation){
        var found = false;
        var lEvent = $scope.data.ungradedEvents.length;
        var lPart = $scope.data.ungradedParticipations.length;
        
        for(var i = 0; i < lEvent && !found; i++)
        {
            if($scope.data.ungradedEvents[i].idGradeEvent == event.idGradeEvent)
            {
                $scope.data.gradedEvents.push($scope.data.ungradedEvents[i]);
                $scope.data.ungradedEvents.splice(i,1);
                found = true;
            }
            
        }

        found = false
        for(var i = 0; i < lPart && !found; i++)
        {
            if($scope.data.ungradedParticipations[i].idParticipation == participation.idParticipation)
            {
                $scope.data.ungradedParticipations[i].grade = $scope.formData.grade;

                $scope.data.gradedParticipations.push($scope.data.ungradedParticipations[i]);
                $scope.data.ungradedParticipations.splice(i,1);
                found = true;
            }
        }
    }

    function getParticipationOfEvent(id) {
        var retVal = null;
        for(var i = 0; i < $scope.data.colParticipations.length && retVal == null; i++)
        {
            if($scope.data.colParticipations[i].fkGradeEvent == id &&
                $scope.data.colParticipations[i].fkPupil == $scope.data.idPupil)
                retVal = $scope.data.colParticipations[i];
        }
        return retVal;
    }

    function setGradedAndUngraded(){
        $scope.data.ungradedEvents = [];
        $scope.data.gradedEvents = [];
        var found = 0;

        for(var i = 0; i < $scope.data.colEvents.length; i++)
        {
            found = 0;
            for(var j = 0; j < $scope.data.colParticipations.length; j++)
            {
                if($scope.data.colEvents[i].idGradeEvent == 
                    $scope.data.colParticipations[j].fkGradeEvent 
                    && $scope.data.colParticipations[j].fkPupil == $scope.data.idPupil)
                {
                    if($scope.data.colParticipations[j].grade < 1)
                    {
                        $scope.data.ungradedParticipations.push($scope.data.colParticipations[j]);
                        $scope.data.ungradedEvents.push($scope.data.colEvents[i]);
                    }
                    else
                    {
                        $scope.data.gradedParticipations.push($scope.data.colParticipations[j]);
                        $scope.data.gradedEvents.push($scope.data.colEvents[i]);
                    }

                    found = 1;
                }
            }

            /* falls keine participation
            if(found == 0 )
            {
                $scope.data.ungradedEvents.push($scope.data.colEvents[i]);
            }
            */
        }
    }

    function findTeaches(){
        var retVal = null;

        var colTeaches = sData_allData.data.teaches;
        for(var i = 0; i < colTeaches.length && retVal == null; i++)
        {
            if(colTeaches[i].fkGradeGroup == $scope.data.idGradeGroup)
                retVal = colTeaches[i];
        }

        return retVal;
    }

    function findEvents(){
        /*var retVal = [];

        var colEvents = sData_allData.data.events;
        for(var i = 0; i < colEvents.length; i++)
        {
            if(colEvents[i].idGradeGroup = $scope.data.idGradeGroup)
                retVal.push(colEvents[i]);
        }

        return retVal;
        */

        return sData_eventsByGroups.data[$scope.idGradeGroup];
    }
}]);