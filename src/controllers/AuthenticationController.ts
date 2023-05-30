import e, {Request, Response} from 'express';
import {checkSchema} from 'express-validator';
import AbstractController from './AbstractController';
//import UserModel from '../modelsNOSQL/userNOSQL/'
import db from '../models'
import UserModel from '../modelsNOSQL/userNOSQL';

class AuthenticationController extends AbstractController{
    protected validateBody(type: any) {
        throw new Error("Method not implemented.");
    }
    //Singleton
    //Atributo de clase
    private static instance:AuthenticationController;
    //Método de clase
    public static getInstance():AuthenticationController{
        if(this.instance){
            return this.instance;
        }
        this.instance = new AuthenticationController('cliente');
        return this.instance;
    }
    protected initRoutes(): void {
        this.router.post('/signup', this.signup.bind(this));
        this.router.post('/verify', this.verify.bind(this));
        this.router.post('/signin', this.signin.bind(this));
        this.router.get('/test', this.authMiddleware.verifyToken, this.test.bind(this));
        this.router.get('/testTokenRoler', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsAdmin, this.testTokenRoler.bind(this));
    }

    private async testTokenRoler(req:Request,res:Response){
        res.status(200).send("Esto es una prueba de verificación de token y rol de usuario");
    }

    private async test(req:Request,res:Response){
      try {
        const user = await UserModel.get('d121c36e-3760-4dfc-b65b-e6d213da17b8');
        res.status(200).send({ message: "Esto es una prueba", user: user });
      } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ message: "Error retrieving user", error: error.message });
        } else {
            res.status(500).send({ message: "Error retrieving user", error: "Unknown error" });
        }
      }
        //res.status(200).send("Esto es una prueba");
    }

    private async verify(req:Request,res:Response){
        const {email, code} = req.body;
        try{
            await this.cognitoService.verifyUser(email, code);
            return res.status(200).send({message:"User verified"}).end();
        }catch(error:any){
            return res.status(500).send({code:error.code, message:error.message}).end();
        }
    }

    private async signin(req:Request,res:Response){
        const {email, password} = req.body;
        try{
            const login = await this.cognitoService.signInUser(email, password);
            res.status(200).send({...login.AuthenticationResult});
        }catch(error:any){
            return res.status(500).send({code:error.code, message:error.message})
        }
    }

    private async signup(req:Request,res:Response){
        const {email, password, name, role} = req.body;
        try{
            const user = await this.cognitoService.signUpUser(email, password, [
                {
                Name: 'email',
                Value: email
            }
        ])
        await UserModel.create(
            {
                awsCognitoId:user.UserSub,
                name,
                role,
                email,
                accountId:user.UserSub.substring(0, 8),
                balance:0,
            },
            {
                overwrite:false
            }
        )
        console.log("Usuario guardado en base de datos NoSQL");
        console.log("Usuario creado correctamente", user);
        res.status(201).send({message:"Usuario registrado", user});
        }catch(error:any){
            return res.status(500).send({code:error.code, message:error.message})
        }
    }

}

export default AuthenticationController;
