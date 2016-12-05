exports.login = function (req, res) {
    var ActiveDirectory = require('activedirectory');
    var config = {
        url: 'ldap://212.152.179.122',
        //url: 'ldap://192.168.128.253',
        baseDN: 'ou=EDVO,ou=schueler,ou=Benutzer,dc=htl-vil,dc=local'
    }
    var username = req.body.username + '@htl-vil';
    var password = req.body.password;
    console.log('user: ' + username + ', pw: ' + password);
    var ad = new ActiveDirectory(config);

    

    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
        }

        if (auth) {
            //res.send({
            //    'message': 'authenticated'
            //});
            var sAMAccountName = 'griessera';
            ad.opts.bindDN = username;
            ad.opts.bindCredentials = password;
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
            var query = '';
            ad.findUsers(query, function (err, users) {
                if (err) {
                    console.log('ERROR: ' + JSON.stringify(err));
                    res.send({
                        'message': 'ERROR: ' + JSON.stringify(users)
                    });
                    return;
                }

                if ((!users) || (users.length == 0)) {
                    res.send({
                        'message': 'No users found.'
                    });
                    console.log('No users found.');
                }
                else {
                    //console.log('findUsers: ' + JSON.stringify(users));
                    for (var idx in users){
                        console.log(users[idx].sAMAccountName + ' ' + users[idx].sn + ' ' + users[idx].givenName + ' ' + users[idx].mail + ' ' + users[idx].OU);
                    }
                    res.send({
                        'message': 'findUsers: ' + JSON.stringify(users)
                    });
                }
            });
        }
        else {
            res.send({
                'message': 'authentication failed'
            });
        }
    });
}