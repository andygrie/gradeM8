var app = angular.module("gradeM8", ["ngRoute",
                                     "moduleOverview",
                                     "moduleStudent",
                                     "moduleClass",
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
    templateUrl : "templates/overview.html",
    controller: "ctrlOverview"
  })
  .when("/class", {
    templateUrl : "templates/class.html",
    controller: "ctrlClass"
  })
  .when("/student", {
    templateUrl : "templates/student.html",
    controller: "ctrlStudent"
  });
}); 