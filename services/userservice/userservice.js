
//Importing user dao
const userdao = require('../../orm/daos/userdao/userdao');

//login api service
exports.userLogin = async function(req, res) {
    try {
        userdao.userLogin(req).then(data => {
            res.json(data);
        }).catch(error => {
            console.log(error);
            res.status(401).json(error);
        });
    } catch(error) {
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

//get user api service
exports.getUserData = async function (req, res) {
    try {
        userdao.getUserData(req).then(data => {
            res.json(data);
        }).catch(error => {
            console.log(error);
            res.json(error);
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ "message": "Failed to process reques" });
    }
}

//get all users api service
exports.getAllUsersData = async function (req, res) {
    try {
        userdao.getAllUsersData(req).then(data => {
            res.json(data);
        }).catch(error => {
            console.log(error);
            res.json(error);
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ "message": "Failed to process reques" });
    }
}