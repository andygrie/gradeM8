
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var teacherService = require('./services/teacher');
var classService = require('./services/class');
var pupilService = require('./services/pupil');
var groupService = require('./services/group');
var subjectService = require('./services/subject');
var teachesService = require('./services/teaches');
var assignedService = require('./services/assignedto');

var cors = require('cors');
var app = express();
app.use(express.bodyParser());
app.use(cors());
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/boert', routes.bört);
app.get('/contact', routes.contact);

app.get('/teacher', teacherService.getTeachers);
app.post('/teacher', teacherService.insertUser);
app.put('/teacher/:idUser', teacherService.updateUser);
app.delete('/teacher/:idUser', teacherService.deleteTeacher);

app.get('/class', classService.getClasses);
app.post('/class', classService.insertClass);
app.put('/class/:idClass', classService.updateClass);
app.delete('/class/:idClass', classService.deleteClass);

app.get('/pupil', pupilService.getPupil);
app.post('/pupil', pupilService.insertUser);
app.put('/pupil/:idUser', pupilService.updateUser);
app.delete('/pupil/:idUser', pupilService.deletePupil);
app.get('/pupil/byClass/:idClass', pupilService.getPupilsByClass);
app.get('/pupil/byGroup/:idGradeGroup', pupilService.getPupilsByGroup);

app.get('/group', groupService.getGroups);
app.get('/group/:idGroup', groupService.getGroup);
app.post('/group', groupService.insertGroup);
app.put('/group/:idGroup', groupService.updateGroup);

app.get('/subject', subjectService.getSubjects);
app.get('/subject/:idSubject', subjectService.getSubject);
app.post('/subject', subjectService.insertSubject);
app.put('/subject/:idSubject', subjectService.updateSubject);
app.delete('/subject/:idSubject', subjectService.deleteSubject);

app.get('/teaches/byTeacherAndSubject/:idTeacher/:idSubject', teachesService.getTeachesByTeacherAndSubject);
app.post('/teaches', teachesService.insertTeaches);
app.put('/teaches/:idTeaches', teachesService.updateTeaches);
app.delete('/teaches/:idTeaches', teachesService.deleteTeaches);

app.post('/assigned/:fkGradeGroup', assignedService.insertAssignedTo);
app.get('/assigned', assignedService.getAssignedTo);
app.delete('/assigned', assignedService.deleteAssignedTo);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
