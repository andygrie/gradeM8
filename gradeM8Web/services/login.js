var ActiveDirectory = require('activedirectory');
var config = {
    url: 'ldap://212.152.179.122',
    //url: 'ldap://192.168.128.253',
    baseDN: 'ou=EDVO,ou=schueler,ou=Benutzer,dc=htl-vil,dc=local'
}

exports.login = function (req, res) {
    var username = req.body.username + '@htl-vil';
    var password = req.body.password;
    var ad = new ActiveDirectory(config);

    

    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
        }

        if (auth) {
            findTeacher(ad, req.body.username, req.body.password, res);
        }
        else {
            res.status(403);
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
            var teacher = {
                email: user.mail,
                forename: user.givenName,
                surname: user.sn,
                username: user.cn
            }
            res.send(teacher);
        }
    });
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