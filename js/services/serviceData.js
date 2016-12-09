angular.module('moduleData', [])

.factory('sData_CUDHandler', ["$q", "sData_allData", "sData_groupsBySubjects", "sData_eventsByGroups", "sData_pupilsByGroups", "sData_participationsByPupil",
                                "sWeb_setSubject", "sWeb_setGroup", "sWeb_setTeaches", "sWeb_putParticipation", "sWeb_setParticipation", "sWeb_setNoteByTeachesAndPupil", 
                                "sWeb_setEvent", "sWeb_registerPupils", "sWeb_setAssigned",
                        function($q, sData_allData, sData_groupsBySubjects, sData_eventsByGroups, sData_pupilsByGroups, sData_participationsByPupil,
                                sWeb_setSubject, sWeb_setGroup, sWeb_setTeaches, sWeb_putParticipation, sWeb_setParticipation, sWeb_setNoteByTeachesAndPupil, 
                                sWeb_setEvent, sWeb_registerPupils, sWeb_setAssigned) {
  var retVal;

  retVal = {
      insertGroup: insertGroup,
      insertSubject: insertSubject,
      insertEvent: insertEvent,
      registerPupils: registerPupils,
      insertNote: insertNote,
      putParticipation: putParticipation,
      insertParticipation: insertParticipation
  }

  return retVal;

  //data = {name, idGradeSubject}
  function insertGroup (data){
      return $q(function(resolve, reject){
        sWeb_setGroup(function(responseData){
            var teachesData = {
                idGradeGroup: responseData.idGradeGroup,
                idGradeSubject: data.idGradeSubject
            };

            sWeb_setTeaches(function(responseDataInner){
                var found = false;
                for(var i = 0; i < sData_allData.data.subjects.length && !found; i++)
                {
                    if(sData_allData.data.subjects[i].idGradeSubject == data.idGradeSubject)
                    {
                        sData_groupsBySubjects.data[sData_allData.data.subjects[i].name].push(responseData);
                        found = true;
                    }
                }
                
                sData_eventsByGroups.data[responseData.idGradeGroup] = [];
                sData_pupilsByGroups.data[responseData.idGradeGroup] = [];

                responseData.idGradeSubject = data.idGradeSubject;
                sData_allData.data.groups.push(responseData);
                if(sData_allData.data.teaches == null)
                    sData_allData.data.teaches = [];
                sData_allData.data.teaches.push(responseDataInner);
                resolve("successfuly added group");
            }, function(response){
                reject(response);
            }, teachesData);
        }, function(response){
            reject(response);
        }, data);
      });
  }

  //data = {name}
  function insertSubject(data){
      return $q(function(resolve, reject){
        sWeb_setSubject(function(responseData){
            sData_groupsBySubjects.data[responseData.name] = [];

            sData_allData.data.subjects.push(responseData);
            resolve("successfuly added subject");
        }, function(response){
            reject(response);
        }, data);
      });
  }

  //data = {idGradeGroup, fkTeaches, eventDate, eventDescription}
  function insertEvent(data){
    return $q(function(resolve, reject){
        sWeb_setEvent(function(responseData){
            sData_eventsByGroups.data[data.idGradeGroup] = responseData;

            responseData.idGradeGroup = data.idGradeGroup;
            sData_allData.data.events.push(responseData);
            resolve(responseData);
        }, function(response){
            reject(response);
        }, data);
    });
  }
  
  //data = {idParticipation, fkGradeEvent, fkPupil, grade}
  function putParticipation(data){
      return $q(function(resolve, reject){
          sWeb_putParticipation(function(responseData){

              var partData = sData_participationsByPupil.data;
              for(var i = 0; i < partData.length; i++)
              {
                  if(partData[i].idParticipation == responseData.idParticipation)
                  {
                      partData[i].fkPupil = responseData.fkPupil;
                      partData[i].fkGradeEvent = responseData.fkGradeEvent;
                      partData[i].grade = responseData.grade;
                  }
              }
              
          }, function(response){
              reject(response);
          }, data);
      });
  }

  //data = {idGradeEvent, colPupils: [{fkPupil, grade}]}
  function insertParticipation(data){
      return $q(function(resolve, reject){
          sWeb_setParticipation(function(responseData){
              resolve(responseData);
          }, function(response){
              reject(response);
          }, data);
      });
  }

  //data = {idTeaches, idPupil, note}
  function insertNote(data){
      return $q(function(resolve, reject){
          sWeb_setNoteByTeachesAndPupil(function(responseData){
              resolve(responseData);
          }, function(response){
              reject(response);
          }, data)
      });
  }

  //data = {idGradeGroup, pupils: [{forename, surname, email, username}]}
  function registerPupils(data){
      return $q(function(resolve, reject){
          //register pupils from AD in application Backend
          sWeb_registerPupils(function(responsePupils){
              //set assigned
              //data = {idGradGroup, colPupils: [{fkUser, forename, surname, email, username}]}
              sWeb_setAssigned(function(responseAssign){
                //register Pupils locally
                for(var i = 0; i < responsePupils.length; i++)
                {
                    if(sData_pupilsByGroups.data[data.idGradeGroup] != null)
                        sData_pupilsByGroups.data[data.idGradeGroup].push(responsePupils[i]);
                    // new instance so pupilsByGroups isnt polluted
                    var tmp = {
                        fkUser: responsePupils[i].fkUser,
                        forename: responsePupils[i].forename,
                        surname: responsePupils[i].surname,
                        username: responsePupils[i].username,
                        email: responsePupils[i].email,
                        idGradeGroup: data.idGradeGroup
                    }
                    sData_allData.data.pupils.push(tmp);
                }
                if(sData_pupilsByGroups.data[data.idGradeGroup] == null)
                    sData_pupilsByGroups.data[data.idGradeGroup] = responsePupils;
                //Maybe move inside loop with if condition if async
                resolve("successfully registered and assigned pupils");
              }, function(responseAssign){
                  console.log("error assigning registered pupils");
                  reject(responseAssign);
              }, {idGradeGroup: data.idGradeGroup, colPupils: responsePupils});
          }, function(responsePupils){
              console.log("error registrating pupils");
              reject(response);
          }, data.pupils);
      })
  }
}])

