angular.module("moduleDialogs", [])
    .controller("DialogController", ["$scope", "sData_allData",  "sData_CUDHandler", "$mdDialog",
        function ($scope, sData_allData, sData_CUDHandler, $mdDialog)
        {
            $scope.myDate = new Date();

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };

            $scope.setEmails = function () {
                var data = {
                    idTeacher: sData_allData.data.user.idUser,
                    von: $scope.eMailDates.von,
                    bis: $scope.eMailDates.bis
                };
                sData_CUDHandler.insertEMailDates(data).then(function (response) {
                    console.log("successfuly inserted new Mail Dates");
                }, function (response) {
                    console.log("error inserting subj: " + response);
                });
                $mdDialog.hide();
            };
        }])
    .controller("AddEventController", ["$scope", "$location", "sData_allData", "sData_groupsBySubjects", "sData_CUDHandler", "sData_email", "sData_setEMailDates", "$mdDialog", "$timeout", "$mdSidenav",
        function ($scope,  sData_groupsBySubjects, sData_CUDHandler, $mdDialog) {

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.insertNewEvent = function () {
                var data = {
                    idGradeGroup: $scope.data.idGradeGroup,
                    fkTeaches: $scope.data.teaches.idTeaches,
                    eventDate: $scope.newEvent.eventDate,
                    eventDescription: $scope.newEvent.eventDescription
                };
                sData_CUDHandler.insertEvent(data).then(function (response) {
                    console.log("successfuly inserted event: " + response);

                    var dataInner = {};
                    dataInner.idGradeEvent = response.idGradeEvent;
                    dataInner.colPupils = [{
                        fkPupil: parseInt($scope.data.idPupil),
                        grade: -1
                    }];
                    sData_CUDHandler.insertParticipation(dataInner).then(function (responseData) {
                        console.log("successfully inserted participations, now should follow response data <.<");
                        console.log(responseData);

                        $scope.data.ungradedEvents.push(response);
                        $scope.data.ungradedParticipations.push(responseData[0]);
                        $scope.data.colParticipations.push(responseData[0]);

                        $scope.hide();
                    }, function (response) {
                        console.log("error inserting participations" + response);
                    })

                }, function (response) {
                    console.log("error inserting event: " + response);
                });
            }

        }])
    .controller("AddNoteController", ["$scope", "sData_CUDHandler", "$mdDialog",
        function ($scope, sData_CUDHandler, $mdDialog) {
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.insertNewNote = function () {

                var data = {
                    idTeaches: $scope.data.teaches.idTeaches,
                    idPupil: $scope.data.idPupil,
                    note: $scope.newNote.note
                }
                console.log(data);

                sData_CUDHandler.insertNote(data).then(function (responseData) {
                    console.log("successfuly inserted note: " + responseData);
                    $scope.data.colNotes.push(responseData);
                    $scope.hide()
                }, function (response) {
                    console.log("error inserting note: " + response);
                });
            }
        }])
    .controller("ctrlAddSubject", ["$scope", "sData_CUDHandler", "$mdDialog",
    function ($scope, sData_CUDHandler, $mdDialog) {

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };

        $scope.addNewSubject = function () {
            //$scope.colSubjects.push({idGradeSubject: 1, name: $scope.newSubject.name});
            var data = {
                name: $scope.newSubject.name
            };
            console.log(data);
            sData_CUDHandler.insertSubject(data).then(function (response) {
                console.log("successfuly inserted subj: " + response);
                $scope.hide();
            }, function (response) {
                console.log("error inserting subj: " + response);
            });
        }
    }]);



