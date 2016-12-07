var ActiveDirectory = require('activedirectory');
var adConfig = {
    //url: 'ldap://212.152.179.122',
    url: 'ldap://192.168.128.253',
    baseDN: 'ou=EDVO,ou=schueler,ou=Benutzer,dc=htl-vil,dc=local'
}
var atob = require('atob');

var sql = require('mssql');
var ted = require('tedious');

var Connection = ted.Connection;
var dbConfig = {
    userName: 'grademin',
    password: 'Grade2016',
    server: 'grade-server.database.windows.net',
    options: { encrypt: true, database: 'gradeDB' }
};
var Request = ted.Request;
var TYPES = ted.TYPES;  


exports.login = function (req, res) {
    var username = req.body.username + '@htl-vil';
    var b64string = req.body.password;
    var password = atob(b64string);


    var ad = new ActiveDirectory(adConfig);

    

    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
        }

        if (auth) {
            findTeacher(ad, req.body.username, password, res);
        }
        else {
            res.status(400);
            res.send('wrong credentials');
        }
    });
}
function findTeacher(ad, username, password, res) {
    ad.opts.bindDN = username + '@htl-vil';
    ad.opts.bindCredentials = password;
    ad.findUser(username, function (err, user) {
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
            searchUserInDB(user,res);
        }
    });
}
function searchUserInDB(user, res) {
    var connection = new Connection(dbConfig);
    connection.on('connect', executeStatement);
    var result = {};
    var isInDB = false;
    function executeStatement() {
        request = new Request("SELECT u.idUser from gradeUser u WHERE u.username = @username", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('row', function (columns) {
            isInDB = true;
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result[column.metadata.colName] = column.value;
                }
            });
        });

        request.on('doneProc', function (rowCount, more) {
            if (isInDB) {
                var teacher = {
                    email: user.mail,
                    forename: user.givenName,
                    idUser: result.idUser,
                    surname: user.sn,
                    username: user.cn
                }
                res.send(teacher);
            }
            else {
                insertUser(user, res);
            }
        });
        request.addParameter('username', TYPES.VarChar, user.cn);
        connection.execSql(request);
    }
}
function insertUser(user, res) {
    var connection = new Connection(dbConfig);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("INSERT INTO gradeUser(username) VALUES(@username); select @@identity", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            result = {
                idUser: columns[0].value
            };
        });

        request.on('doneProc', function (rowCount, more) {
            var teacher = {
                email: user.mail,
                forename: user.givenName,
                idUser: result.idUser,
                surname: user.sn,
                username: user.cn
            }
            res.send(teacher);
            insertTeacher(result.idUser);
        });
        request.addParameter('username', TYPES.VarChar, user.cn);
        connection.execSql(request);
    }
}
function insertTeacher(idUser) {
    var connection = new Connection(dbConfig);
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

exports.getAllUser = function (req, res) {
//var sAMAccountName = 'griessera';
            //ad.opts.bindDN = username;
            //ad.opts.bindCredentials = password;
            //ad.findUser(sAMAccountName, function (err, user) {
            //    if (err) {
            //        console.log('ERROR: ' + JSON.stringify(err));
            //        res.send({
            //            'message': 'ERROR: ' + JSON.stringify(err)
            //        });
            //        return;
            //    }

            //    if (!user) {
            //        console.log('User: ' + sAMAccountName + ' not found.');
            //        res.send({
            //            'message': 'User: ' + sAMAccountName + ' not found.'
            //        });
            //    }
            //    else {
            //        console.log(JSON.stringify(user));
            //        res.send({
            //            'message': JSON.stringify(user)
            //        });
            //    }
            //});


            //var groupName = '5BHIFS';

            //ad.getUsersForGroup(groupName, function (err, users) {
            //    if (err) {
            //        console.log('ERROR: ' + JSON.stringify(err));
            //        res.send({
            //            'message': 'ERROR: ' + JSON.stringify(err)
            //        });
            //        return;
            //    }

            //    if (!users) {
            //        console.log('Group: ' + groupName + ' not found.');
            //        res.send({
            //            'message': 'Group: ' + groupName + ' not found.'
            //        });
            //    }
            //    else {
            //        console.log(JSON.stringify(users));
            //        res.send({
            //            'message': JSON.stringify(users)
            //        });
            //    }
            //});
            //var query = '';
            //ad.findUsers(query, function (err, users) {
            //    if (err) {
            //        console.log('ERROR: ' + JSON.stringify(err));
            //        res.send({
            //            'message': 'ERROR: ' + JSON.stringify(users)
            //        });
            //        return;
            //    }

            //    if ((!users) || (users.length == 0)) {
            //        res.send({
            //            'message': 'No users found.'
            //        });
            //        console.log('No users found.');
            //    }
            //    else {
            //        //console.log('findUsers: ' + JSON.stringify(users));
            //        for (var idx in users){
            //            console.log(users[idx].sAMAccountName + ' ' + users[idx].sn + ' ' + users[idx].givenName + ' ' + users[idx].mail + ' ' + users[idx].OU);
            //        }
            //        res.send({
            //            'message': 'findUsers: ' + JSON.stringify(users)
            //        });
            //    }
            //});
}