.factory('sData_allData', function() {
  var retVal;
  var applData = {
      breadcrumbs : [],
      user: {},
      groups: [],
      subjects: [],
      events: [],
      pupils: [],
      teaches: [],
      classes: []
  };

  /*
  #text# ... lokales Attribut, nicht in der DB

  applData = {
      user:  {idUser, forename, surname, email, username},

      groups: [
          {idGradeGroup, #idGradeSubject#, name}
      ],
      
      ####
      teachers: [
          {fkUser, forename, surname, email, password}
      ],
      ####

      subjects: [
          {idGradeSubject, name}
      ],
      events: [
          {idGradeEvent, #idGradeGroup#, fkTeaches, eventDate, eventDescription}
      ],
      pupils: [
          {fkUser, #idGradeGroup#, forename, surname, email, username}
      ],
      teaches: [
          {idTeaches, fkTeacher, fkGradeSubject, fkGradeGroup}
      ],
      classes: [
          {idClass, name, room}
      ]
  } 
  */

  retVal = {
      data: applData
  }

  return retVal;
})


/*
.factory('sData_teachers', ["$q", "sData_allData", "sWeb_getTeacher", 
                function($q, sData_allData, sWeb_getTeacher) {
  var teachers = {};
  var retVal;

  retVal = {
      data: teachers,
      fillData : fillData
  }

  return retVal;

  function fillData(){
    return $q(function(resolve, reject) {
        sWeb_getTeacher(function(responseData){
            teachers = responseData;
            retVal.data = teachers;
            sData_allData.data.teachers = teachers;
            resolve("Successfuly loaded teachers");
        }, function(response){
            reject(response);
        });
    })
  }
}])
*/
.factory('sData_authenticate', ["$q", "sData_allData", "sWeb_authenticate", "constants",
                function($q, sData_allData, sWeb_authenticate, constants) {
  var user = {};
  var retVal;

  retVal = {
      data: user,
      authenticate : authenticate
  }

  return retVal;

  function authenticate(userData){
    return $q(function(resolve, reject) {
        sWeb_authenticate(function(responseData){
            user = responseData;
            retVal.data = user;
            sData_allData.data.user = user;
/*
            window.alert(sData_allData.data.user.username);
*/
            constants.teacherId = user.idUser;
            resolve("Successfuly authenticated user");
        }, function(response){
            reject(response);
        }, {"username": userData.username,//btoa(userData.username),
            "password": btoa(userData.password)});
    })
  }
}])

