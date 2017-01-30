angular.module("moduleInformation", ['ngMaterial'])
    .controller("ctrlInformation", ["$scope", "$routeParams","$location", "sData_participationsByPupil", "sData_CUDHandler", "sData_allData",
        "sData_notesByPupil", "sData_noteHistory", "sData_participationHistory", "sData_eventsByGroups", "$mdDialog", "sData_authenticate",
        function ($scope, $routeParams,$location, sData_participationsByPupil, sData_CUDHandler, sData_allData,
                  sData_notesByPupil, sData_noteHistory, sData_participationHistory, sData_eventsByGroups, $mdDialog, sData_authenticate) {

            if(!sData_authenticate.isAuthenticated())
            {
                $location.path("/");
            }

            $scope.data = {};
            $scope.data.idPupil = $routeParams.idPupil;
            $scope.data.idGradeGroup = $routeParams.idGradeGroup;
            $scope.partHistory = {};
            $scope.noteHistory = {};
            $scope.data.teaches = findTeaches();
            $scope.updateNote = {};
            $scope.data.displayModalNoteHistory = false;
            $scope.data.displayModalParticipationHistory = false;
            $scope.partHistory.colParticipation = [];
            $scope.data.colParticipations
            $scope.noteHistory.colNotes = [];
            $scope.data.colNoteHistory = [];
            $scope.data.colParticipationHistroy = [];
            $scope.data.ungradedEvents = [];
            $scope.data.gradedEvents = [];
            $scope.data.ungradedParticipations = [];
            $scope.data.gradedParticipations = [];
            $scope.data.colEvents = [];


            var dataInit = {
                idPupil: $scope.data.idPupil,
                idTeaches: $scope.data.teaches.idTeaches
            };

            sData_notesByPupil.fillData(dataInit).then(function (response) {
                console.log("successfully loaded notes");
                console.log(sData_notesByPupil.data);
                $scope.data.colNotes = sData_notesByPupil.data;
            }, function (response) {
                console.log("error loading notes: " + response);
            });

            sData_eventsByGroups.fillData({idGradeGroup: $scope.data.idGradeGroup}).then(function (outerResponse) {
                console.log("success fetching events");
                $scope.data.colEvents = sData_eventsByGroups.data;

                sData_participationsByPupil.fillData(dataInit).then(function (response) {
                    console.log("successfuly loaded participations");
                    $scope.data.colParticipations = sData_participationsByPupil.data;
                    setGradedAndUngraded();
                }, function (response) {
                    console.log("error loading participations");
                });
            }, function (response) {
                console.log("error fetching events");
            })


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

            $scope.breadcrumb = generateBreadcrumb() + " - Information";

            $scope.updateNote = function (note) {
                $scope.updatedNote = note;
                $scope.submitUpdateNote(note);
                // $scope.switchModalUpdateNote();
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

            $scope.displayNoteHistory = function (paramIdNote) {
                $scope.switchModalNoteHistory();
                $scope.loadNoteHistory(paramIdNote);
            }

            $scope.displayParticipationHistory = function (paramIdParticipation) {
                $scope.switchModalParticipationHistory();
                $scope.loadParticipationHistory(paramIdParticipation);
            }

            $scope.loadNoteHistory = function (paramIdNote) {
                $scope.noteHistory.colNotes = [];
                sData_noteHistory.fillData({idNote: paramIdNote}).then(function (response) {
                    console.log(response);
                    $scope.noteHistory.colNotes = sData_noteHistory.data;
                }, function (response) {
                    console.log(response);
                });
            }

            $scope.loadParticipationHistory = function (paramIdParticipation) {
                $scope.partHistory.colParticipation = [];
                sData_participationHistory.fillData({idParticipation: paramIdParticipation}).then(function (response) {
                    console.log(response);
                    $scope.partHistory.colParticipation = sData_participationHistory.data;
                }, function (response) {
                    console.log(response);
                });
            }

            $scope.goToOverview = function (){
                $location.path("/overview");
            }

            $scope.toggleView = function () {
                $location.path("/pupil/" + $scope.data.idPupil + "/" + $scope.data.idGradeGroup);
            }

            $scope.submitUpdateNote = function (note) {
                sData_CUDHandler.putNote({idNote: note.idNote, note: note.note}).then(function (response) {
                    console.log("success updating note");
                    // $scope.switchModalUpdateNote();
                }, function (response) {
                    console.log("error updating note");
                });
            }

            $scope.getEventOfParticipation = function (id) {
                var retVal = {};
                var found = false;
                for (var i = 0; i < $scope.data.gradedEvents.length && !found; i++) {
                    if ($scope.data.gradedEvents[i].idGradeEvent == id) {
                        retVal = $scope.data.gradedEvents[i];
                        found = true;
                    }
                }
                return retVal;
            }

            $scope.getTotalGrade = function () {
                var gradesSum = 0;

                for (var i = 0; i < $scope.data.gradedParticipations.length; i++) {
                    gradesSum += parseInt($scope.data.gradedParticipations[i].grade);
                }
                return gradesSum / $scope.data.gradedParticipations.length;
            }

            $scope.showAddEventDialog = function (ev) {
                $mdDialog.show({
                    controller: 'AddEventController',
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

            $scope.showTabDialog = function (ev) {
                $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: '../../templates/settings_Modal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };

            function findTeaches() {
                var retVal = null;

                var colTeaches = sData_allData.data.teaches;
                for (var i = 0; i < colTeaches.length && retVal == null; i++) {
                    if (colTeaches[i].fkGradeGroup == $scope.data.idGradeGroup)
                        retVal = colTeaches[i];
                }

                return retVal;
            }
        }]);
