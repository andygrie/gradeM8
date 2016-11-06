angular.module("modulePupil", [])
.controller("ctrlPupil", ["$scope", "$routeParams", //"sData_participationsByPupil", "sData_CUDHandler", "sData_allData",
                function ($scope, $routeParams) {
    $scope.data = {};
    $scope.formData = {};
    $scope.data.idPupil = $routeParams.idPupil;
    $scope.data.idGradeGroup = $routeParams.idGradeGroup;
    $scope.data.teaches = findTeaches();

    $scope.data.ungradedEvents = [];
    $scope.data.gradedEvents = [];

    /*
    $scope.data.colEvents = findEvents();
    sData_participationsByPupil.fillData(function(response){
        console.log("successfuly loaded participations");
        $scope.data.colParticipations = sData_participationsByPupil.data;
    }, function(response){
        console.log("error loading participations");
    }, {idPupil: $scope.data.idPupil, idTeaches: $scope.data.teaches.idTeaches});
    */

    $scope.data.colEvents = [
        {idGradeEvent: 1, 
            idGradeGroup: $scope.data.idGradeGroup, 
            fkTeaches: $scope.data.teaches.idTeaches, 
            eventDate: "01.01.2016", 
            eventDescription: "D-Test"},
        {idGradeEvent: 2, 
            idGradeGroup: $scope.data.idGradeGroup, 
            fkTeaches: $scope.data.teaches.idTeaches, 
            eventDate: "01.01.2016", 
            eventDescription: "AM-Test"}
    ]

    $scope.data.colParticipations = [
        {idParticipation: 1,
            fkGradeEvent: 1,
            fkPupil: $scope.data.idPupil,
            grade: 4,
            abscent: 0},
        {idParticipation: 2,
            fkGradeEvent: 2,
            fkPupil: $scope.data.idPupil,
            grade: 0,
            abscent: 0},
    ]

    setGradedAndUngraded();

    $scope.viewGrade = function(event){
        var participation = getParticipationOfEvent(event.idGradeEvent);
        $scope.data.eventToBeGraded = event;
        $scope.data.participationToBeConfigured = participation;

        $scope.formData.grade = participation.grade;
        $scope.formData.abscence = participation.abscent;
    }

    $scope.submitGrade = function(){
        console.log($scope.formData.grade);
        if($scope.formData.abscence != $scope.data.participationToBeConfigured.abscent ||
           $scope.formData.grade != $scope.data.participationToBeConfigured.grade)
        {
            moveEventToGraded($scope.data.eventToBeGraded);
            /*
            sData_CUDHandler.putParticipation(function(response){
                console.log(response);
                moveEventToGraded($scope.data.eventToBeGraded);
            }, function(response){
                console.log("error trying to update participation: " + response)
            }, {idParticipation: $scope.data.participationToBeConfigured.idParticipation, 
                fkGradeEvent: $scope.data.participationToBeConfigured.fkGradeEvent,
                fkPupil: $scope.data.participationToBeConfigured.fkPupil,
                grade: $scope.formData.grade,
                abscent: $scope.formData.abscence});
            */
        }
    }

    function moveEventToGraded(event){
        for(var i = 0; i < $scope.data.ungradedEvents.length; i++)
        {
            if($scope.data.ungradedEvents[i].idGradeEvent == event.idGradeEvent)
            {
                $scope.data.ungradedEvents = $scope.data.ungradedEvents.splice(i, 1);
            }
        }
    }

    function getParticipationOfEvent(id) {
        var retVal;
        for(var i = 0; i < $scope.data.colParticipations.length; i++)
        {
            if($scope.data.colParticipations[i].fkGradeEvent == id)
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
                    $scope.data.colParticipations[j].fkGradeEvent)
                {
                    if(angular.equals($scope.data.colParticipations[j].abscent, 0) && 
                        angular.equals($scope.data.colParticipations[j].grade, 0))
                    {
                        $scope.data.ungradedEvents.push($scope.data.colEvents[i]);
                    }
                    else
                    {
                        $scope.data.gradedEvents.push($scope.data.colEvents[i]);
                    }

                    found = 1;
                }
            }

            if(found == 0)
            {
                $scope.data.ungradedEvents.push($scope.data.colEvents[i]);
            }
        }
    }

    function findTeaches(){
        var retVal = 1;

        /*
        var colTeaches = sData_allData.data.teaches;
        for(var i = 0; i < colTeaches.length; i++)
        {
            if(colTeaches[i].fkGradeGroup = $scope.data.idGradeGroup)
                retVal = colTeaches[i];
        }
        */

        return retVal;
    }

    function findEvents(){
        var retVal = [];

        /*
        var colEvents = sData_allData.data.events;
        for(var i = 0; i < colEvents.length; i++)
        {
            if(colEvents[i].idGradeGroup = $scope.data.idGradeGroup)
                retVal.push(colEvents[i]);
        }
        */

        return retVal;
    }
}]);