.factory('sData_classes', ["$q", "sData_allData", "sWeb_getClass", 
                function($q, sData_allData, sWeb_getClass) {
  var classes = {};
  var retVal;

  retVal = {
      data: classes,
      fillData : fillData
  }

  return retVal;

  function fillData(){
    return $q(function(resolve, reject) {
        sWeb_getTeacher(function(responseData){
            classes = responseData;
            retVal.data = classes;
            window.alert(classes);
            sData_allData.data.classes = classes;
            resolve("Successfuly loaded classes");
        }, function(response){
            reject(response);
        });
    })
  }
}])

.factory('sData_email', ["$q", "sWeb_sendEmail", 
                function($q, sWeb_sendEmail) {
  var email = {};
  var retVal;

  retVal = {
      data: email,
      send : send
  }

  return retVal;

  function send(){
    return $q(function(resolve, reject) {
        sWeb_sendEmail(function(responseData){
            email = responseData;
            retVal.data = email;
            resolve("Successfuly sent emails: " + responseData.status);
        }, function(response){
            reject(response);
        });
    })
  }
}])

.factory('sData_pupilsByClass', ["$q", "sWeb_getPupilByClass", 
                function($q, sWeb_getPupilByClass) {
  var pupils = {};
  var retVal;

  retVal = {
      data: pupils,
      fillData : fillData
  }

  return retVal;

  //data = {classname}
  function fillData(data){
    return $q(function(resolve, reject) {
        sWeb_getPupilByClass(function(responseData){
            pupils = responseData;
            retVal.data = pupils;
            resolve("Successfuly loaded pupils");
        }, function(response){
            reject(response);
        }, data);
    })
  }
}])

.factory('sData_notesByPupil', ["$q", "sWeb_getNoteByTeachesAndPupil", 
                function($q, sWeb_getNoteByTeachesAndPupil) {
  var notes = {};
  var retVal;

  retVal = {
      data: notes,
      fillData : fillData
  }

  return retVal;

  //data = {idTeaches, idPupil}
  function fillData(data){
    return $q(function(resolve, reject) {
        sWeb_getNoteByTeachesAndPupil(function(responseData){
            notes = responseData;
            retVal.data = notes;
            resolve("Successfuly loaded classes");
        }, function(response){
            reject(response);
        }, data);
    })
  }
}])

.factory('sData_noteHistory', ["$q", "sWeb_getNoteHistory", 
                function($q, sWeb_getNoteHistory) {
  var notes = {};
  var retVal;

  retVal = {
      data: notes,
      fillData : fillData
  }

  return retVal;

  //data = {idNote}
  function fillData(data){
    return $q(function(resolve, reject) {
        sWeb_getNoteHistory(function(responseData){
            notes = responseData;
            retVal.data = notes;
            resolve("Successfuly loaded note history");
        }, function(response){
            reject(response);
        }, data);
    })
  }
}])

.factory('sData_teaches', ["$q", "sData_allData", "sWeb_getTeachesByTeacherAndSubject", 
                function($q, sData_allData, sWeb_getTeachesByTeacherAndSubject) {
  var teaches = {};
  var retVal;

  retVal = {
      data: teaches,
      fillData : fillData
  }

  return retVal;

  //data = {idGradeSubject}
  function fillData(data){
    return $q(function(resolve, reject) {
        sWeb_getTeachesByTeacherAndSubject(function(responseData){
            teaches = responseData;
            retVal.data = teaches;
            sData_allData.data.teaches = responseData;
            resolve("Successfuly loaded teaches");
        }, function(response){
            reject(response);
        }, data);
    })
  }
}])

.factory('sData_participationsByPupil', ["$q", "sData_allData", "sWeb_getParticipationByPupilAndTeaches", 
                function($q, sData_allData, sWeb_getParticipationByPupilAndTeaches) {
  var participation = {};
  var retVal;

  retVal = {
      data: participation,
      fillData : fillData
  }

  return retVal;

  //data = {idPupil, idTeaches}
  function fillData(data){
    return $q(function(resolve, reject) {
        sWeb_getParticipationByPupilAndTeaches(function(responseData){
            participation = responseData;
            retVal.data = participation;
            resolve("Successfuly loaded participations");
        }, function(response){
            reject(response);
        }, data);
    })
  }
}])

.factory('sData_participationHistory', ["$q", "sWeb_getParticipationHistory", 
                function($q, sWeb_getParticipationHistory) {
  var participations = {};
  var retVal;

  retVal = {
      data: participations,
      fillData : fillData
  }

  return retVal;

  //data = {idParticipation}
  function fillData(data){
    return $q(function(resolve, reject) {
        sWeb_getNoteHistory(function(responseData){

            participations = responseData;
            retVal.data = participations;
            resolve("Successfuly loaded participation history");
        }, function(response){
            reject(response);
        }, data);
    })
  }
}])

