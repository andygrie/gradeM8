var app = angular.module("gradeM8", ["ngRoute",
                                     "moduleOverview",
                                     "moduleStudent",
                                     "moduleClass"]);

app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/templates/overview.html",
    controller: "ctrlOverview"
  })
  .when("/class", {
    templateUrl : "/templates/class.html",
    controller: "ctrlClass"
  })
  .when("/student", {
    templateUrl : "/templates/student.html",
    controller: "ctrlStudent"
  });
}); 