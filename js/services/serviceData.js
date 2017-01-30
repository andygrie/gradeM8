angular.module('moduleData', [])

.factory('sData_CUDHandler', ["$q", "sData_allData", "sData_groupsBySubjects", "sData_eventsByGroups", "sData_pupilsByGroups", "sData_participationsByPupil","sData_setEMailDates", "sData_teaches",
                                "sWeb_setSubject", "sWeb_setGroup", "sWeb_setTeaches", "sWeb_putParticipation", "sWeb_setParticipation", "sWeb_setNoteByTeachesAndPupil", 
                                "sWeb_setEvent", "sWeb_registerPupils", "sWeb_setAssigned", "sWeb_putNote","sWeb_setEMailDates", "sWeb_putEvent", "sWeb_deleteEvent", "sWeb_putTeaches",
                        function($q, sData_allData, sData_groupsBySubjects, sData_eventsByGroups, sData_pupilsByGroups, sData_participationsByPupil,sData_setEMailDates, sData_teaches,
                                sWeb_setSubject, sWeb_setGroup, sWeb_setTeaches, sWeb_putParticipation, sWeb_setParticipation, sWeb_setNoteByTeachesAndPupil, 
                                sWeb_setEvent, sWeb_registerPupils, sWeb_setAssigned, sWeb_putNote, sWeb_setEMailDates, sWeb_putEvent, sWeb_deleteEvent, sWeb_putTeaches) {
  var retVal;

  retVal = {
      insertGroup: insertGroup,
      insertSubject: insertSubject,
      insertEvent: insertEvent,
      insertNote: insertNote,
      insertParticipation: insertParticipation,
      insertEMailDates: insertEMailDates,

      registerPupils: registerPupils,
      
      putParticipation: putParticipation,
      putEvent: putEvent,
      putNote: putNote,

      deleteEvent: deleteEvent
  }

  return retVal;

  //data = {idGradeEvent}
  function deleteEvent(data){
      return $q(function(resolve, reject){
          sWeb_deleteEvent(function(response){resolve(response)},
                            function(response){reject(response)}, 
                            data);
      });
  }

  //data = {idGradeEvent, fkTeaches, eventDate, eventDescription}
  function putEvent(data){
      return $q(function(resolve, reject){
          sWeb_putEvent(function(response){resolve(response)},
                            function(response){reject(response)}, 
                            data);
      })
  }

    function insertEMailDates(data){
        console.log("in insertEMail");
        return $q(function(resolve, reject){
            sWeb_setEMailDates(function(responseData){

                console.log("in f2");
                sData_setEMailDates.data=[];
                sData_setEMailDates.data[responseData.name] = [];
                sData_setEMailDates.data.push(responseData);

                resolve(responseData);
                resolve("successfuly added Dates");
            }, function(response){
                reject(response);
            }, data);
        });
    }

  //data = {name, idGradeSubject}
  function insertGroup (data){
      return $q(function(resolve, reject){
        sWeb_setGroup(function(insertGroupResponse){
            var teachesData = {
                idGradeGroup: insertGroupResponse.idGradeGroup,
                idGradeSubject: data.idGradeSubject
            };

            //set Teaches or put if first group
            var subj = getSubjectById(data.idGradeSubject);
            //console.log("check for put...");
            if(sData_groupsBySubjects.data[subj.name].length == 0)
            {
                //console.log("put detected...");
                sData_teaches.fillData({idGradeSubject: data.idGradeSubject}).then(function(fillResponse){
                    //there must only be one teaches entry
                    teachesData.idTeaches = sData_teaches.data[0].idTeaches;
                    //console.log("teaches filled..");

                    sWeb_putTeaches(function(teachesResponse){
                        //console.log("put succeeded");
                        finalize(resolve, data, insertGroupResponse, teachesData);
                    }, function(response){
                        //console.log("teaches put failed...");
                        reject(fillResponse);
                    }, teachesData);
                }, function(fillResponse){
                    console.log("teaches fetch failed...");
                    reject(fillResponse);
                });
            }
            else
            {
                //console.log("no put...");
                sWeb_setTeaches(function(teachesResponse){
                    finalize(resolve, data, insertGroupResponse, teachesResponse);
                }, function(response){
                    reject(response);
                }, teachesData);
            }
            

            
        }, function(response){
            reject(response);
        }, data);
      });

      function getSubjectById(idSubj){
          var subj = null;

          for(var i = 0; i < sData_allData.data.subjects.length && subj == null; i++)
          {
              if(sData_allData.data.subjects[i].idGradeSubject == idSubj)
              {
                  subj = sData_allData.data.subjects[i];
              }
          }

          return subj;
      }

      function finalize(resolve, data, insertGroupResponse, teachesResponse){
            var found = false;
            for(var i = 0; i < sData_allData.data.subjects.length && !found; i++)
            {
                if(sData_allData.data.subjects[i].idGradeSubject == data.idGradeSubject)
                {
                    sData_groupsBySubjects.data[sData_allData.data.subjects[i].name].push(insertGroupResponse);
                    found = true;
                }
            }
            
            sData_eventsByGroups.data[insertGroupResponse.idGradeGroup] = [];
            sData_pupilsByGroups.data[insertGroupResponse.idGradeGroup] = [];

            insertGroupResponse.idGradeSubject = data.idGradeSubject;
            sData_allData.data.groups.push(insertGroupResponse);

            if(sData_allData.data.teaches == null)
                sData_allData.data.teaches = [];

            sData_allData.data.teaches.push(teachesResponse);

            resolve("successfuly added group");
      }
  }

  //data = {name}
  function insertSubject(data){
      return $q(function(resolve, reject){
        sWeb_setSubject(function(responseData){

            console.log("subject added successfully, trying to add dummy teaches...");

            var teachesDummyData = {
                idGradeSubject: responseData.idGradeSubject,
                idGradeGroup: null
            }

            sWeb_setTeaches(function(response){
                sData_groupsBySubjects.data[responseData.name] = [];
                sData_allData.data.subjects.push(responseData);
                resolve("successfuly added subject");
            }, function(response){
                reject(response);
            }, teachesDummyData);
            
        }, function(response){
            reject(response);
        }, data);
      });
  }

  //data = {idGradeGroup, fkTeaches, eventDate, eventDescription}
  function insertEvent(data){
    return $q(function(resolve, reject){
        sWeb_setEvent(function(responseData){
            sData_eventsByGroups.data.push(responseData);

            responseData.idGradeGroup = data.idGradeGroup;
            sData_allData.data.events.push(responseData);
            resolve(responseData);
        }, function(response){
            reject(response);
        }, data);
    });
  }
  
  //data = {idParticipation, grade}
  function putParticipation(data){
      return $q(function(resolve, reject){
          sWeb_putParticipation(function(responseData){

              var partData = sData_participationsByPupil.data;
              for(var i = 0; i < partData.length; i++)
              {
                  if(partData[i].idParticipation == responseData.idParticipation)
                  {
                      partData[i].grade = responseData.grade;
                  }
              }
              resolve("success");
          }, function(response){
              reject(response);
          }, data);
      });
  }

  //data = {idNote, note}
  function putNote(data){
      return $q(function(resolve, reject) {
          console.log("data:");
          console.log(data);
          sWeb_putNote(function(response){
              resolve("success");
          }, function(response){
              reject("error");
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
              //data = {idGradGroup, colPupils: [{fkPupil}]}
              dataAssign = [];
              for(var i = 0; i < responsePupils.length; i++)
              {
                  dataAssign.push({fkPupil: responsePupils[i].fkUser});
              }
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
              }, {idGradeGroup: data.idGradeGroup, colPupils: dataAssign});
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
      user:  {fkUser, forename, surname, email, username},

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
      authenticate : authenticate,
      isAuthenticated: isAuthenticated
  }

  return retVal;

  function isAuthenticated(){
      var authenticated = false;

      if(sData_allData.data.user.username != null &&
            sData_allData.data.user.username != undefined)
      {
         authenticated = true;      
      }

      return authenticated;
  }

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
        sWeb_getClass(function(responseData){
            classes = responseData;
            retVal.data = classes;

            sData_allData.data.classes = classes;
            resolve("Successfuly loaded classes");
        }, function(response){
            reject(response);
        });
    })
  }
}])