.factory('sData_participationsByEvent', ["$q", "sWeb_getParticipationByEvent", 
                function($q, sWeb_getParticipationByEvent) {
  var participations = {};
  var retVal;

  retVal = {
      data: participations,
      fillData : fillData
  }

  return retVal;

  //data = {idGradeEvent}
  function fillData(data){
    return $q(function(resolve, reject) {
        sWeb_getParticipationByEvent(function(responseData){
            participations = responseData;
            retVal.data = participations;
            resolve("Successfuly loaded participations");
        }, function(response){
            reject(response);
        }, data);
    })
  }
}])

.factory('sData_groupsBySubjects', ["$q", "sData_allData", "sWeb_getSubjectByTeacher", "sWeb_getGroupByTeacherAndSubject", 
                            function($q, sData_allData, sWeb_getSubjectByTeacher, sWeb_getGroupByTeacherAndSubject) {
  /*
    groupsBySubjects = {
        "subjName" : [
            {idGradeGroup, idGradeSubject, name}
        ]
    }
  */
  var groupsBySubjects = {};
  var retVal;

  retVal = {
      data: groupsBySubjects,
      fillData: fillData
  }

  return retVal;

  function fillData(){
      return $q(function(resolve, reject){
        if(sData_allData.data.groups == null)
            sData_allData.data.groups = [];
        var tmpI;
        //console.log("groups by subjects");
        sWeb_getSubjectByTeacher(function(responseData){
            if(responseData.length > 0)
            {
                sData_allData.data.subjects = responseData;
                //console.log("response...");
                for(var i = 0; i < responseData.length; i++)
                {
                    //console.log("iteration: " + i);
                    tmpI = parseInt(i + " "); //new reference
                    fetchGroups(responseData, tmpI, resolve, reject);
                }
            }
            else
            {
                resolve("No Data Found");
            }
        }, function(response){
            reject(response);
        });
    });
  }

  function fetchGroups(responseData, tmpIdx, resolve, reject)
  {
      sWeb_getGroupByTeacherAndSubject(function(responseDataInner){
            groupsBySubjects[responseData[tmpIdx].name] = responseDataInner;
            for(var j = 0; j < responseDataInner.length; j++)
            {
                //console.log("response i:" + tmpIdx);
                responseDataInner[j].idGradeSubject = responseData[tmpIdx].idGradeSubject;
                sData_allData.data.groups.push(responseDataInner[j]);
                if(tmpIdx == responseData.length - 1 && j == responseDataInner.length -1)
                {
                    retVal.data = groupsBySubjects;
                    resolve("Successfully loaded groupsBySubjects");
                }
            }
            
        }, function(response){
            reject(response);
        }, {idGradeSubject: responseData[tmpIdx].idGradeSubject});
  }
}])

.factory('sData_eventsByGroups', ["$q", "sData_allData", "sData_groupsBySubjects",  "sWeb_getEventByGroup",
                            function($q, sData_allData, sData_groupsBySubject, sWeb_getEventByGroup) {
  /*
  eventsByGroups = {
      idGradeGroup : [
          {idGradeEvent, fkTeaches, eventDate, eventDescription}
      ]
  }
  */
  var eventsByGroups = {};
  var retVal;

  retVal = {
      data: eventsByGroups,
      fillData: fillData
  }

  return retVal;

  function fillData(){
      return $q(function(resolve, reject){
        var baseData = sData_groupsBySubject.data;
        //if(sData_allData.data.events == null)
            sData_allData.data.events = [];
        /*
        if(baseData == null)
        {
            sData_groupsBySubject.fillData().then(function(response){
                //baseData should have updated hence call by reference
                //for bug preventing tho
                baseData = sData_groupsBySubject.data;
            },function(response){
                reject("Dependent Load not working! " + response);
            })
        }*/

        var tmpI;
        var tmpJ;
        var keys = Object.keys(baseData);
        for(var i = 0; i < keys.length; i++)
        {
            
            for(var j = 0; j < baseData[keys[i]].length; j++)
            {
                tmpI = parseInt(" " +i);
                tmpJ = parseInt(" "+j);
                //Pushes every required group into the collection
                eventsByGroups[baseData[keys[i]][j].idGradeGroup];

                fetchEvents(keys, baseData, tmpI, tmpJ, resolve, reject);
            }
        }
    });
  }

  function fetchEvents(keys, baseData, tmpI, tmpJ, resolve, reject)
  {
      sWeb_getEventByGroup(function(responseData){
        // sets the events for each group
        eventsByGroups[baseData[keys[tmpI]][tmpJ].idGradeGroup] = responseData;
        for(var l = 0; l < responseData.length; l++)
        {
            //modifies the data and writes it to local data obj 
            responseData[l].idGradeGroup = baseData[keys[tmpI]][tmpJ].idGradeGroup;
            sData_allData.data.events.push(responseData[l]);

            //if done
            if(tmpI == keys.length - 1 &&
                tmpJ == baseData[keys[tmpI]].length - 1 &&
                l == responseData.length -1)
            {
                retVal.data = eventsByGroups;
                resolve("Successfully loaded eventsByGroups");
            }
        }
    }, function(response){
        reject(response);
    }, baseData[keys[tmpI]][tmpJ].idGradeGroup);
  }
}])

