import Server from "./providers/Server";
import express from "express";
import cors from 'cors';
import UserController from "./controllers/UserController";
import AuthenticationController from "./controllers/AuthenticationController";
import D_PaymentsController from "./controllers/DPaymentsController";

const app = new Server({
    port:8080,
    middlewares:[
        express.json(),
        express.urlencoded({extended:true}),
        cors()
    ],
    controllers:[
        UserController.getInstance(),
        AuthenticationController.getInstance(),
        D_PaymentsController.getInstance()
    ],
    env:'development'
});

declare global{
    namespace Express{
        interface Request{
            user:string;
            token:string;
        }
    }
}

app.init();