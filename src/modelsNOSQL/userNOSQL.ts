import dynamodb from '../services/dynamoService';
import joi from 'joi';
import { PREFIX_TABLE } from '../config';

export enum UserRoles {
	ADMIN = 'ADMIN',
	SUPERVISOR = 'SUPERVISOR',
	AGENT = 'AGENT',
	CUSTOMER = 'CUSTOMER',
}

const UserModel = dynamodb.define('user',{
    hashKey:'awsCognitoId',
    timestamps:true,
    schema:{
        awsCognitoId: joi.string().required(),
		name: joi.string().required(),
		role: joi.string().required().default(UserRoles.AGENT),
		email: joi.string().required().email(),
    accountId: joi.string().required(),
    balance: joi.required(),
    },
    tableName:`User${PREFIX_TABLE}`,
    indexes: [
		{
			hashKey: 'email',
			name: 'EmailIndex',
			type: 'global',
		},
	],
});

UserModel.get('awsCognitoId', function(err, user) {
    if (err) {
        console.log('Error retrieving user: ', err);
    } else {
        console.log('User data: ', user);
    }
});

// dynamodb.createTables((err:any)=>{
//     if(err)
//         return console.log('Error al crear la tabla',err);
//     console.log('Tabla creada exitosamente');
// })

export default UserModel;
