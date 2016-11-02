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

exports.getEvents = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("select e.idGradeEvent, e.fkTeaches, e.eventDate, e.eventDescription from GradeEvent e", function (err) {
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
exports.insertEvent = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("INSERT INTO GradeEvent(fkTeaches, eventDate, eventDescription) VALUES(@fkt, @date, @desc); select @@identity", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            result = {
                idGradeEvent: columns[0].value,
                fkTeaches: req.body.fkTeaches,
                eventDate: req.body.eventDate,
                eventDescription: req.body.eventDescription
            };
        });

        request.on('doneProc', function (rowCount, more) {
            res.send(result);
        });
        request.addParameter('fkt', TYPES.VarChar, req.body.fkTeaches);
        request.addParameter('date', TYPES.VarChar, req.body.eventDate);
        request.addParameter('desc', TYPES.VarChar, req.body.eventDescription);
        connection.execSql(request);
    }
}
exports.updateEvent = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("UPDATE GradeEvent SET fkTeaches = @fkt, eventDate = @date, eventDescription = @desc WHERE idGradeEvent = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });

        request.addParameter('fkt', TYPES.Int, req.body.fkTeaches);
        request.addParameter('date', TYPES.Date, req.body.eventDate);
        request.addParameter('desc', TYPES.VarChar, req.body.eventDescription);
        request.addParameter('id', TYPES.Int, req.params.idGradeEvent);
        connection.execSql(request);
    }
}
exports.deleteEvent = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("DELETE FROM GradeEvent WHERE idGradeEvent = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });
        request.addParameter('id', TYPES.Int, req.params.idGradeEvent);
        connection.execSql(request);
    }
}