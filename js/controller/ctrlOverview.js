angular.module("moduleOverview", [])
.controller("ctrlOverview", ["$scope", "$location", "sData_allData", //"sData_groupsBySubjects", "sData_CUDHandler",
                    function ($scope, $location, sData_allData) {
    //$scope.colGroupsBySubjects = sData_groupsBySubjects.data;
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

    //$scope.colSubjects = sData_allData.data.subjects;
    $scope.colSubjects = [
        {idGradeSubject: 1, name: "Mathe"},
        {idGradeSubject: 2, name: "English"},
    ];

    //$scope.colGroups = sData_allData.data.groups;
    $scope.colGroups = [
        {idGradeGroup: 1, idGradeSubject: 1, name: "4AHIFS"},
        {idGradeGroup: 2, idGradeSubject: 1, name: "4BHIFS"},
        {idGradeGroup: 3, idGradeSubject: 1, name: "5AHIFS"},
        {idGradeGroup: 4, idGradeSubject: 2, name: "5BHIFS"},
        {idGradeGroup: 5, idGradeSubject: 2, name: "1AHIT/1"}
    ]

    $scope.navToGroup = function(id){
        $location.path("/group/" + id);
    }

    $scope.addNewSubject = function(){
        $scope.colSubjects.push({idGradeSubject: 1, name: $scope.newSubject.name});

        /*
        var data = {
            name: $scope.newSubject.name
        };
        sData_CUDHandler.insertSubject(function(response){
            console.log("successfuly inserted subj: " + response);
        }, function(response){
            console.log("error inserting subj: " + response);
        }, data);
        */
    }

    $scope.addNewGroup = function(){
        $scope.colGroups.push({idGradeGroup: 1, 
                            idGradeSubject: $scope.newGroup.subject.idGradeSubject, 
                            name: $scope.newGroup.name});
        /*
        var data = {
            idGradeSubject: $scope.newGroup.subject.idGradeSubject, 
            name: $scope.newGroup.name
        };
        sData_CUDHandler.insertGroup(function(response){
            console.log("successfuly inserted subj: " + response);
        }, function(response){
            console.log("error inserting subj: " + response);
        }, data);
        */
    }
}]);