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


exports.getParticipation = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("select p.idParticipation, p.fkGradeEvent, p.fkPupil, p.grade, p.abscent from participation p", function (err) {
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


exports.insertParticipation = function (req, res) {
    var data = req.body;
    var results = [];
    var requestString = "";
    var i = 0;
    data.forEach(function (item) {
        requestString = requestString + "INSERT INTO participation ( fkGradeEvent, fkPupil, grade, abscent ) VALUES ";
        requestString = requestString + "(" + req.params.fkGradeEvent + ", " + item.fkPupil + ", " + item.grade + ", " + item.abscent + ")";
        requestString = requestString + "; select @@identity; ";
    });
    console.log(requestString);

    var connection = new Connection(config);
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request(requestString, function (err) {
            if (err) {
                console.log(err);
            }
        });

        request.on('row', function (columns) {
            console.log(columns[0].value);
            results.push({
                "idParticipation": columns[0].value,
                "fkGradeEvent": req.params.fkGradeEvent,
                "fkPupil": data[i].fkPupil,
                "grade": data[i].grade,
                "abscent": data[i].abscent
            });
            
        });

        request.on('doneProc', function (rowCount, more) {
            res.send(results);
        });

        connection.on('debug', function (err) { console.log('debug:', err); });
        connection.execSql(request);
    }





}


exports.updateParticipation = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("UPDATE participation SET grade = @g, abscent = @a WHERE idParticipation = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });
        request.addParameter('g', TYPES.Int, req.body.grade);
        request.addParameter('a', TYPES.Int, req.body.abscent);
        request.addParameter('id', TYPES.Int, req.params.idParticipation);
        
        connection.execSql(request);
    }
}

exports.deleteParticipation = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("DELETE FROM participation WHERE idParticipation = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });
        request.addParameter('id', TYPES.Int, req.params.idParticipation);
        connection.execSql(request);
    }
}

exports.getParticipationByPupilAndTeaches = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("SELECT p.fkGradeEvent, p.fkPupil, p.grade, p.abscent, e.fkTeaches FROM participation p inner join gradeevent e on" +
            " e.idGradeEvent = p.fkGradeEvent WHERE p.fkPupil = @fkp AND e.fkTeaches = @fkt", function (err) {
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
        request.addParameter('fkp', TYPES.Int, req.params.idPupil);
        request.addParameter('fkt', TYPES.Int, req.params.idTeaches);
        connection.execSql(request);
    }


}

exports.getParticipationByEvent = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("SELECT p.idParticipation, p.fkGradeEvent, p.fkPupil, p.grade, p.abscent from participation p where p.fkGradeEvent = @fke", function (err) {
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
        
        
        request.addParameter('fke', TYPES.Int, req.params.idEvent);
        connection.execSql(request);
    }


}