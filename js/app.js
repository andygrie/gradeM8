var app = angular.module("gradeM8", ["ngRoute",
                                        "ngMaterial",
                                        "moduleOverview",
                                        "modulePupil",
                                        "moduleGroup",
                                        "moduleData",
                                        "moduleWeb",
                                        "moduleLogin",
                                        "moduleEvent"
                                    ]);
app.constant('constants', {
    apiUrl: "http://gradem8.azurewebsites.net",
    teacherId: 0
});

app.config(function($routeProvider, $mdDateLocaleProvider) {
  
  $mdDateLocaleProvider.formatDate = function(date) {
    return moment(date).format('YYYY-MM-DD');
  };
  
  $routeProvider
  .when("/", {
    templateUrl : "templates/styled_Login.html",
    controller: "ctrlLogin"
  })
  .when("/overview", {
    templateUrl : "templates/styled_Overview.html",
    controller: "ctrlOverview"
  })
  .when("/group/:idGradeGroup", {
    templateUrl : "templates/styled_Group.html",
    controller: "ctrlGroup"
  })
  .when("/pupil/:idPupil/:idGradeGroup", {
    templateUrl : "templates/styled_Student.html",
    controller: "ctrlPupil"
  })
      .when("/group/:idGradeGroup/:idEvent", {
      templateUrl : "templates/styled_EventGrading.html",
      controller: "ctrlEventGrading"
  });
}); 