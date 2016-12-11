var sql = require('mssql');
var ted = require('tedious');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'm8grade@gmail.com', 
            pass: 'Grade2016'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        from: 'm8grade@gmail.com', 
        to: '', 
        subject: 'Grades',
        html: '<p>Hello, you added following grades today:</p><table><tr><th>Surname</th><th>Forename</th><th>Subject</th><th>Description</th><th>Event Date</th><th>Grade On</th><th>Grade</th></tr>'
    };

    var atob = require('atob');
    var ActiveDirectory = require('activedirectory');
    var adConfig = {
        url: 'ldap://212.152.179.122',
        //url: 'ldap://192.168.128.253',
        baseDN: 'ou=schueler,ou=Benutzer,dc=htl-vil,dc=local'
    }

    var username = 'griessera@htl-vil';
    var password = atob('emFzcDI1');


    var ad = new ActiveDirectory(adConfig);

var Connection = ted.Connection;
var config = {
    userName: 'grademin',
    password: 'Grade2016',
    server: 'grade-server.database.windows.net',
    options: { encrypt: true, database: 'gradeDB' }
};
var Request = ted.Request;
var TYPES = ted.TYPES;  

exports.getTeachers = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);  
    function executeStatement() {
        request = new Request("select u.idUser, u.forename, u.surname, u.email, u.password from gradeUser u INNER JOIN teacher t ON t.fkUser = u.idUser", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            var result = {};
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result[column.metadata.colName] = column.value;
                }
            });
            results.push(result);
            result = {};
        });

        request.on('doneProc', function (rowCount, more) {
            res.send(results);
        });
        connection.execSql(request);
    }  
}
exports.insertUser = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("INSERT INTO gradeUser(forename, surname, email, password) VALUES(@fn, @sn, @em, @pw); select @@identity", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            result = {
                idUser: columns[0].value,
                forename: req.body.forename,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password
            };
        });

        request.on('doneProc', function (rowCount, more) {
            res.send(result);
            insertTeacher(result.idUser);
        });

        request.addParameter('fn', TYPES.VarChar, req.body.forename);
        request.addParameter('sn', TYPES.VarChar, req.body.surname);
        request.addParameter('em', TYPES.VarChar, req.body.email);
        request.addParameter('pw', TYPES.NVarChar, req.body.password);
        connection.execSql(request);
    }
}
function insertTeacher(idUser) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("INSERT INTO teacher(fkUser) VALUES(@id)", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('row', function (columns) {
        });
        request.on('doneProc', function (rowCount, more) {
        });
        request.addParameter('id', TYPES.Int, idUser);
        connection.execSql(request);
    }
}
exports.updateUser = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("UPDATE gradeUser SET forename = @fn, surname = @sn, email = @em, password = @pw WHERE idUser = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });    
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });

        request.addParameter('fn', TYPES.VarChar, req.body.forename);
        request.addParameter('sn', TYPES.VarChar, req.body.surname);
        request.addParameter('em', TYPES.VarChar, req.body.email);
        request.addParameter('pw', TYPES.NVarChar, req.body.password);
        request.addParameter('id', TYPES.Int, req.params.idUser);
        connection.execSql(request);
    }
}
exports.deleteTeacher = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("DELETE FROM teacher WHERE fkUser = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
            deleteUser(req.params.idUser);
        });
        request.addParameter('id', TYPES.Int, req.params.idUser);
        connection.execSql(request);
    }
}
function deleteUser(idUser) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("DELETE FROM gradeUser WHERE idUser = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.addParameter('id', TYPES.Int, idUser);
        connection.execSql(request);
    }
}

exports.sendGradesByEventDate = function (req, res) {
    var requestString = "select u.username, e.eventDescription, p.grade, t.fkTeacher, e.eventDate, p.gradedOn, p.successor, s.name from gradeUser u " +
        "INNER JOIN pupil pu ON pu.fkUser = u.idUser " +
        "INNER JOIN participation p ON p.fkPupil = pu.fkUser " +
        "INNER JOIN gradeEvent e ON e.idGradeEvent = p.fkGradeEvent " +
        "INNER JOIN teaches t ON t.idTeaches = e.fkTeaches " +
        "INNER JOIN gradeSubject s ON t.fkGradeSubject = s.idGradeSubject " +
        "WHERE p.successor = 0 AND t.fkTeacher = @id AND p.grade != -1 AND datediff(day, e.eventDate, @lower) <= 0 AND datediff(day, e.eventDate, @upper) >= 0 " +
        "ORDER BY e.eventDescription, u.username";
    sendTodaysGrades(req, res, requestString);
}
exports.sendGradesByGradedDate = function (req, res) {
    var requestString = "select u.username, e.eventDescription, p.grade, t.fkTeacher, e.eventDate, p.gradedOn, p.successor, s.name from gradeUser u " +
        "INNER JOIN pupil pu ON pu.fkUser = u.idUser " +
        "INNER JOIN participation p ON p.fkPupil = pu.fkUser " +
        "INNER JOIN gradeEvent e ON e.idGradeEvent = p.fkGradeEvent " +
        "INNER JOIN teaches t ON t.idTeaches = e.fkTeaches " +
        "INNER JOIN gradeSubject s ON t.fkGradeSubject = s.idGradeSubject " +
        "WHERE p.successor = 0 AND t.fkTeacher = @id AND p.grade != -1 AND datediff(day, p.gradedOn, @lower) <= 0 AND datediff(day, p.gradedOn, @upper) >= 0 " +
        "ORDER BY e.eventDescription, u.username";
    sendTodaysGrades(req, res, requestString);
}

