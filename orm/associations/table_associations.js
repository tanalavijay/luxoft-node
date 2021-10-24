
var filesystem = require('fs');
var models = {};

//creating instance for connecting to db
var association = function association() {
    var Sequelize = require("sequelize");
    var DataTypes = require("sequelize").DataTypes;
    var sequelize = null;
    var modelsPath = "";
    var logger;
    this.setup = function (path, database, username, password,consoleLogger, obj){
        modelsPath = path;
        logger = consoleLogger;
        sequelize = new Sequelize(database, username, password,obj);     
        sequelize.authenticate().then(function(result) {
            console.log("connected to db " + database);
            console.log(database + " => " + username + " => " + password );
        }).catch(function(err) {
            console.log(err);
        });
        init();
    }
    
    this.model = function (name){
        return models[name];
    }
    
    this.Seq = function (){
        return Sequelize;
    }
    
    this.getObj = function() {
        return sequelize;
    }
    
    function init() {
        filesystem.readdirSync(modelsPath).forEach(function(name){
            if(name.indexOf(".swp") == -1) {
                var modelName = name.replace(/\.js$/i, "");
                var object = require("../models/" + modelName)(sequelize,DataTypes);
                models[modelName] = object;
            }
            else {
                logger.log(name);
            }
        });
    }
}

association.instance = null;

association.getInstance = function() {
    if(this.instance === null){
        this.instance = new association();
    }
    return this.instance;
}

module.exports = association.getInstance();

