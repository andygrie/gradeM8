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
        html: '<p>Hello, you added following grades today:</p><table><tr><th>Forename</th><th>Surname</th><th>Description</th><th>Grade</th></tr>'
    };



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
exports.sendTodaysGrades = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("select u.idUser, u.forename, u.surname, u.email, u.password from gradeUser u INNER JOIN teacher t ON t.fkUser = u.idUser WHERE u.idUser = @id", function (err) {
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
            getGrades(result, res);
        });
        request.addParameter('id', TYPES.Int, req.params.idTeacher);
        connection.execSql(request);
    }
}
function getGrades(teacher, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("select u.forename, u.surname, e.eventDescription, p.grade from gradeUser u" + 
                        " INNER JOIN pupil pu ON pu.fkUser = u.idUser" +
                        " INNER JOIN participation p ON p.fkPupil = pu.fkUser" +
                        " INNER JOIN gradeEvent e ON e.idGradeEvent = p.fkGradeEvent" +
                        " INNER JOIN teaches t ON t.idTeaches = e.fkTeaches WHERE t.fkTeacher = @id AND p.grade != 0 AND datediff(day, e.eventDate, GETDATE()) = 0",
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
            sendMail(results, teacher, res);
        });
        request.addParameter('id', TYPES.Int, teacher.idUser);
        connection.execSql(request);
    }
    
}
function sendMail(results, teacher, res) {
    mailOptions.to = teacher.email;
    results.forEach(function (result) {
        mailOptions.html += "<tr><td>" + result.surname + "</td><td>" + result.forename + "</td><td>" + result.eventDescription + "</td><td>" + result.grade + "</td></tr>";
    });
    mailOptions.html += "</table>";
    if (results.length == 0)
        mailOptions.html += "<p>You have recorded no grades today.</p>";
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json({ status: error });
        } else {
            res.json({ status: 'ok' });
        };
    });
}