.factory('sData_pupilsByGroups', ["$q", "sData_allData", "sData_groupsBySubjects",  "sWeb_getPupilByGroup", 
                            function($q, sData_allData, sData_groupsBySubject, sWeb_getPupilByGroup) {
  /*
  pupilsByGroups = {
      idGradeGroup : [
          {fkUser, forename, surname, email, username}
      ]
  }
  */
  
  var pupilsByGroups = {};
  var retVal;

  retVal = {
      data: pupilsByGroups,
      fillData: fillData
  }

  return retVal;

  function fillData(data){
      return $q(function(resolve, reject){
        var baseData = sData_groupsBySubject.data;
        if(sData_allData.data.pupils == null)
            sData_allData.data.pupils = [];

        pupilsByGroups = {};
        /*
        if(baseData == null)
        {
            sData_groupsBySubject.fillData().then(function(response){
                //baseData should have updated hence call by reference
                //for bug preventing tho
                baseData = sData_groupsBySubject.data;
            },function(response){
                reject("Dependent Load not working! " + response);
            })
        }
        */


        sWeb_getPupilByGroup(function(responseData){
            // sets the events for each group
            pupilsByGroups[data.idGradeGroup] = responseData;
            for(var l = 0; l < responseData.length; l++)
            {
                //modifies the data and writes it to local data obj 
                responseData[l].idGradeGroup = data.idGradeGroup;
                sData_allData.data.pupils.push(responseData[l]);
                //if done
                if(l == responseData.length -1)
                {
                    //console.log("done");
                    retVal.data = pupilsByGroups;
                    resolve("Successfully loaded pupilsByGroups");
                }
            }
        }, function(response){
            reject(response);
        }, data.idGradeGroup);


    /*
        var tmpI;
        var tmpJ;
        var keys = Object.keys(baseData);
        for(var i = 0; i < keys.length; i++)
        {
            console.log("4x?");
            for(var j = 0; j < baseData[keys[i]].length; j++)
            {
                tmpI = parseInt(" "+i);
                tmpJ = parseInt(" "+j);
                //pupilsByGroups every required group into the collection
                pupilsByGroups[baseData[keys[i]][j].idGradeGroup] = [];

                fetchPupils(keys, baseData, tmpI, tmpJ, resolve, reject);
            }
        }
        */
    });
  }

  function fetchPupils(keys, baseData, tmpI, tmpJ, resolve, reject)
  {
      sWeb_getPupilByGroup(function(responseData){
        // sets the events for each group
        pupilsByGroups[baseData[keys[tmpI]][tmpJ].idGradeGroup] = responseData;
        for(var l = 0; l < responseData.length; l++)
        {
            //modifies the data and writes it to local data obj 
            responseData[l].idGradeGroup = baseData[keys[tmpI]][tmpJ].idGradeGroup;
            sData_allData.data.pupils.push(responseData[l]);

            /*
            console.log("fetch");
            console.log(tmpI);
            console.log(keys.length - 1);
            console.log(tmpJ);
            console.log(baseData[keys[tmpI]].length - 1);
            console.log(l);
            console.log(responseData.length -1);
            */
            //if done
            if(tmpI == keys.length - 1 &&
                tmpJ == baseData[keys[tmpI]].length - 1 &&
                l == responseData.length -1)
            {
                //console.log("done");
                retVal.data = pupilsByGroups;
                resolve("Successfully loaded pupilsByGroups");
            }
        }
    }, function(response){
        reject(response);
    }, baseData[keys[tmpI]][tmpJ].idGradeGroup);
  }
}])