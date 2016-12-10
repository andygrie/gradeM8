angular.module("moduleOverview", [])
.controller("ctrlOverview", ["$scope", "$location", "sData_allData", "sData_groupsBySubjects", "sData_CUDHandler", "sData_email",
                    function ($scope, $location, sData_allData, sData_groupsBySubjects, sData_CUDHandler, sData_email) {

    $scope.breadcrumb = "Overview-" + sData_allData.data.user.username;
    $scope.data = {};
    $scope.data.displayModalGroup = false;
    $scope.data.displayModalSubject = false;
    $scope.colGroupsBySubjects = {};
    $scope.colSubjects = {};
    $scope.colGroups = {};
                        $scope.data.displayModalSettings = false;
                        $scope.show = true;
                        $scope.data.currentSettingstab = "Period";


                        $scope.items = [1,2,3,4,5];
                        $scope.selected = [1];

                        $scope.toggle = function (item, list) {
                            var idx = list.indexOf(item);
                            if (idx > -1) {
                                list.splice(idx, 1);
                            }
                            else {
                                list.push(item);
                            }
                        };

                        $scope.exists = function (item, list) {
                                return list.indexOf(item) > -1;
                        };

                        $scope.isIndeterminate = function() {
                            return ($scope.selected.length !== 0 &&
                            $scope.selected.length !== $scope.items.length);
                        };

                        $scope.isChecked = function() {
                            return $scope.selected.length === $scope.items.length;
                        };

                        $scope.toggleAll = function() {
                            if ($scope.selected.length === $scope.items.length) {
                                $scope.selected = [];
                            } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                                $scope.selected = $scope.items.slice(0);
                            }
                        };


    sData_groupsBySubjects.fillData().then(function(response){
        console.log(response);
        $scope.colGroupsBySubjects = sData_groupsBySubjects.data;
        $scope.colSubjects = sData_allData.data.subjects;
        $scope.colGroups = sData_allData.data.groups;
    }, function(response){
        console.log("error loading groups by subjects: " + response);
    })
    
    /*
    $scope.colGroupsBySubjects = {
        "Mathe": [
            {idGradeGroup: 1, idGradeSubject: 1, name: "4AHIFS"},
            {idGradeGroup: 2, idGradeSubject: 1, name: "4BHIFS"},
            {idGradeGroup: 3, idGradeSubject: 1, name: "5AHIFS"},
        ],
        "English": [
            {idGradeGroup: 4, idGradeSubject: 2, name: "5BHIFS"},
            {idGradeGroup: 5, idGradeSubject: 2, name: "1AHIT/1"},
        ]
    }
    $scope.colSubjects = [
        {idGradeSubject: 1, name: "Mathe"},
        {idGradeSubject: 2, name: "English"},
    ];
    $scope.colGroups = [
        {idGradeGroup: 1, idGradeSubject: 1, name: "4AHIFS"},
        {idGradeGroup: 2, idGradeSubject: 1, name: "4BHIFS"},
        {idGradeGroup: 3, idGradeSubject: 1, name: "5AHIFS"},
        {idGradeGroup: 4, idGradeSubject: 2, name: "5BHIFS"},
        {idGradeGroup: 5, idGradeSubject: 2, name: "1AHIT/1"}
    ]
    */



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
                        $scope.switchModalSettings = function(){
                            $scope.data.displayModalSettings = !$scope.data.displayModalSettings;
                        }

                        $scope.setSettingTabToPeriod = function () {
                            $scope.data.currentSettingstab = "Period";
                        }

                        $scope.setSettingTabToWeekdays = function () {
                            $scope.data.currentSettingstab = "Weekdays";
                        }

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
            idGradeSubject: $scope.newGroup.subject.idGradeSubject, 
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