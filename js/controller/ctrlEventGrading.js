angular.module("moduleEvent", ['ngMaterial'])
    .controller("ctrlEventGrading", ["$scope", "$routeParams", "$location", "sData_pupilsByGroups", "sData_eventsByGroups",
        "sData_CUDHandler", "sData_allData", "sData_teaches", "sData_classes", "sData_pupilsByClass", "sData_participationsByEvent", "$mdDialog",
        function ($scope, $routeParams, $location, sData_pupilsByGroups, sData_eventsByGroups,
                  sData_CUDHandler, sData_allData, sData_teaches, sData_classes, sData_pupilsByClass, sData_participationsByEvent, $mdDialog) {


            $scope.showTabDialog = function (ev) {
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: '../../templates/settings_Modal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };

            function DialogController($scope, $mdDialog) {

                // $scope.eMailDates.von = "";
                // $scope.eMailDates.bis =  "";

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


                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
            }

            var groupname = function () {
                var group;
                sData_allData.data.groups.forEach(function (entry) {
                    if (entry.idGradeGroup == $routeParams.idGradeGroup) {

                        group = entry.name;
                    }
                });
                return group;
            };

            $scope.breadcrumb = groupname() + " - Event-Grading";

            $scope.idEvent = $routeParams.idEvent;
            $scope.grade = {};
            $scope.idGradeGroup = $routeParams.idGradeGroup;

            $scope.grade.gradeOptions = [
                {grade: -1, description: "ungraded"},
                {grade: 0, description: "abscent"},
                {grade: 1, description: "1"},
                {grade: 2, description: "2"},
                {grade: 3, description: "3"},
                {grade: 4, description: "4"},
                {grade: 5, description: "5"}
            ];

            $scope.grade.colParticipations = [];

            $scope.grade.updateGrade = function (item) {
                item.isUpdating = true;

                sData_CUDHandler.putParticipation(item).then(function (reponse) {
                    item.isUpdating = false;
                    console.log("success updating grade");
                }, function (response) {
                    item.isUpdating = false;
                    console.log("update failed");
                    console.log(response);
                });
            }

            $scope.loadParticipationsByEvent = function (paramEventId) {
                console.log("loadParticipationsByEvent");
                console.log(paramEventId);
                sData_participationsByEvent.fillData({idGradeEvent: paramEventId}).then(function (response) {
                    console.log(response);
                    var curID=1;
                    $scope.grade.colParticipations = sData_participationsByEvent.data.map(function (item) {
                        item.isUpdating = false;
                        item.id = curID;
                        curID++;
                        return item;
                    });

                    console.log($scope.grade.colParticipations);
                }, function (response) {
                    console.log(response);
                });
            }

            $scope.back = function () {
                $location.path("/group/" + $scope.idGradeGroup);
            }

            $scope.$on('$viewContentLoaded', function () {
                $scope.loadParticipationsByEvent($scope.idEvent);
                console.log("This function just ran away");
            });
                    }]);