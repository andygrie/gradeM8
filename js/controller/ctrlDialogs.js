angular.module("moduleDialogs", [])
    .controller("DialogController", ["$scope", "$location", "sData_allData", "sData_groupsBySubjects", "sData_CUDHandler", "sData_email", "sData_setEMailDates", "$mdDialog", "$timeout", "$mdSidenav",
        function ($scope, $location, sData_allData, sData_groupsBySubjects, sData_CUDHandler, sData_email, sData_setEMailDates, $mdDialog, $timeout, $mdSidenav) {
// $scope.eMailDates.von = "";
// $scope.eMailDates.bis =  "";
            $scope.myDate = new Date();
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
        }])
    .controller("ctrlAddEvent", ["$scope", "$location", "sData_allData", "sData_groupsBySubjects", "sData_CUDHandler", "sData_email", "sData_setEMailDates", "$mdDialog", "$timeout", "$mdSidenav",
        function ($scope, $location, sData_allData, sData_groupsBySubjects, sData_CUDHandler, sData_email, sData_setEMailDates, $mdDialog, $timeout, $mdSidenav) {

        }])
    .controller("ctrlAddNote", ["$scope", "$location", "sData_allData", "sData_groupsBySubjects", "sData_CUDHandler", "sData_email", "sData_setEMailDates", "$mdDialog", "$timeout", "$mdSidenav",
        function ($scope, $location, sData_allData, sData_groupsBySubjects, sData_CUDHandler, sData_email, sData_setEMailDates, $mdDialog, $timeout, $mdSidenav) {

        }]).
controller("ctrlAddSubject", ["$scope", "$location", "sData_allData", "sData_groupsBySubjects", "sData_CUDHandler", "sData_email", "sData_setEMailDates", "$mdDialog",
    function ($scope, $location, sData_allData, sData_groupsBySubjects, sData_CUDHandler, sData_email, sData_setEMailDates, $mdDialog) {

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



