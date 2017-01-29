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
            $scope.updateNote = {};
            $scope.data.displayModalNoteHistory = false;
            $scope.data.displayModalParticipationHistory = false;
            $scope.partHistory.colParticipation = [];
            $scope.noteHistory.colNotes = [];
            $scope.data.colNoteHistory = [];
            $scope.data.colParticipationHistroy = [];
            $scope.data.ungradedEvents = [];
            $scope.data.gradedEvents = [];
            $scope.data.ungradedParticipations = [];
            $scope.data.gradedParticipations = [];
            $scope.data.colEvents = [];


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
            $scope.breadcrumb = $scope.generatedBreadcrumb + " - Information";


            $scope.submitUpdateNote = function (note) {
                sData_CUDHandler.putNote({idNote: note.idNote, note: note.note}).then(function (response) {
                    console.log("success updating note");
                    // $scope.switchModalUpdateNote();
                }, function (response) {
                    console.log("error updating note");
                });
            }

            $scope.updateNote = function (note) {
                $scope.updatedNote = note;
                $scope.submitUpdateNote(note);
                // $scope.switchModalUpdateNote();
            }

            $scope.getTotalGrade = function () {
                var gradesSum = 0;

                for (var i = 0; i < $scope.data.gradedParticipations.length; i++) {
                    gradesSum += parseInt($scope.data.gradedParticipations[i].grade);
                }
                return gradesSum / $scope.data.gradedParticipations.length;
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

            $scope.showTabDialog = function (ev) {
                $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: '../../templates/settings_Modal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };


            $scope.goToOverview = function (){
                $location.path("/overview");
            }

            $scope.toggleView = function () {
                $location.path("/pupil/" + $scope.data.idPupil + "/" + $scope.data.idGradeGroup);
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
        }]);
