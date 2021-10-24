
const bcrypt = require('bcryptjs');
const ORM = require('../../associations/table_associations');
const functions = require('../../../lib/functions');

//user login api
exports.userLogin = function (req) {
    try {
        let data = req.body;
        if (!data.email || !data.password)
            return { auth: false, message: 'Invalid params' };
        const User = ORM.model('tbl_user');
        return User.findAll({
                where: { "user_email": data.email, "is_deleted": 0 },
            }
        ).then(async userdata => {
            if (userdata.length !== 0) {
                if (!bcrypt.compareSync(data.password, userdata[0].password))
                    return { auth: false, message: 'Invalid Username or Password', statusCode: 401};
                let dId = functions.encrypt(userdata[0].user_id.toString());
                let rmd = functions.randomValueBase64(20);
                let accessToken = functions.encrypt(rmd);
                req.session.userId = dId;
                req.session.userToken = accessToken;
                return { auth: true,message:"login succussfull",id: userdata[0].user_id,name: userdata[0].user_name,email: userdata[0].user_email, role:userdata[0].user_role,auth_token: accessToken};
            } else {
                return { auth: false, message: 'User not found',statusCode: 404 };
            }
        }).catch(err => {
            console.log(err);
            return { auth: false, message: 'Something went wrong' };
        });
    } catch (err) {
        console.log(err);
        return { auth: false, message: 'Something went wrong' };
    }
}

//get particular user data api
exports.getUserData = function(req) {
    return new Promise(async function(resolve,reject) {
        try {
            let data = req.params;
            let queryWhere = {}
            if(data.userId){
                queryWhere['user_id'] = data.userId
            }
            const Users = ORM.model('tbl_user');
            return Users.findAll({ 
                attributes:["user_name","user_role","user_email"], where:queryWhere,raw:true
                }).then(results => {
                  return resolve({"success":true, "results":results});
            }).catch(err => {
                console.log(err);
                return reject({"success":false});
            });
        }
        catch(err) {
            console.log(err);
            return reject({success:false , message:"Something went wrong"});
        }
    });
}

//get all users data api
exports.getAllUsersData = function(req) {
    return new Promise(async function(resolve,reject) {
        try {
            const Users = ORM.model('tbl_user');
            return Users.findAll({ 
                attributes:["user_name","user_role","user_email"],raw:true
                }).then(async results => {
                    let result = await sortOn(results);
                   if(result.success){
                      return resolve({"success":true, "results":result.results});
                   }else{
                      return reject({"success":false});
                   }
            }).catch(err => {
                console.log(err);
                return reject({"success":false});
            });
        }
        catch(err) {
            console.log(err);
            return reject({success:false , message:"Something went wrong"});
        }
    });
}

//for sorting output by user name
async function sortOn(property){
    return new Promise(async function(resolve, reject){
       let op = property.sort(function(a, b) {
            return a.user_name.localeCompare(b.user_name);
        });
        if(op){
          return resolve({"success": true,results:op});
        }else{
            return reject({"success": false,results:null});
        }
    });
}