'use strict';

import {Model} from 'sequelize';

interface UserAttributes{
  awsCognitoId:string,
  name:string,
  role:string,
  email:string,
  accountId:string,
  balance:number,
}

export enum UserRoles{
  ADMIN = 'ADMIN',
  SUPERVISOR = "SUPERVISOR",
  AGENT = "AGENT",
  CUSTOMER = "CUSTOMER"
}

module.exports = (sequelize:any, DataTypes:any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    awsCognitoId!: string;
    name!: string;
    role!: string;
    email!: string;
    accountId!: string;
    balance!: number;
    static associate(models:any) {
      // define association here
      User.belongsToMany(models.Project,{
          through:'ProjectUser'
      })
    }
  


  }
  User.init({
    awsCognitoId:{
      type: DataTypes.STRING,
      allowNull:false,
      primaryKey: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    role:{
      type:DataTypes.STRING,
      allowNull:false,
      defaultValue:UserRoles.CUSTOMER
    },
    accountId: DataTypes.STRING,
    balance: DataTypes.NUMBER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
