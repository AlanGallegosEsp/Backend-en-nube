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
    this.router.get('/saldo',this.authMiddleware.verifyToken, this.getBalance.bind(this));
    this.router.post('/retiro',  this.authMiddleware.verifyToken, this.sendPayment.bind(this));
    this.router.post('/deposito', this.createPayment.bind(this));
  }

  protected validateBody(type: any) {
    throw new Error('Method not implemented.');
  }



  private async getBalance(req: Request, res: Response) {
    const {accountId} = req.body;
    try {
        const user: any = await UserModel.get(accountId)
      if (user) {
        const balance = user.get('balance');
        res.status(200).send({message:"Bienvenido",  balance });
      } else {
        res.status(404).json({ message: "User account not found" });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Error", error: error.message });
      } else {
        res.status(500).json({ message: "Error", error: "Unknown error" });
      }
    }
  }
  

  

  private async createPayment(req: Request, res: Response) {
    const { no_cuenta, cantidad } = req.body;

    if (!no_cuenta || !cantidad) {
        return res.status(400).send({ message: "Faltan parametros" });
    }
    if (cantidad <= 0) {
        return res.status(400).send({ message: "La cantidad debe ser mayor a cero" });
    }
    const awsCognitoId = no_cuenta;
    try {
        UserModel.update({
            awsCognitoId,
            balance: {
                $add: cantidad
            }
        }, (err, acc) => {
            if (err) {
                res.status(500).send({message: "Error", error: err.message});
            } else {
                res.status(200).send({ message: "Deposito exitoso", saldo: acc.get('balance')});
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ message: "Error", error: error.message });
        } else {
            res.status(500).send({ message: "Error", error: "Unknown error" });
        }
    }
  }

  private async sendPayment(req: Request, res: Response) {
    const { no_cuenta, cantidad } = req.body;

    if (!no_cuenta || !cantidad) {
        return res.status(400).send({ message: "Faltan parametros" });
    }

    const amount = cantidad > 0 ? -cantidad : cantidad;

    const awsCognitoId = no_cuenta;

    try {
        const user: any = await UserModel.get(awsCognitoId);
        if (user) {
            const currentBalance = user.get('balance');
            if (currentBalance + amount < 0) {
                return res.status(400).send({ message: "Saldo insuficiente" });
            }
            UserModel.update({
                awsCognitoId,
                balance: {
                    $add: amount
                }
            }, (err, acc) => {
                if (err) {
                    res.status(500).send({message: "Error", error: err.message});
                } else {
                    res.status(200).send({ message: "Retiro exitoso", saldo: acc.get('balance')});
                }
            });
        } else {
            res.status(404).send({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ message: "Error", error: error.message });
        } else {
            res.status(500).send({ message: "Error", error: "Unknown error" });
        }
    }
  }
}

