angular.module("moduleInformation", ['ngMaterial'])
    .controller("ctrlInformation", ["$scope", "$routeParams", "sData_participationsByPupil", "sData_CUDHandler", "sData_allData",
        "sData_notesByPupil", "sData_noteHistory", "sData_participationHistory", "sData_eventsByGroups", "$mdDialog",
        function ($scope, $routeParams, sData_participationsByPupil, sData_CUDHandler, sData_allData,
                  sData_notesByPupil, sData_noteHistory, sData_participationHistory, sData_eventsByGroups, $mdDialog) {

            $scope.data = {};
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

        }]);
