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


var atob = require('atob');
var ActiveDirectory = require('activedirectory');
var adConfig = {
    url: 'ldap://212.152.179.122',
    //url: 'ldap://192.168.128.253',
    baseDN: 'ou=schueler,ou=Benutzer,dc=htl-vil,dc=local'
}

var username = 'griessera@htl-vil';
var password = atob('emFzcDI1');

exports.getClasses = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("select c.idClass, c.name, c.room from class c", function (err) {
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
exports.insertClass = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("INSERT INTO class(name, room) VALUES(@name, @room); select @@identity", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            result = {
                idClass: columns[0].value,
                name: req.body.name,
                room: req.body.room
            };
        });

        request.on('doneProc', function (rowCount, more) {
            res.send(result);
        });
        request.addParameter('name', TYPES.VarChar, req.body.name);
        request.addParameter('room', TYPES.VarChar, req.body.room);
        connection.execSql(request);
    }
}
exports.updateClass = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("UPDATE class SET name = @name, room = @room WHERE idClass = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });

        request.addParameter('name', TYPES.VarChar, req.body.name);
        request.addParameter('room', TYPES.NVarChar, req.body.room);
        request.addParameter('id', TYPES.Int, req.params.idClass);
        connection.execSql(request);
    }
}
exports.deleteClass = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("DELETE FROM class WHERE idClass = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });
        request.addParameter('id', TYPES.Int, req.params.idClass);
        connection.execSql(request);
    }
}
exports.getClassesFromAD = function (req, res) {
    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
        }

        if (auth) {
            getGroupsFromAD();
        }
        else {
            res.status(400);
            res.send('wrong credentials');
        }
    });


    function getGroupsFromAD() {

        ad.opts.bindDN = username;
        ad.opts.bindCredentials = password;

        var query = '';

        ad.findGroups(query, function (err, groups) {
            if (err) {
                console.log('ERROR: ' + JSON.stringify(err));
                return;
            }

            if ((!groups) || (groups.length == 0)) console.log('No groups found.');
            else {
                console.log('findGroups: ' + JSON.stringify(groups));
                var classes = [];
                for (var i = 0; i < groups.length; i++) {
                    classes.push({
                        name: groups[i].cn
                    });
                }
                res.send(classes);
            }
        });
    }
}