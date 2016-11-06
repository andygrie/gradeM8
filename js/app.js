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
    templateUrl : "templates/login.html",
    controller: "ctrlLogin"
  })
  .when("/overview", {
    templateUrl : "templates/styled_overview.html",
    controller: "ctrlOverview"
  })
  .when("/group/:idGradeGroup", {
    templateUrl : "templates/group.html",
    controller: "ctrlGroup"
  })
  .when("/pupil/:idPupil/:idGradeGroup", {
    templateUrl : "templates/pupil.html",
    controller: "ctrlPupil"
  });
}); 