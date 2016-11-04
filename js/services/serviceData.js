angular.module('moduleData', [])

.factory('sData_teachers', ["$q", "sWeb_getTeacher", 
                function($q, sWeb_getTeacher) {
  var teachers = null;
  var retVal;

  retVal = {
      data: teachers,
      fillData : fillData
  }

  return retVal;

  function fillData(){
    return $q(function(resolve, reject) {
        sWeb_getTeacher(function(responseData){
            applData.teacher = responseData;
            resolve("Successfuly loaded teachers");
        }, function(response){
            reject(response);
        });
    })
  }
}])

.factory('sData_groupsBySubjects', ["$q", "sWeb_getSubjectByTeacher", "sWeb_getGroupByTeacherAndSubject", "sWeb_setSubject", 
                            function($q, sWeb_getSubjectByTeacher, sWeb_getGroupByTeacherAndSubject, sWeb_setSubject) {
  var groupsBySubjects = null;
  var retVal;

  retVal = {
      data: groupsBySubjects,
      fillData: fillData,
      insertSubject: insertSubject
  }

  return retVal;

  function fillData(){
      return $q(function(resolve, reject){
        sWeb_getSubjectByTeacher(function(responseData){
            for(var i = 0; i < responseData.length; i++)
            {
                sWeb_getGroupByTeacherAndSubject(function(responseDataInner){
                    groupsBySubjects.push(responseData[i]);
                    groupsBySubjects[responseData[i]] = responseDataInner;
                }, function(response){
                    reject(response);
                }, responseData[i].idGradeSubject);
            }

            resolve("Successfully loaded groupsBySubjects");
        }, function(response){
            reject(response);
        });
    });
  }

//data needs subject name
  function insertSubject(){
      return $q(function(resolve, reject, data){
        sWeb_setSubject(function(response){
            groupsBySubjects.push(response);
            groupsBySubjects[response] = [];
            resolve("Successfully inserted Subject");
        }, function(response){
            reject(response);
        }, data);
    });
  } 
}])

//depends on /\ sData_groupsBySubject 
//dont forget to call on group update
.factory('sData_eventsByGroups', ["$q", "sData_groupsBySubjects",  "sWeb_getEventByGroup",
                            function($q, sData_groupsBySubject, sWeb_getEventByGroup) {
  var eventsByGroups = null;
  var retVal;

  retVal = {
      data: eventsByGroups,
      fillData: fillData
  }

  return retVal;

  function fillData(){
      return $q(function(resolve, reject){
        var baseData = sData_groupsBySubject.data;
        if(baseData == null)
        {
            sData_groupsBySubject.fillData(function(response){
                //baseData should have updated hence call by reference
                //for bug preventing tho
                baseData = sData_groupsBySubject.data;
            },function(response){
                reject("Dependent Load not working! " + response);
            })
        }

        var keys = Object.keys(baseData);
        for(var i = 0; i < keys.length; i++)
        {
            for(var j = 0; j < baseData[keys[i]].length; j++)
            {
                //Pushes every required group into the collection
                eventsByGroups.push(baseData[keys[i]][j]);

                sWeb_getEventByGroup(function(responseData){
                    //and sets the pupils for each group
                    eventsByGroups[baseData[keys[i]][j]] = responseData;
                }, function(response){
                    reject(response);
                }, baseData[keys[i]][j].idGradeGroup);
            }
        }

        resolve("Successfully loaded eventsByGroups");
    });
  }
}])
//depends on /\ sData_groupsBySubject 
//dont forget to call on group update
.factory('sData_pupilsByGroups', ["$q", "sData_groupsBySubjects",  "sWeb_getPupilByGroup", "sWeb_setGroup",
                            function($q, sData_groupsBySubject, sWeb_getPupilByGroup, sWeb_setGroup) {
  var pupilsByGroups = null;
  var retVal;

  retVal = {
      data: pupilsByGroups,
      fillData: fillData,
      insertGroup: insertGroup
  }

  return retVal;

  function fillData(){
      return $q(function(resolve, reject){
        var baseData = sData_groupsBySubject.data;
        if(baseData == null)
        {
            sData_groupsBySubject.fillData(function(response){
                //baseData should have updated hence call by reference
                //for bug preventing tho
                baseData = sData_groupsBySubject.data;
            },function(response){
                reject("Dependent Load not working! " + response);
            })
        }

        var keys = Object.keys(baseData);
        for(var i = 0; i < keys.length; i++)
        {
            for(var j = 0; j < baseData[keys[i]].length; j++)
            {
                //Pushes every required group into the collection
                pupilsByGroups.push(baseData[keys[i]][j]);

                sWeb_getPupilByGroup(function(responseData){
                    //and sets the pupils for each group
                    pupilsByGroups[baseData[keys[i]][j]] = responseData;
                }, function(response){
                    reject(response);
                }, baseData[keys[i]][j].idGradeGroup);
            }
        }

        resolve("Successfully loaded pupilsByGroups");
    });
  }

  //data needs group name and subject
  function insertGroup(){
      return $q(function(resolve, reject, data){
        sWeb_setGroup(function(response){
            pupilsByGroups.push(response);
            sData_groupsBySubject.data[data.Subject].push(response);
            resolve("Successfully inserted Subject");
        }, function(response){
            reject(response);
        }, data);
    });
  }
}])

/*
//depends on /\ sData_pupilsByGroups 
//dont forget to call on group update
.factory('sData_participationsByPupils', ["sData_pupilsByGroups", "sWeb_getParticipationByPupil",
                            function( sData_pupilsByGroups, sWeb_getParticipationByPupil) {
  var participationsByPupils = null;
  var retVal;

  retVal = {
      data: participationsByPupils,
      fillData: fillData//,
      //insertPupil: insertPupil
  }

  return retVal;

  function fillData(){
      return $q(function(resolve, reject){
        var baseData = sData_pupilsByGroups.data;
        if(baseData == null)
        {
            sData_pupilsByGroups.fillData(function(response){
                //baseData should have updated hence call by reference
                //for bug preventing tho
                baseData = sData_pupilsByGroups.data;
            },function(response){
                reject("Dependent Load not working! " + response);
            })
        }

        var keys = Object.keys(baseData);
        for(var i = 0; i < keys.length; i++)
        {
            for(var j = 0; j < baseData[keys[i]].length; j++)
            {
                //Pushes every required pupil into the collection
                participationsByPupils.push(baseData[keys[i]][j]);

                sWeb_getParticipationByPupil(function(responseData){
                    //and sets the events for each pupil
                    sWeb_getParticipationByPupil[baseData[keys[i]][j]] = responseData;
                }, function(response){

                }, baseData[keys[i]][j].idUser);
            }
        }
    });
  }

  /* AD muss geklärt werden
  function insertPupil(){
      return $q(function(resolve, reject, data){
        sWeb_setGroup(function(response){
            pupilsByGroups.push(response);
            sData_groupsBySubject.data[data.Subject].push(response);
            resolve("Successfully inserted Subject");
        }, function(response){
            reject(response);
        }, data);
    });
  }
  *
}]);*/
;