angular.module("moduleOverview", [])
.controller("ctrlOverview", ["$scope", "$location", "sData_allData", "sData_groupsBySubjects", "sData_CUDHandler",
                    function ($scope, $location, sData_allData, sData_groupsBySubjects, sData_CUDHandler) {
    $scope.data = {};
    $scope.data.displayModalGroup = false;
    $scope.data.displayModalSubject = false;
    $scope.colGroupsBySubjects = {};
    $scope.colSubjects = {};
    $scope.colGroups = {};
    $scope.data.colGroupsBySubjects = {};
    sData_groupsBySubjects.fillData().then(function(response){
        console.log(response);
        $scope.colGroupsBySubjects = sData_groupsBySubjects.data;
        $scope.colSubjects = sData_allData.data.subjects;
        $scope.colGroups = sData_allData.data.groups;

        var keys = Object.keys($scope.colGroupsBySubjects);
        for(var i = 0; i < keys.length; i++)
        {
            $scope.data.colGroupsBySubjects[keys[i]] = [];
            for(var j = 0; j < $scope.colGroupsBySubjects[keys[i]]; j++)
            {
                $scope.data.colGroupsBySubjects[keys[i]].push($scope.colGroupsBySubjects[keys[i]][j]);
            }
        }
        console.log($scope.colGroupsBySubjects);
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
    $scope.logCollection = function()
    {
        console.log($scope.colGroupsBySubjects);
        $scope.data.colGroupsBySubjects["Mathe"] = [
            {idGradeGroup: 1, idGradeSubject: 1, name: "4AHIFS"},
            {idGradeGroup: 2, idGradeSubject: 1, name: "4BHIFS"},
            {idGradeGroup: 3, idGradeSubject: 1, name: "5AHIFS"},
        ];
    }

    $scope.navToGroup = function(id){
        $location.path("/group/" + id);
    }
    
    $scope.switchModalSubject = function()
    {
        console.log("in func");
        $scope.data.displayModalSubject = !$scope.data.displayModalSubject;
    }

    $scope.switchModalGroup = function()
    {
        console.log("in func");
        $scope.data.displayModalGroup = !$scope.data.displayModalGroup;
    }

    $scope.addNewSubject = function(){
        //$scope.colSubjects.push({idGradeSubject: 1, name: $scope.newSubject.name});
        var data = {
            name: $scope.newSubject.name
        };
        sData_CUDHandler.insertSubject().then(function(response){
            console.log("successfuly inserted subj: " + response);
        }, function(response){
            console.log("error inserting subj: " + response);
        }, data);
    }

    $scope.addNewGroup = function(){
        /*$scope.colGroups.push({idGradeGroup: 1, 
                            idGradeSubject: $scope.newGroup.subject.idGradeSubject, 
                            name: $scope.newGroup.name});*/
        
        var data = {
            idGradeSubject: $scope.newGroup.subject.idGradeSubject, 
            name: $scope.newGroup.name
        };
        sData_CUDHandler.insertGroup().then(function(response){
            console.log("successfuly inserted group: " + response);
        }, function(response){
            console.log("error inserting group: " + response);
        }, data);
        
    }
}]);