.factory('sData_email', ["$q", "sWeb_setEMailDates",
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

    .factory('sData_setEMailDates', ["$q", "sWeb_setEMailDates",
        function($q, sWeb_setEMailDates) {
            var email = {};
            var retVal;

            retVal = {
                data: email,
                send : send
            }

            return retVal;

            function send(data){
                console.log("in send");
                return $q(function(resolve, reject) {
                    sWeb_setEMailDates(function(responseData){
                        email = responseData;
                        retVal.data = email;
                        resolve("Successfuly sent emails: " + responseData.status);
                    }, function(response){
                        reject(response);
                    },data);
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
            resolve(responseData);
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
        sWeb_getParticipationHistory(function(responseData){

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
                //console.log("subjects by teacher response: ");
                //console.log(responseData);
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
            //console.log("groups response: ");
            //console.log(responseDataInner);
            for(var j = 0; j < responseDataInner.length; j++)
            {
                //console.log("response i:" + tmpIdx);
                responseDataInner[j].idGradeSubject = responseData[tmpIdx].idGradeSubject;
                sData_allData.data.groups.push(responseDataInner[j]);
            }
            
            if(tmpIdx == responseData.length - 1)
            {
                retVal.data = groupsBySubjects;
                resolve("Successfully loaded groupsBySubjects");
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
  var events = [];
  var retVal;

  retVal = {
      data: events,
      fillData: fillData
  }

  return retVal;

  //data {idGradeGroup}
  function fillData(data){
      return $q(function(resolve, reject) {
        sWeb_getEventByGroup(function(responseData){
            events = responseData;
            retVal.data = events;
            resolve(responseData);
        }, function(response){
            reject(response);
        }, data);
    })
  }
  /* wai u do dis
  function fillData(){
      return $q(function(resolve, reject){
        var baseData = sData_groupsBySubject.data;
        sData_allData.data.events = [];

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
  */
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

        pupilsByGroups = [];
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

            if(responseData.length == 0)
                resolve("No Data found");
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