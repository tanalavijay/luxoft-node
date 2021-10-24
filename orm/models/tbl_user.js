//user table 
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tbl_user', {
     user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      user_name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      user_email: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      user_role: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      is_active: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: '1'
      },
      is_deleted: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: '0'
      },
      created_by: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      modified_by: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      tableName: 'tbl_user',
      updatedAt: 'modified_date',
      createdAt: 'created_date',
      hooks : {
        beforeValidate : function(instance, options) {
          if(!options.userId)
            return sequelize.Promise.reject("Session expired. Please login again");
          let userId = options.userId;
          instance['created_by'] = userId;
          instance['modified_by'] = userId;
        }
      }
    });
  };