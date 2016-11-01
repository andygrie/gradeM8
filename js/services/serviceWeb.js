angular.module('moduleWeb', [])

//GET -------------------------------------------------------------------------
.factory('sWeb_getTeacher', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject){
      $http({
          method: "GET",
          url: constants.apiUrl + "/teacher"
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getPupilByClass', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject, classId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/pupil/" + classId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getPupilByGroup', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject, groupId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/pupil/" + groupId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getGroupByTeacherAndSubject', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject, subjectId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/group/" + constants.teacherId + "/" + subjectId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getSubjectByTeacher', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject){
      $http({
          method: "GET",
          url: constants.apiUrl + "/subject" + constants.teacherId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getTeachesByTeacherAndSubject', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject, subjectId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/teaches/" + constants.teacherId + "/" + subjectId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getParticipationByEventAndPupil', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject, eventId, pupilId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/participation/" + eventId + "/" + pupilId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getParticipationByPupil', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject, pupilId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/participation/" + pupilId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

//POST -------------------------------------------------------------------------

.factory('sWeb_setSubject', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject, data){
      $http({
          method: "POST",
          url: constants.apiUrl + "/subject",
          data: {
              "name": data.name
          }
      }).then(function(response){
          resolve(response);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_setGroup', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject, data){
      $http({
          method: "POST",
          url: constants.apiUrl + "/group",
          data: {
              "name": data.name
          }
      }).then(function(response){
          resolve(response);
        }, function(response){
          reject(response);
      });
  })
}])

/* Unsinnig, kläre AD
.factory('sWeb_setPupil', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject, data){
      $http({
          method: "POST",
          url: constants.apiUrl + "/pupil",
          data: {
              "forename": data.forename,
              "surname": data.surname,
              "email": data.email,
              "password": data.password,
              "fkClass": data.classId
          }
      }).then(function(response){
          resolve(response);
        }, function(response){
          reject(response);
      });
  })
}])
*/
//noch unsicher
//for initialization as well as for updating
.factory('sWeb_setAssigned', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject, data){
      $http({
          method: "POST",
          url: constants.apiUrl + "/assigned",
          data: {
              "idGroup": data.id,
              "colPupil": data.colPupil
          }
      }).then(function(response){
          resolve(response);
        }, function(response){
          reject(response);
      });
  })
}])

//noch unsicher
.factory('sWeb_setEvent', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject, data){
      $http({
          method: "POST",
          url: constants.apiUrl + "/gradeEvent",
          data: {
              "fkTeaches": data.idTeaches,
              "eventDate": data.date,
              "eventDescription": data.description
          }
      }).then(function(response){
          resolve(response);
        }, function(response){
          reject(response);
      });
  })
}])

//noch unsicher
.factory('sWeb_setParticipation', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject, data){
      $http({
          method: "POST",
          url: constants.apiUrl + "/participation",
          data: {
              "fkEvent": data.idEvent,
              "colPupil": data.colPupil,
              "grade": data.grade,
              "abscent": data.abscent
          }
      }).then(function(response){
          resolve(response);
        }, function(response){
          reject(response);
      });
  })
}])

//PUT -------------------------------------------------------------------------