function sendTodaysGrades(req, res, requestString) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("select u.idUser, u.username from gradeUser u INNER JOIN teacher t ON t.fkUser = u.idUser WHERE u.idUser = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result[column.metadata.colName] = column.value;
                }
            });
        });

        request.on('doneProc', function (rowCount, more) {
            getGrades(result, res, req.body.lowerDate, req.body.upperDate);
        });
        request.addParameter('id', TYPES.Int, req.body.idTeacher);
        connection.execSql(request);
    }
}
function getGrades(teacher, res, lowerDate, upperDate, requestString) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request(requestString,
            function (err) {
                if (err) {
                    console.log(err);
                }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            result = {};
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result[column.metadata.colName] = column.value;
                }
            });
            results.push(result);
            result = {};
        });

        request.on('doneProc', function (rowCount, more) {
            getPupilsByUsernameFromAD(results, teacher, res);
        });
        request.addParameter('id', TYPES.Int, teacher.idUser);
        request.addParameter('lower', TYPES.Date, lowerDate);
        request.addParameter('upper', TYPES.Date, upperDate);
        connection.execSql(request);
    }
}

function getPupilsByUsernameFromAD(pupils, teacher, res) {
    ad.authenticate(username, password, function (err, auth) {
        var pupilsHelp = {};
        var finalPupils = [];
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
        }

        if (auth) {
            ad.opts.bindDN = username;
            ad.opts.bindCredentials = password;
           
            var query = '(|';
            pupils.forEach(function (item) {
                query = query + '(cn=' + item.username + ')';
                pupilsHelp[item.username] = {
                    fkUser: item.fkUser,
                    eventDescription: item.eventDescription,
                    grade: item.grade,
                    eventDate: item.eventDate,
                    gradedOn: item.gradedOn,
                    subject: item.name
                };
            });
            query = query + ')';

            ad.findUsers(query, function (err, users) {
                if (err) {
                    console.log('ERROR: ' + JSON.stringify(err));
                    return;
                }

                if ((!users) || (users.length == 0)) console.log('No users found.');
                else {
                    users.forEach(function (item) {
                        finalPupils.push({
                            fkUser: pupilsHelp[item.cn].fkUser,
                            eventDescription: pupilsHelp[item.cn].eventDescription,
                            grade: pupilsHelp[item.cn].grade,
                            eventDate: pupilsHelp[item.cn].eventDate.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                            gradedOn: pupilsHelp[item.cn].gradedOn.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                            subject: pupilsHelp[item.cn].subject,
                            username: item.cn,
                            forename: item.givenName,
                            surname: item.sn,
                            email: item.mail
                        });
                    });
                    getTeacherFromAD(finalPupils, teacher, res);
                }
            });
        }
        else {
            res.status(400);
            res.send('wrong credentials');
        }
    });
}

function getTeacherFromAD(results, teacher, res) {
    ad.opts.bindDN = username;
    ad.opts.bindCredentials = password;
    ad.findUser(teacher.username, function (err, user) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
            res.status(500);
            res.send({
                'message': 'ERROR: ' + JSON.stringify(err)
            });
            return;
        }
        if (!user) {
            console.log('User: ' + username + ' not found.');
            res.status(500);
            res.send({
                'message': 'User: ' + username + ' not found.'
            });
        }
        else {
            var teacherFromAD = {
                email: user.mail,
                forename: user.givenName,
                idUser: teacher.idUser,
                surname: user.sn,
                username: user.cn
            }
            sendMail(results, teacherFromAD, res);
        }
    });
}

function sendMail(results, teacher, res) {
    mailOptions.to = teacher.email;
    var emptyResults = true;

    results.sort(function (a, b) {
        var result = 0;
        (a.subject > b.subject) ? result = 1 : ((b.subject > a.subject) ? result = -1 : result = 0);
        if (result == 0) {
            (a.eventDescription > b.eventDescription) ? result = 1 : ((b.eventDescription > a.eventDescription) ? result = -1 : result = 0);
            if (result == 0) {
                (a.surname > b.surname) ? result = 1 : ((b.surname > a.surname) ? result = -1 : result = 0);
                if (result == 0)
                    (a.forename > b.forename) ? result = 1 : ((b.forename > a.forename) ? result = -1 : result = 0);
            }
        }
        return result;
    }); 

    results.forEach(function (result) {
        mailOptions.html += "<tr><td>" + result.surname + "</td><td>" + result.forename + "</td><td>" + result.subject + "</td><td>" + result.eventDescription + "</td><td>" + result.eventDate + "</td><td>" + result.gradedOn + "</td>";
        if (result.grade != 0)
            mailOptions.html += "<td>" + result.grade + "</td></tr>";
        else
            mailOptions.html += "<td>abscent</td></tr>";
        emptyResults = false;
    });
    mailOptions.html += "</table>";
    if (emptyResults)
        mailOptions.html += "<p>You have recorded no grades in the selected period.</p>";
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json({ status: error });
        } else {
            res.json({ status: 'ok' });
        };
    });
}