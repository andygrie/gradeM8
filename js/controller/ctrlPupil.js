angular.module("modulePupil", [])
    .controller("ctrlPupil", ["$scope", "$routeParams","$location", "sData_participationsByPupil", "sData_CUDHandler", "sData_allData",
        "sData_notesByPupil", "sData_noteHistory", "sData_participationHistory", "sData_eventsByGroups", "$mdDialog","sData_authenticate",
        function ($scope, $routeParams,$location, sData_participationsByPupil, sData_CUDHandler, sData_allData,
                  sData_notesByPupil, sData_noteHistory, sData_participationHistory, sData_eventsByGroups, $mdDialog, sData_authenticate) {

            if(!sData_authenticate.isAuthenticated())
            {
                $location.path("/");
            }

            $scope.show = true;
            $scope.data = {};
            $scope.formData = {};
            $scope.data.idPupil = $routeParams.idPupil;
            $scope.data.idGradeGroup = $routeParams.idGradeGroup;
            $scope.data.teaches = findTeaches();
            $scope.data.displayModalEvent = false;
            $scope.data.displayModalNote = false;
            $scope.data.displayModalGrade = false;

            $scope.data.displayModalUpdateNote = false;

            $scope.state = {};
            $scope.state.awaitingParticipationData = true;

            $scope.data.currentSettingstab = "Period";
            $scope.data.displayModalSettings = false;


            $scope.data.ungradedEvents = [];
            $scope.data.gradedEvents = [];
            $scope.data.ungradedParticipations = [];
            $scope.data.gradedParticipations = [];
            $scope.data.colEvents = [];

            $scope.showAddEventDialog = function (ev) {
                $mdDialog.show({
                    controller: 'AddEventControllerSinglePupil',
                    templateUrl: '../../templates/styled_modal_AddEvent.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };

            $scope.showAddNoteDialog = function (ev) {
                $mdDialog.show({
                    controller: 'AddNoteController',
                    templateUrl: '../../templates/styled_modal_AddNote.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };

            function generateBreadcrumb() {
                var group;
                sData_allData.data.groups.forEach(function (entry) {
                    if (entry.idGradeGroup == $routeParams.idGradeGroup) {

                        group = entry.name;
                    }
                });
                var pupil;
                sData_allData.data.pupils.forEach(function (entry) {
                    if (entry.fkUser == $routeParams.idPupil) {
                        pupil = entry.forename + " " + entry.surname;
                    }
                });
                return group + " - " + pupil;
            };

            $scope.generatedBreadcrumb = generateBreadcrumb();
            $scope.breadcrumb = $scope.generatedBreadcrumb + " - Overview";
            $scope.status = '  ';

            $scope.showTabDialog = function (ev) {
                $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: '../../templates/settings_Modal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };

            var dataInit = {
                idPupil: $scope.data.idPupil,
                idTeaches: $scope.data.teaches.idTeaches
            };

            sData_eventsByGroups.fillData({idGradeGroup: $scope.data.idGradeGroup}).then(function (outerResponse) {
                console.log("success fetching events");
                $scope.data.colEvents = sData_eventsByGroups.data;

                sData_participationsByPupil.fillData(dataInit).then(function (response) {
                    console.log("successfuly loaded participations");
                    $scope.data.colParticipations = sData_participationsByPupil.data;
                    setGradedAndUngraded();
                    $scope.state.awaitingParticipationData = false;
                }, function (response) {
                    console.log("error loading participations");
                    $scope.state.awaitingParticipationData = false;
                });
            }, function (response) {
                console.log("error fetching events");
                $scope.state.awaitingParticipationData = false;
            })

            sData_notesByPupil.fillData(dataInit).then(function (response) {
                console.log("successfully loaded notes");
                console.log(sData_notesByPupil.data);
                $scope.data.colNotes = sData_notesByPupil.data;
            }, function (response) {
                console.log("error loading notes: " + response);
            });

            $scope.switchModalEvent = function () {
                $scope.data.displayModalEvent = !$scope.data.displayModalEvent;
            }

            $scope.switchModalGrade = function () {
                $scope.data.displayModalGrade = !$scope.data.displayModalGrade;
            }

            $scope.switchModalUpdateNote = function () {
                $scope.data.displayModalUpdateNote = !$scope.data.displayModalUpdateNote;
            }

            $scope.switchModalSettings = function () {
                $scope.data.displayModalSettings = !$scope.data.displayModalSettings;
            }

            $scope.switchModalNoteHistory = function () {
                $scope.data.displayModalNoteHistory = !$scope.data.displayModalNoteHistory;
            }

            $scope.switchModalParticipationHistory = function () {
                $scope.data.displayModalParticipationHistory = !$scope.data.displayModalParticipationHistory;
            }

            $scope.toggleView = function () {
                $location.path("/pupil/" + $scope.data.idPupil + "/" + $scope.data.idGradeGroup + "/Information");
            }

            $scope.viewGrade = function (event) {
                var participation = getParticipationOfEvent(event.idGradeEvent);
                console.log(participation);
                $scope.data.eventToBeGraded = event;
                $scope.data.participationToBeConfigured = participation;

                $scope.switchModalGrade();
                $scope.formData.grade = participation.grade;
            }

            $scope.displayParticipationsOfEvent = function (paramEventId) {
                // $scope.switchModalEventDetail();
                $location.path("/group/" + $scope.idGradeGroup + "/" + paramEventId);
            }


            $scope.submitGrade = function () {
                if ($scope.formData.grade != $scope.data.participationToBeConfigured.grade) {
                    if ($scope.formData.grade == 0 &&
                        $scope.data.participationToBeConfigured.grade != 0) {
                        moveEventToUngraded($scope.data.eventToBeGraded, $scope.data.participationToBeConfigured);
                    }
                    else {
                        moveEventToGraded($scope.data.eventToBeGraded, $scope.data.participationToBeConfigured);
                    }

                    $scope.data.participationToBeConfigured.grade = $scope.formData.grade;
                    var data = {
                        idParticipation: $scope.data.participationToBeConfigured.idParticipation,
                        fkGradeEvent: $scope.data.participationToBeConfigured.fkGradeEvent,
                        fkPupil: $scope.data.participationToBeConfigured.fkPupil,
                        grade: $scope.formData.grade
                    };

                    console.log(data);
                    sData_CUDHandler.putParticipation(data).then(function (response) {
                        console.log(response);
                        //moveEventToGraded($scope.data.eventToBeGraded);
                        $scope.switchModalGrade();
                    }, function (response) {
                        console.log("error trying to update participation: " + response)
                    });
                }
            }

            function moveEventToUngraded(event, participation) {
                var found = false;
                var lEvent = $scope.data.gradedEvents.length;
                var lPart = $scope.data.gradedParticipations.length;

                for (var i = 0; i < lEvent && !found; i++) {
                    if ($scope.data.gradedEvents[i].idGradeEvent == event.idGradeEvent) {
                        $scope.data.ungradedEvents.push($scope.data.gradedEvents[i]);
                        $scope.data.gradedEvents.splice(i, 1);
                        found = true;
                    }

                }

                found = false
                for (var i = 0; i < lPart && !found; i++) {
                    if ($scope.data.gradedParticipations[i].idParticipation == participation.idParticipation) {
                        $scope.data.gradedParticipations[i].grade = $scope.formData.grade;

                        $scope.data.ungradedParticipations.push($scope.data.gradedParticipations[i]);
                        $scope.data.gradedParticipations.splice(i, 1);
                        found = true;
                    }
                }
            }

            function moveEventToGraded(event, participation) {
                var found = false;
                var lEvent = $scope.data.ungradedEvents.length;
                var lPart = $scope.data.ungradedParticipations.length;

                for (var i = 0; i < lEvent && !found; i++) {
                    if ($scope.data.ungradedEvents[i].idGradeEvent == event.idGradeEvent) {
                        $scope.data.gradedEvents.push($scope.data.ungradedEvents[i]);
                        $scope.data.ungradedEvents.splice(i, 1);
                        found = true;
                    }

                }

                found = false
                for (var i = 0; i < lPart && !found; i++) {
                    if ($scope.data.ungradedParticipations[i].idParticipation == participation.idParticipation) {
                        $scope.data.ungradedParticipations[i].grade = $scope.formData.grade;

                        $scope.data.gradedParticipations.push($scope.data.ungradedParticipations[i]);
                        $scope.data.ungradedParticipations.splice(i, 1);
                        found = true;
                    }
                }
            }

            function getParticipationOfEvent(id) {
                var retVal = null;
                for (var i = 0; i < $scope.data.colParticipations.length && retVal == null; i++) {
                    if ($scope.data.colParticipations[i].fkGradeEvent == id &&
                        $scope.data.colParticipations[i].fkPupil == $scope.data.idPupil)
                        retVal = $scope.data.colParticipations[i];
                }
                return retVal;
            }

            function setGradedAndUngraded() {
                $scope.data.ungradedEvents = [];
                $scope.data.gradedEvents = [];
                var found = 0;
                for (var i = 0; i < $scope.data.colEvents.length; i++) {
                    found = 0;
                    for (var j = 0; j < $scope.data.colParticipations.length; j++) {
                        if ($scope.data.colEvents[i].idGradeEvent ==
                            $scope.data.colParticipations[j].fkGradeEvent
                            && $scope.data.colParticipations[j].fkPupil == $scope.data.idPupil) {
                            if ($scope.data.colParticipations[j].grade < 1) {
                                $scope.data.ungradedParticipations.push($scope.data.colParticipations[j]);
                                $scope.data.ungradedEvents.push($scope.data.colEvents[i]);
                            }
                            else {
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

            function findTeaches() {
                var retVal = null;

                var colTeaches = sData_allData.data.teaches;
                for (var i = 0; i < colTeaches.length && retVal == null; i++) {
                    if (colTeaches[i].fkGradeGroup == $scope.data.idGradeGroup)
                        retVal = colTeaches[i];
                }

                return retVal;
            }

            $scope.goToOverview = function (){
                $location.path("/overview");
            }
        }]);