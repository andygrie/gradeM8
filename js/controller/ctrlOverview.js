angular.module("moduleOverview", [])
.controller("ctrlOverview", ["$scope", "$location", "sData_allData", "sData_groupsBySubjects", "sData_CUDHandler", "sData_email","sData_setEMailDates","$mdDialog",
                    function ($scope, $location, sData_allData, sData_groupsBySubjects, sData_CUDHandler, sData_email,sData_setEMailDates,$mdDialog) {
                        
    $scope.breadcrumb = "Overview-" + sData_allData.data.user.username;
    $scope.state = {};
    $scope.state.awaitingData = true;
    $scope.data = {};
    $scope.data.displayModalGroup = false;
    $scope.data.displayModalSubject = false;
    $scope.colGroupsBySubjects = {};
    $scope.colSubjects = {};
    $scope.colGroups = {};

    
    $scope.data.displayModalSettings = false;
    $scope.show = true;
    $scope.data.currentSettingstab = "Period";


    $scope.status = '  ';

    $scope.showTabDialog = function(ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '../../templates/settings_Modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        });
    };


    function DialogController($scope, $mdDialog) {

       // $scope.eMailDates.von = "";
       // $scope.eMailDates.bis =  "";
/*
        $scope.setEmails = function () {
            submitEMailDates($scope.eMailDates.von,
            $scope.eMailDates.bis);
            var data = {
                idTeacher: sData_allData.data.user.idUser,
                 von: von,
                bis:bis
                };
                console.log(data);
                sData_CUDHandler.insertEMailDates(data).then(function(response){
                console.log("successfuly inserted new Mail Dates: " + response);
                    $mdDialog.hide();
                }, function(response){
                console.log("error inserting subj: " + response);
         });
        };
        */

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }


    sData_groupsBySubjects.fillData().then(function(response){
        console.log(response);
        $scope.colGroupsBySubjects = sData_groupsBySubjects.data;
        $scope.colSubjects = sData_allData.data.subjects;
        $scope.colGroups = sData_allData.data.groups;
        $scope.state.awaitingData = false;
    }, function(response){
        console.log("error loading groups by subjects: " + response);
        $scope.state.awaitingData = false;
    })

    $scope.sendEmail = function(){
        sData_email.send().then(function(response){
            alert(response);
        }, function(response){
            alert("error: ", response);
        })
    }

    $scope.navToGroup = function(id){
        $location.path("/group/" + id);
    }
    
    $scope.switchModalSubject = function()
    {
        $scope.data.displayModalSubject = !$scope.data.displayModalSubject;
    }

    $scope.switchModalGroup = function()
    {
        $scope.data.displayModalGroup = !$scope.data.displayModalGroup;
    }
    /*
    $scope.switchModalSettings = function(){
        $scope.data.displayModalSettings = !$scope.data.displayModalSettings;
    }

    $scope.setSettingTabToPeriod = function () {
        $scope.data.currentSettingstab = "Period";
    }

    $scope.setSettingTabToWeekdays = function () {
        $scope.data.currentSettingstab = "Weekdays";
    }
    */

    
    $scope.addNewSubject = function(){
        //$scope.colSubjects.push({idGradeSubject: 1, name: $scope.newSubject.name});
        var data = {
            name: $scope.newSubject.name
        };
        console.log(data);
        sData_CUDHandler.insertSubject(data).then(function(response){
            console.log("successfuly inserted subj: " + response);
            $scope.switchModalSubject();
        }, function(response){
            console.log("error inserting subj: " + response);
        });
    }

    $scope.addNewGroup = function(){
        /*$scope.colGroups.push({idGradeGroup: 1, 
                            idGradeSubject: $scope.newGroup.subject.idGradeSubject, 
                            name: $scope.newGroup.name});*/

        var data = {
            idGradeSubject: $scope.newGroup.subject,//$scope.newGroup.subject.idGradeSubject, 
            name: $scope.newGroup.name
        };

        console.log(data);
        sData_CUDHandler.insertGroup(data).then(function(response){
            console.log("successfuly inserted group: " + response);
            $scope.switchModalGroup();
        }, function(response){
            console.log("error inserting group: " + response);
        });
        
    }
}]);