var sql = require('mssql');
var ted = require('tedious');

var Connection = ted.Connection;
var config = {
    userName: 'grademin',
    password: 'Grade2016',
    server: 'grade-server.database.windows.net',
    options: { encrypt: true, database: 'gradeDB' }
};
var Request = ted.Request;
var TYPES = ted.TYPES;  

exports.getTeachesByTeacherAndSubject = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("select t.idTeaches, t.fkTeacher, t.fkGradeSubject, t.fkGradeGroup from teaches t WHERE t.fkTeacher = @fkt AND t.fkGradeSubject = @fks", function (err) {
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
        request.addParameter('fkt', TYPES.VarChar, req.params.idTeacher);
        request.addParameter('fks', TYPES.NVarChar, req.params.idGradeSubject);
        connection.execSql(request);
    }
}
exports.insertTeaches = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("INSERT INTO teaches(fkTeacher, fkGradeSubject, fkGradeGroup) VALUES(@fkt, @fks, @fkg); select @@identity", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            result = {
                idTeaches: columns[0].value,
                fkTeacher: req.body.fkTeacher,
                fkSubject: req.body.fkGradeSubject,
                fkGradeGroup: req.body.fkGradeGroup
            };
        });

        request.on('doneProc', function (rowCount, more) {
            res.send(result);
        });
        request.addParameter('fkt', TYPES.VarChar, req.body.fkTeacher);
        request.addParameter('fks', TYPES.VarChar, req.body.fkGradeSubject);
        request.addParameter('fkg', TYPES.VarChar, req.body.fkGradeGroup);
        connection.execSql(request);
    }
}
exports.updateTeaches = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("UPDATE teaches SET fkTeacher = @fkt, fkGradeSubject = @fks, fkGradeGroup = @fkg WHERE idTeaches = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });

        request.addParameter('fkt', TYPES.VarChar, req.body.fkTeacher);
        request.addParameter('fks', TYPES.NVarChar, req.body.fkGradeSubject);
        request.addParameter('fkg', TYPES.NVarChar, req.body.fkGradeGroup);
        request.addParameter('id', TYPES.Int, req.params.idTeaches);
        connection.execSql(request);
    }
}
exports.deleteTeaches = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("DELETE FROM teaches WHERE idTeaches = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });
        request.addParameter('id', TYPES.Int, req.params.idTeaches);
        connection.execSql(request);
    }
}