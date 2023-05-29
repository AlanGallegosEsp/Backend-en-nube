import e, { Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import AbstractController from './AbstractController';
import UserModel from '../modelsNOSQL/userNOSQL';
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export default class D_PaymentsController extends AbstractController {
  private static instance: D_PaymentsController;

  public static getInstance(): D_PaymentsController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new D_PaymentsController('cuenta');
    return this.instance;
  }

  protected initRoutes(): void {
    // Implement the routes for the D_Payments controller
    this.router.get('/saldo', this.getBalance.bind(this));
    this.router.post('/retiro',  this.authMiddleware.verifyToken, this.sendPayment.bind(this));
    this.router.post('/deposito', this.createPayment.bind(this));
  }

  protected validateBody(type: any) {
    throw new Error('Method not implemented.');
  }



  private async getBalance(req: Request, res: Response) {
    const { numcuent } = req.body;
  
    try {
      const params = {
        TableName: 'YourDynamoDBTableName',
        KeyConditionExpression: 'numcuent = :numcuent',
        ExpressionAttributeValues: {
          ':numcuent': numcuent,
        },
      };
  
      const result = await dynamoDB.query(params).promise();
  
      // Assuming the balance is stored in the 'balance' attribute of the DynamoDB item
      const items = result.Items;
      
      if (items && items.length > 0) {
        const balance = items[0].balance;
        res.status(200).json({ balance }); // Respond with the retrieved balance
      } else {
        res.status(404).json({ message: 'Balance not found' });
      }
    } catch (error) {
      console.error('Error retrieving data from DynamoDB:', error);
      res.status(500).send('Error retrieving data from DynamoDB');
    }
  }

  

  private async createPayment(req: Request, res: Response) {
    res.status(200).send('Esto es una prueba');



  }

  private async sendPayment(req: Request, res: Response) {
    const { numcuent, money } = req.body;

    try {
      const params = {
        TableName: 'YourDynamoDBTableName',
        KeyConditionExpression: 'numcuent = :numcuent',
        ExpressionAttributeValues: {
          ':numcuent': numcuent,

        },
      };

      const result = await dynamoDB.query(params).promise();

      res.status(200).send('Data retrieved successfully');
    } catch (error) {
      console.error('Error retrieving data from DynamoDB:', error);
      res.status(500).send('Error retrieving data from DynamoDB');
    }
  }
}
