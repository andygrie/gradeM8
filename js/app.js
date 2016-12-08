var app = angular.module("gradeM8", ["ngRoute",
                                     "moduleOverview",
                                     "modulePupil",
                                     "moduleGroup",
                                     "moduleData",
                                     "moduleWeb",
                                     "moduleLogin"
                                    ]);
app.constant('constants', {
    apiUrl: "http://gradem8.azurewebsites.net",
    teacherId: 0
});

app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "templates/styled_Login.html",
    controller: "ctrlLogin",
      label: "login"
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
  });
}); 